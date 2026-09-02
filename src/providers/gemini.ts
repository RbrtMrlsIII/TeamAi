import type {AIProvider,GenerateRequest,GenerateResult,ModelInfo,StreamChunk} from './types.js';
import {fetchJson,parseSse} from './http.js';

export class GeminiProvider {
  constructor(public readonly provider='gemini',private readonly key=process.env.GEMINI_API_KEY??'',private readonly base='https://generativelanguage.googleapis.com/v1beta'){}
  private authHeaders(){return {'content-type':'application/json','x-goog-api-key':this.key}}
  async generate(req:GenerateRequest):Promise<GenerateResult>{
    if(!this.key) throw new Error('GEMINI_API_KEY not configured');
    const contents=req.messages.filter(m=>m.role!=='system').map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}]}));
    const system=req.messages.find(m=>m.role==='system')?.content;
    const body={contents,...(system?{systemInstruction:{parts:[{text:system}]}}:{}),generationConfig:{maxOutputTokens:req.maxOutputTokens,temperature:req.temperature}};
    const {data,requestId}=await fetchJson(`${this.base}/models/${encodeURIComponent(req.model)}:generateContent`,{method:'POST',headers:this.authHeaders(),body:JSON.stringify(body)});
    const usage=data.usageMetadata??{};
    return {provider:this.provider,model:req.model,requestId:data.responseId??requestId??'',text:(data.candidates?.[0]?.content?.parts??[]).map((p:any)=>p.text??'').join(''),usage:{inputTokens:usage.promptTokenCount??0,outputTokens:usage.candidatesTokenCount??0,totalTokens:usage.totalTokenCount??(usage.promptTokenCount??0)+(usage.candidatesTokenCount??0)}};
  }
  async *stream(req:GenerateRequest):AsyncIterable<StreamChunk>{
    if(!this.key) throw new Error('GEMINI_API_KEY not configured');
    const contents=req.messages.filter(m=>m.role!=='system').map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}]}));
    const system=req.messages.find(m=>m.role==='system')?.content;
    const body={contents,...(system?{systemInstruction:{parts:[{text:system}]}}:{}),generationConfig:{maxOutputTokens:req.maxOutputTokens,temperature:req.temperature}};
    const r=await fetch(`${this.base}/models/${encodeURIComponent(req.model)}:streamGenerateContent?alt=sse`,{method:'POST',headers:this.authHeaders(),body:JSON.stringify(body)}); if(!r.ok) throw new Error(`Gemini HTTP ${r.status}`); if(!r.body) throw new Error('Gemini stream has no body');
    for await(const frame of parseSse(r.body)){ if(frame.data==='[DONE]') continue; const j=JSON.parse(frame.data); const text=(j.candidates?.[0]?.content?.parts??[]).map((p:any)=>p.text??'').join(''); const u=j.usageMetadata; if(text) yield {type:'text_delta',text,requestId:j.responseId}; if(u) yield {type:'completed',usage:{inputTokens:u.promptTokenCount??0,outputTokens:u.candidatesTokenCount??0,totalTokens:u.totalTokenCount??0},requestId:j.responseId}; }
  }
  async listModels():Promise<ModelInfo[]>{
    if(!this.key) throw new Error('GEMINI_API_KEY not configured');
    const out:ModelInfo[]=[]; let pageToken='';
    do { const qs=new URLSearchParams({pageSize:'100'}); if(pageToken) qs.set('pageToken',pageToken); const {data}=await fetchJson(`${this.base}/models?${qs}`,{method:'GET',headers:this.authHeaders()}); for(const m of data.models??[]) if((m.supportedGenerationMethods??[]).includes('generateContent')) out.push({id:String(m.name).replace(/^models\//,''),displayName:m.displayName,contextWindowTokens:m.inputTokenLimit,capabilities:{supportedGenerationMethods:m.supportedGenerationMethods??[]}}); pageToken=data.nextPageToken??''; } while(pageToken);
    return out;
  }
}
