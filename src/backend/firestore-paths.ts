function requireNonEmpty(value: string, name: string): string {
  if (!value.trim()) throw new Error(`${name} is required`);
  return value;
}

export function accountPath(uid: string): string {
  return `accounts/${requireNonEmpty(uid, 'uid')}`;
}

export function workplacePath(uid: string, workplaceId: string): string {
  return `${accountPath(uid)}/workplaces/${requireNonEmpty(workplaceId, 'workplaceId')}`;
}

export function projectPath(uid: string, workplaceId: string, projectId: string): string {
  return `${workplacePath(uid, workplaceId)}/projects/${requireNonEmpty(projectId, 'projectId')}`;
}

export function teamPath(uid: string, workplaceId: string, projectId: string, teamId: string): string {
  return `${projectPath(uid, workplaceId, projectId)}/teams/${requireNonEmpty(teamId, 'teamId')}`;
}

export function seatPath(uid: string, workplaceId: string, projectId: string, teamId: string, seatId: string): string {
  return `${teamPath(uid, workplaceId, projectId, teamId)}/seats/${requireNonEmpty(seatId, 'seatId')}`;
}

export function taskPath(uid: string, workplaceId: string, projectId: string, taskId: string): string {
  return `${projectPath(uid, workplaceId, projectId)}/tasks/${requireNonEmpty(taskId, 'taskId')}`;
}

export function eventPath(uid: string, workplaceId: string, projectId: string, eventId: string): string {
  return `${projectPath(uid, workplaceId, projectId)}/events/${requireNonEmpty(eventId, 'eventId')}`;
}
