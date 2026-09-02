export interface McpTool { name:string; description:string; inputSchema: Record<string, unknown>; }
export interface McpServer { id:string; listTools(): Promise<McpTool[]>; callTool(name:string,args:Record<string,unknown>):Promise<unknown>; }
export interface ApprovalGate { request(input:{projectId:string; action:string; payload:unknown}):Promise<{approved:boolean; approvalId:string}>; }
