export interface ChatMessage { role:'system'|'user'|'assistant'; content:string; }
export interface Usage { inputTokens:number; outputTokens:number; totalTokens:number; cachedInputTokens?:number; reasoningTokens?:number; }
export interface ModelInfo { id:string; displayName?:string; contextWindowTokens?:number; capabilities?:Record<string,unknown>; inputTokenPriceUsdPerMillion?:number; outputTokenPriceUsdPerMillion?:number; }
export interface GenerateRequest { model:string; messages:ChatMessage[]; maxOutputTokens?:number; temperature?:number; stream?:boolean; }
export interface GenerateResult { provider:string; model:string; requestId:string; text:string; usage:Usage; costUsd?:number; }
export interface StreamChunk { type:'text_delta'|'completed'; text?:string; usage?:Usage; requestId?:string; }
export interface AIProvider { readonly provider:string; generate(request:GenerateRequest):Promise<GenerateResult>; stream?(request:GenerateRequest):AsyncIterable<StreamChunk>; listModels?():Promise<ModelInfo[]>; }
