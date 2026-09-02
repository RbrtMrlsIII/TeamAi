import type {AIProvider,GenerateRequest,GenerateResult,ModelInfo,StreamChunk} from './types.js';
import {fetchJson,parseSse} from './http.js';

export class MistralProvider implements AIProvider {
  constructor(public readonly provider='mistral',private readonly key=process.env.MISTRAL_API_KEY??'',private readonly base='https://api.mistral.ai/v1'){}
  private headers(){return {'content-type':'application/json',authorization:`Bearer ${this.key}`}}
  async generate(req:GenerateRequest):Promise<GenerateResult>{
    if(!this.key) throw new Error('MISTRAL_API_KEY not configured');
    const {data,requestId}=await fetchJson(`${this.base}/chat/completions`,{method:'POST',headers:this.headers(),body:JSON.stringify({model:req.model,messages:req.messages,max_tokens:req.maxOutputTokens,temperature:req.temperature,stream:false})});
    const u=data.usage??{}; return {provider:this.provider,model:req.model,requestId:data.id??requestId??'',text:typeof data.choices?.[0]?.message?.content==='string'?data.choices[0].message.content:(data.choices?.[0]?.message?.content??[]).map((x:any)=>x.text??'').join(''),usage:{inputTokens:u.prompt_tokens??0,outputTokens:u.completion_tokens??0,totalTokens:u.total_tokens??(u.prompt_tokens??0)+(u.completion_tokens??0)}};
  }
  async *stream(req:GenerateRequest):AsyncIterable<StreamChunk>{
    if(!this.key) throw new Error('MISTRAL_API_KEY not configured');
    const r=await fetch(`${this.base}/chat/completions`,{method:'POST',headers:this.headers(),body:JSON.stringify({model:req.model,messages:req.messages,max_tokens:req.maxOutputTokens,temperature:req.temperature,stream:true})}); if(!r.ok) throw new Error(`Mistral HTTP ${r.status}`); if(!r.body) throw new Error('Mistral stream has no body');
    for await(const frame of parseSse(r.body)){ if(frame.data==='[DONE]'){yield {type:'completed'}; continue;} const j=JSON.parse(frame.data); const delta=j.choices?.[0]?.delta?.content; if(typeof delta==='string'&&delta) yield {type:'text_delta',text:delta,requestId:j.id}; if(j.usage) yield {type:'completed',usage:{inputTokens:j.usage.prompt_tokens??0,outputTokens:j.usage.completion_tokens??0,totalTokens:j.usage.total_tokens??0},requestId:j.id}; }
  }
  async listModels():Promise<ModelInfo[]>{
    if(!this.key) throw new Error('MISTRAL_API_KEY not configured');
    const {data}=await fetchJson(`${this.base}/models`,{method:'GET',headers:{authorization:`Bearer ${this.key}`}}); return (data.data??[]).filter((m:any)=>!m.archived && m.capabilities?.completion_chat).map((m:any)=>({id:m.id,displayName:m.id,contextWindowTokens:m.max_context_length,capabilities:m.capabilities}));
  }
}
