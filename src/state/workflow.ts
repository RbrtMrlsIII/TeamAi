export type WorkflowState = 'discussion' | 'summarizing' | 'awaiting_approval' | 'executing' | 'reviewing' | 'completed' | 'cancelled' | 'failed';
export type WorkflowEvent = 'REQUEST_SUMMARY' | 'SUMMARY_READY' | 'APPROVE' | 'REJECT' | 'START_EXECUTION' | 'EXECUTION_COMPLETE' | 'REVIEW_COMPLETE' | 'CANCEL' | 'FAIL';

const transitions: Record<WorkflowState, Partial<Record<WorkflowEvent, WorkflowState>>> = {
  discussion: { REQUEST_SUMMARY: 'summarizing', CANCEL: 'cancelled', FAIL: 'failed' },
  summarizing: { SUMMARY_READY: 'awaiting_approval', CANCEL: 'cancelled', FAIL: 'failed' },
  awaiting_approval: { APPROVE: 'executing', REJECT: 'discussion', CANCEL: 'cancelled' },
  executing: { EXECUTION_COMPLETE: 'reviewing', CANCEL: 'cancelled', FAIL: 'failed' },
  reviewing: { REVIEW_COMPLETE: 'completed', FAIL: 'failed' },
  completed: {}, cancelled: {}, failed: {}
};
export function transition(state: WorkflowState, event: WorkflowEvent): WorkflowState {
  const next = transitions[state][event];
  if (!next) throw new Error(`invalid workflow transition ${state} -> ${event}`);
  return next;
}
