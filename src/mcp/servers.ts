import type { McpServer, McpTool, ApprovalGate } from './types.js';

export class WorkspaceMcpServer implements McpServer {
  readonly id='workspace';
  constructor(private readonly files: Map<string,string> = new Map()) {}
  async listTools():Promise<McpTool[]>{return [{name:'workspace.read_file',description:'Read a project file',inputSchema:{path:'string'}},{name:'workspace.write_file',description:'Write a project file',inputSchema:{path:'string',content:'string'}}];}
  async callTool(name:string,args:Record<string,unknown>):Promise<unknown>{ const path=String(args.path??''); if(!path||path.includes('..')) throw new Error('invalid workspace path'); if(name==='workspace.read_file') return {content:this.files.get(path)??null}; if(name==='workspace.write_file'){this.files.set(path,String(args.content??''));return {ok:true};} throw new Error('tool not found'); }
}

export class HumanApprovalMcpServer implements McpServer {
  readonly id='human-approval';
  constructor(private readonly gate: ApprovalGate) {}
  async listTools(){return [{name:'human.request_approval',description:'Request explicit human approval',inputSchema:{projectId:'string',action:'string',payload:'object'}}];}
  async callTool(name:string,args:Record<string,unknown>){ if(name!=='human.request_approval') throw new Error('tool not found'); return this.gate.request({projectId:String(args.projectId),action:String(args.action),payload:args.payload}); }
}

export class ExternalMcpServer implements McpServer {
  constructor(readonly id:string, private readonly baseUrl:string, private readonly transport:(url:string,body:unknown)=>Promise<unknown>){}
  async listTools():Promise<McpTool[]>{return this.transport(`${this.baseUrl}/tools/list`,{}) as Promise<McpTool[]>;}
  async callTool(name:string,args:Record<string,unknown>):Promise<unknown>{return this.transport(`${this.baseUrl}/tools/call`,{name,args});}
}
