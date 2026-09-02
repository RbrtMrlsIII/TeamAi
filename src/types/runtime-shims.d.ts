declare const process: { env: Record<string, string | undefined> };
declare module 'node:http' { const http:any; export = http; }
declare module 'node:crypto' { export function randomUUID(): string; }
declare module 'node:fs/promises' { export function readdir(path:string): Promise<string[]>; export function readFile(path:string,encoding:string): Promise<string>; }
declare module 'node:path' { export function join(...parts:string[]):string; }
declare module 'pg' { export class Pool { constructor(options?:any); query(sql:string, params?:unknown[]):Promise<{rows:any[]}>; connect():Promise<any>; end():Promise<void>; } }
declare module 'fastify' { const Fastify:any; export default Fastify; }
