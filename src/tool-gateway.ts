import { canInvokeTool, type ToolGrant } from './security/tool-policy.js';

export interface ToolRequest { projectId: string; tool: string; grants: ToolGrant[]; }

export function authorizeToolRequest(request: ToolRequest): void {
  const decision = canInvokeTool({ grants: request.grants, requestedTool: request.tool });
  if (!decision.allowed) throw new Error(decision.reason);
}
