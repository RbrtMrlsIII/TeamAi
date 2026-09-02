import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { ConversationOrchestrator, type CreateConversationInput } from '../orchestrator.js';
import type { Participant } from '../domain.js';
import { assertParticipantLimit, type PlanCode } from '../billing/tiers.js';
import { transition, type WorkflowEvent, type WorkflowState } from '../state/workflow.js';

export interface ApiDependencies { orchestrator: ConversationOrchestrator; resolvePlan(userId:string): Promise<PlanCode>; catalog?: { listModels(input:{userPlan?:string;provider?:string;capability?:string}): Promise<unknown[]> }; }

function json(res:any,status:number,body:unknown){res.writeHead(status,{'content-type':'application/json'});res.end(JSON.stringify(body));}
async function body(req:any):Promise<any>{const chunks:any[]=[];for await(const c of req)chunks.push(Buffer.from(c)); const text=Buffer.concat(chunks).toString('utf8'); return text?JSON.parse(text):{};}

export function createApiServer(deps:ApiDependencies){
  const workflows=new Map<string,WorkflowState>();
  return createServer(async(req:any,res:any)=>{
    try {
      const url=new URL(req.url??'/', 'http://localhost');
      if(req.method==='GET'&&url.pathname==='/health') return json(res,200,{ok:true});
      if(req.method==='GET'&&url.pathname==='/v1/catalog/models'){ const userId=url.searchParams.get('userId')??'anonymous'; const provider=url.searchParams.get('provider')??undefined; const capability=url.searchParams.get('capability')??undefined; const plan=await deps.resolvePlan(userId); if(!deps.catalog) return json(res,200,{plan,models:[]}); return json(res,200,{plan,models:await deps.catalog.listModels({userPlan:plan,provider,capability})}); }
      if(req.method==='POST'&&url.pathname==='/v1/conversations'){
        const b=await body(req); const participants=(b.participants??[]) as Participant[]; const plan=await deps.resolvePlan(String(b.userId??'anonymous'));
        assertParticipantLimit(plan,participants.length);
        const input:CreateConversationInput={id:b.id??randomUUID(),projectId:b.projectId,title:b.title,maxTurns:b.maxTurns, maxWords:b.maxWords, participants, schedulingMode:b.schedulingMode, teamLeaderModelId:b.teamLeaderModelId, leaderCheckInterval:b.leaderCheckInterval};
        const c=await deps.orchestrator.createConversation(input); workflows.set(c.id,'discussion'); return json(res,201,c);
      }
      const human=req.method==='POST'&&url.pathname.match(/^\/v1\/conversations\/([^/]+)\/messages$/);
      if(human){const b=await body(req);const m=await deps.orchestrator.addHumanMessage(human[1]!,String(b.content??''));return json(res,201,m);}
      const run=req.method==='POST'&&url.pathname.match(/^\/v1\/conversations\/([^/]+)\/run$/);
      if(run){const b=await body(req);return json(res,200,await deps.orchestrator.run(run[1]!,Number(b.turns??1)));}
      const skip=req.method==='POST'&&url.pathname.match(/^\/v1\/conversations\/([^/]+)\/participants\/([^/]+)\/skip$/);
      if(skip){const b=await body(req);return json(res,200,await deps.orchestrator.skipParticipant(skip[1]!,decodeURIComponent(skip[2]!),String(b.reason??'user_skipped') as any));}
      const lead=req.method==='POST'&&url.pathname.match(/^\/v1\/conversations\/([^/]+)\/supervise$/);
      if(lead){const report=await deps.orchestrator.supervise(lead[1]!);return json(res,200,report??{status:'disabled'});}
      const wf=req.method==='POST'&&url.pathname.match(/^\/v1\/workflows\/([^/]+)\/event$/);
      if(wf){const b=await body(req); const state=workflows.get(wf[1]!)??'discussion'; const next=transition(state,b.event as WorkflowEvent);workflows.set(wf[1]!,next);return json(res,200,{workflowId:wf[1],state:next});}
      return json(res,404,{error:'not_found'});
    } catch(error){return json(res,400,{error:error instanceof Error?error.message:'bad_request'});}
  });
}
