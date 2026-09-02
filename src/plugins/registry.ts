export type PluginStatus='draft'|'published'|'disabled';
export interface PluginManifest { id:string; developerId:string; name:string; version:string; description:string; mcpServerUrl?:string; requiredConfig: string[]; capabilities:string[]; status:PluginStatus; }
export class PluginRegistry {
  private readonly items=new Map<string,PluginManifest>();
  publish(plugin:PluginManifest){ if(plugin.status!=='published') throw new Error('plugin must be published'); this.items.set(plugin.id,structuredClone(plugin)); }
  list(){return [...this.items.values()].filter(x=>x.status==='published').map(x=>structuredClone(x));}
  get(id:string){const x=this.items.get(id); return x?structuredClone(x):undefined;}
  validateUserConfig(plugin:PluginManifest, config:Record<string,unknown>){const missing=plugin.requiredConfig.filter(k=>config[k]===undefined); if(missing.length) throw new Error(`missing plugin configuration: ${missing.join(', ')}`);}
}
