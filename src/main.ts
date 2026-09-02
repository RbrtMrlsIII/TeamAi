import { createApiServer } from './api/server.js';
import { ConversationOrchestrator, InMemoryConversationStore } from './orchestrator.js';
import type { AIProvider } from './providers/types.js';
import { GeminiProvider } from './providers/gemini.js';
import { MistralProvider } from './providers/mistral.js';
import { CatalogService } from './catalog-service.js';

const providers = new Map<string, AIProvider>();
const gemini = new GeminiProvider();
const mistral = new MistralProvider();
if (process.env.GEMINI_API_KEY) providers.set('gemini', gemini);
if (process.env.MISTRAL_API_KEY) providers.set('mistral', mistral);
const orchestrator = new ConversationOrchestrator(new InMemoryConversationStore(), new Map(providers));
const catalog = new CatalogService(providers);
const server = createApiServer({ orchestrator, resolvePlan: async () => 'free', catalog });
const port = Number(process.env.PORT ?? 3000);
server.listen(port, () => console.log(`API listening on :${port}`));
