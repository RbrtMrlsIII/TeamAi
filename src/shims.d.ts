declare const process: { env: Record<string,string|undefined>; cwd(): string };
declare module 'node:fs/promises' { export function readdir(path:string):Promise<string[]>; export function readFile(path:string,encoding:string):Promise<string>; }
declare module 'node:path' { export function join(...parts:string[]):string; }
declare module 'pg' { export class Pool { constructor(options?:any); query(sql:string,params?:any[]):Promise<{rows:any[]}>; end():Promise<void>; } }
declare module 'fastify' { const f:any; export default f; }

declare const Buffer:any;
declare module 'node:http' { export function createServer(handler:any): any; }
declare module 'node:crypto' { export function randomUUID(): string; }
