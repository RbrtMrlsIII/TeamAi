export type BackendSkillContext = {
  projectType: string;
  field: string;
  taskType: string;
  provider?: string;
  runtime?: string;
  tools?: string[];
  projectSkills?: string[];
  baseSkills?: string[];
};

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort();
}

export function resolveEffectiveSkills(context: BackendSkillContext): string[] {
  const resolved = [
    ...(context.baseSkills ?? []),
    `project-type:${context.projectType}`,
    `field:${context.field}`,
    `task:${context.taskType}`,
    ...(context.provider ? [`provider:${context.provider}`] : []),
    ...(context.runtime ? [`runtime:${context.runtime}`] : []),
    ...(context.tools ?? []).map((tool) => `tool:${tool}`),
    ...(context.projectSkills ?? []),
  ];

  return uniqueSorted(resolved);
}
