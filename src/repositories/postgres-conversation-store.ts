import type { Conversation, Message } from '../domain.js';
import type { ConversationStore } from '../orchestrator.js';
import type { SqlDatabase } from './db.js';

type ConversationRow = { id:string; project_id:string; title:string; status:Conversation['status']; max_turns:number; max_words:number|null; current_turn:number; };
type ParticipantRow = { model_id:string; provider_code:string; role_name:string; speaker_order:number; };
type MessageRow = { id:string; conversation_id:string; author_type:Message['authorType']; author_id:string|null; model_id:string|null; role:Message['role']; content:string; turn_number:number; created_at:string; };

export class PostgresConversationStore implements ConversationStore {
  constructor(private readonly db: SqlDatabase) {}
  async getConversation(id:string): Promise<Conversation|undefined> {
    const r=await this.db.query<ConversationRow>('SELECT id,project_id,title,status,max_turns,max_words,current_turn FROM conversations WHERE id=$1',[id]);
    const row=r.rows[0]; if(!row) return undefined;
    const p=await this.db.query<ParticipantRow>('SELECT cp.model_id,p.code AS provider_code,cp.role_name,cp.speaker_order FROM conversation_participants cp JOIN models m ON m.id=cp.model_id JOIN providers p ON p.id=m.provider_id WHERE cp.conversation_id=$1 ORDER BY cp.speaker_order',[id]);
    return { id:row.id, projectId:row.project_id, title:row.title, status:row.status, maxTurns:row.max_turns, maxWords:row.max_words??undefined, currentTurn:row.current_turn, participants:p.rows.map(x=>({modelId:x.model_id,provider:x.provider_code,role:x.role_name,order:x.speaker_order})) };
  }
  async saveConversation(c:Conversation):Promise<void>{
    await this.db.query('INSERT INTO conversations (id,project_id,title,status,max_turns,max_words,current_turn) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title,status=EXCLUDED.status,max_turns=EXCLUDED.max_turns,max_words=EXCLUDED.max_words,current_turn=EXCLUDED.current_turn,updated_at=now()', [c.id,c.projectId,c.title,c.status,c.maxTurns,c.maxWords??null,c.currentTurn]);
    await this.db.query('DELETE FROM conversation_participants WHERE conversation_id=$1',[c.id]);
    for(const p of c.participants) await this.db.query('INSERT INTO conversation_participants (id,conversation_id,model_id,role_name,speaker_order,enabled) VALUES (gen_random_uuid(),$1,(SELECT m.id FROM models m JOIN providers pr ON pr.id=m.provider_id WHERE m.model_key=$2 AND ($3::text IS NULL OR pr.code=$3) LIMIT 1),$4,$5,true)',[c.id,p.modelId,p.provider??null,p.role,p.order]);
  }
  async appendMessage(m:Message):Promise<void>{ await this.db.query('INSERT INTO messages (id,conversation_id,author_type,author_user_id,role,content,turn_number,provider_request_id,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,NULL,$8)',[m.id,m.conversationId,m.authorType,m.authorId??null,m.role,m.content,m.turnNumber,m.createdAt]); }
  async getMessages(id:string):Promise<Message[]>{ const r=await this.db.query<MessageRow>('SELECT id,conversation_id,author_type,author_user_id::text as author_id,NULL::text as model_id,role,content,turn_number,created_at::text FROM messages WHERE conversation_id=$1 ORDER BY created_at',[id]); return r.rows.map(x=>({id:x.id,conversationId:x.conversation_id,authorType:x.author_type,authorId:x.author_id??undefined,modelId:x.model_id??undefined,role:x.role,content:x.content,turnNumber:x.turn_number,createdAt:x.created_at})); }
}
