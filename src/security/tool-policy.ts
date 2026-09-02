export interface ToolGrant { tool: string; effect: 'allow' | 'deny'; }
export interface ToolDecision { allowed: boolean; reason: 'ALLOWED' | 'TOOL_NOT_GRANTED' | 'EXPLICITLY_DENIED'; }

export function canInvokeTool(input: { grants: ToolGrant[]; requestedTool: string }): ToolDecision {
  const grant = input.grants.find(g => g.tool === input.requestedTool);
  if (grant?.effect === 'allow') return { allowed: true, reason: 'ALLOWED' };
  if (grant?.effect === 'deny') return { allowed: false, reason: 'EXPLICITLY_DENIED' };
  return { allowed: false, reason: 'TOOL_NOT_GRANTED' };
}
