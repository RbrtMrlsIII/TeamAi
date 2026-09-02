export interface PluginManifest { id:string; name:string; version:string; developerId:string; description:string; category:string; mcpServer?:string; permissions:string[]; configSchema:Record<string,unknown>; }
export interface ProjectPluginConfig { projectId:string; pluginId:string; enabled:boolean; config:Record<string,unknown>; allowedModels:string[]; }
