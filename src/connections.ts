export type Environment = 'development' | 'staging' | 'production';
export type Capability = 'read' | 'write' | 'execute' | 'deploy' | 'admin';

export interface ProjectConnection {
  id: string;
  projectId: string;
  providerCode: string;
  externalProjectRef?: string;
  environment: Environment;
  capabilities: Capability[];
  status: 'active' | 'revoked' | 'error';
}
