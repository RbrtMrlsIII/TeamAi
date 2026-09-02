import type {AIProvider} from './providers/types.js';
import {ModelCatalogRepository} from './db/crud-repositories.js';

export class CatalogService {
  constructor(private readonly repo:ModelCatalogRepository, private readonly providers:Map<string,AIProvider>){}
  async listModels(input:{userPlan?:string;provider?:string;capability?:string}) { return this.repo.list({planCode:input.userPlan,providerCode:input.provider,capability:input.capability}); }
  async refreshProvider(providerCode:string) {
    const provider=this.providers.get(providerCode); if(!provider?.listModels) throw new Error(`catalog sync unsupported for provider ${providerCode}`);
    return provider.listModels();
  }
}
