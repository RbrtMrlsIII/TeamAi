import {createApiServer} from './api/server.js';
import {ConversationOrchestrator,InMemoryConversationStore} from './orchestrator.js';
import type {AIProvider} from './providers/types.js';
import {GeminiProvider} from './providers/gemini.js';
import {MistralProvider} from './providers/mistral.js';
import {ModelCatalogRepository} from './db/crud-repositories.js';
import {CatalogService} from './catalog-service.js';
import {pool} from './db/pool.js';

const providers=new Map<string,AIProvider>();
const gemini=new GeminiProvider(); const mistral=new MistralProvider();
if(process.env.GEMINI_API_KEY) providers.set('gemini',gemini);
if(process.env.MISTRAL_API_KEY) providers.set('mistral',mistral);
const orchestrationProviders=new Map<string,AIProvider>(providers);
const orchestrator=new ConversationOrchestrator(new InMemoryConversationStore(),orchestrationProviders);
const catalog=process.env.DATABASE_URL?new CatalogService(new ModelCatalogRepository(pool),providers):undefined;
const server=createApiServer({orchestrator,resolvePlan:async()=> 'free',catalog});
const port=Number(process.env.PORT??3000);server.listen(port,()=>console.log(`API listening on :${port}`));
