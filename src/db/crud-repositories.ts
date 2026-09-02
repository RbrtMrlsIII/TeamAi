
export interface Queryable { query<T=any>(text:string, values?:unknown[]): Promise<{rows:T[]; rowCount?:number}>; }
interface ClientLike extends Queryable { query<T=any>(text:string, values?:unknown[]): Promise<{rows:T[]; rowCount?:number}>; release():void; }
interface Connectable extends Queryable { connect(): Promise<ClientLike>; }

export class ProjectRepository {
  constructor(private readonly db: Queryable) {}
  async create(input:{ownerUserId:string; name:string; description?:string; budgetCredits?:number; environment?:string}) {
    const r=await this.db.query('INSERT INTO projects(owner_user_id,name,description,default_budget_credits,environment) VALUES($1,$2,$3,$4,$5) RETURNING *',[input.ownerUserId,input.name,input.description??null,input.budgetCredits??0,input.environment??'development']); return r.rows[0];
  }
  async get(id:string) { const r=await this.db.query('SELECT * FROM projects WHERE id=$1',[id]); return r.rows[0] ?? null; }
  async listByOwner(ownerUserId:string) { const r=await this.db.query('SELECT * FROM projects WHERE owner_user_id=$1 ORDER BY created_at DESC',[ownerUserId]); return r.rows; }
  async update(id:string, patch:{name?:string; description?:string|null; budgetCredits?:number; environment?:string; status?:string}) {
    const r=await this.db.query(`UPDATE projects SET name=COALESCE($2,name), description=COALESCE($3,description), default_budget_credits=COALESCE($4,default_budget_credits), environment=COALESCE($5,environment), status=COALESCE($6,status), updated_at=now() WHERE id=$1 RETURNING *`,[id,patch.name??null,patch.description??null,patch.budgetCredits??null,patch.environment??null,patch.status??null]); return r.rows[0] ?? null;
  }
  async delete(id:string) { const r=await this.db.query('DELETE FROM projects WHERE id=$1 RETURNING id',[id]); return Boolean(r.rowCount); }
}

export class SummaryRepository {
  constructor(private readonly db: Queryable) {}
  async create(input:{conversationId:string;summarizerModelId:string;summaryJson:unknown;version?:number}) { const r=await this.db.query('INSERT INTO conversation_summaries(conversation_id,summarizer_model_id,summary_json,version) VALUES($1,$2,$3,$4) RETURNING *',[input.conversationId,input.summarizerModelId,JSON.stringify(input.summaryJson),input.version??1]); return r.rows[0]; }
  async get(id:string) { const r=await this.db.query('SELECT * FROM conversation_summaries WHERE id=$1',[id]); return r.rows[0] ?? null; }
  async list(conversationId:string) { const r=await this.db.query('SELECT * FROM conversation_summaries WHERE conversation_id=$1 ORDER BY version DESC, created_at DESC',[conversationId]); return r.rows; }
  async update(id:string, summaryJson:unknown) { const r=await this.db.query('UPDATE conversation_summaries SET summary_json=$2 WHERE id=$1 RETURNING *',[id,JSON.stringify(summaryJson)]); return r.rows[0] ?? null; }
  async delete(id:string) { const r=await this.db.query('DELETE FROM conversation_summaries WHERE id=$1 RETURNING id',[id]); return Boolean(r.rowCount); }
}

export class ExecutionRunRepository {
  constructor(private readonly db: Queryable) {}
  async create(input:{executionPlanId:string;executorModelId:string;mode:string;budgetCredits:number}) { const r=await this.db.query('INSERT INTO execution_runs(execution_plan_id,executor_model_id,mode,budget_credits) VALUES($1,$2,$3,$4) RETURNING *',[input.executionPlanId,input.executorModelId,input.mode,input.budgetCredits]); return r.rows[0]; }
  async get(id:string) { const r=await this.db.query('SELECT * FROM execution_runs WHERE id=$1',[id]); return r.rows[0] ?? null; }
  async listByPlan(executionPlanId:string) { const r=await this.db.query('SELECT * FROM execution_runs WHERE execution_plan_id=$1 ORDER BY started_at DESC NULLS LAST',[executionPlanId]); return r.rows; }
  async update(id:string, patch:{status?:string;reservedCredits?:number;spentCredits?:number;startedAt?:string|null;finishedAt?:string|null}) { const r=await this.db.query(`UPDATE execution_runs SET status=COALESCE($2,status), reserved_credits=COALESCE($3,reserved_credits), spent_credits=COALESCE($4,spent_credits), started_at=COALESCE($5,started_at), finished_at=COALESCE($6,finished_at) WHERE id=$1 RETURNING *`,[id,patch.status??null,patch.reservedCredits??null,patch.spentCredits??null,patch.startedAt??null,patch.finishedAt??null]); return r.rows[0] ?? null; }
  async delete(id:string) { const r=await this.db.query('DELETE FROM execution_runs WHERE id=$1 RETURNING id',[id]); return Boolean(r.rowCount); }
}

export class BillingRepository {
  constructor(private readonly db: Queryable) {}
  async wallet(userId:string) { const r=await this.db.query('SELECT * FROM credit_wallets WHERE user_id=$1',[userId]); return r.rows[0] ?? null; }
  async ensureWallet(userId:string, initialCredits=0) { const r=await this.db.query('INSERT INTO credit_wallets(user_id,balance_credits) VALUES($1,$2) ON CONFLICT(user_id) DO UPDATE SET updated_at=now() RETURNING *',[userId,initialCredits]); return r.rows[0]; }
  async updateWallet(walletId:string, patch:{balanceCredits?:number;reservedCredits?:number}) { const r=await this.db.query('UPDATE credit_wallets SET balance_credits=COALESCE($2,balance_credits), reserved_credits=COALESCE($3,reserved_credits), updated_at=now() WHERE id=$1 RETURNING *',[walletId,patch.balanceCredits??null,patch.reservedCredits??null]); return r.rows[0] ?? null; }
  async addLedgerEntry(input:{walletId:string;entryType:string;amountCredits:number;sourceType?:string;sourceId?:string;description?:string}) { const client='connect' in this.db ? await (this.db as Connectable).connect() : null; if(!client) return this.db.query('INSERT INTO credit_ledger(wallet_id,entry_type,amount_credits,source_type,source_id,description) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',[input.walletId,input.entryType,input.amountCredits,input.sourceType??null,input.sourceId??null,input.description??null]).then(r=>r.rows[0]); const c=client as ClientLike; try { await c.query('BEGIN'); const entry=await c.query('INSERT INTO credit_ledger(wallet_id,entry_type,amount_credits,source_type,source_id,description) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',[input.walletId,input.entryType,input.amountCredits,input.sourceType??null,input.sourceId??null,input.description??null]); await c.query('UPDATE credit_wallets SET balance_credits=balance_credits+$2,updated_at=now() WHERE id=$1',[input.walletId,input.amountCredits]); await c.query('COMMIT'); return entry.rows[0]; } catch(e){await c.query('ROLLBACK');throw e} finally {c.release()} }
  async ledger(walletId:string, limit=100) { const r=await this.db.query('SELECT * FROM credit_ledger WHERE wallet_id=$1 ORDER BY created_at DESC LIMIT $2',[walletId,limit]); return r.rows; }
  async usage(userId:string, periodStart:string, periodEnd:string) { const r=await this.db.query('SELECT COALESCE(SUM(customer_charge_credits),0) AS credits, COUNT(*)::int AS requests FROM usage_records WHERE user_id=$1 AND created_at >= $2 AND created_at < $3',[userId,periodStart,periodEnd]); return r.rows[0]; }
}

export class PluginCrudRepository {
  constructor(private readonly db: Queryable) {}
  async create(input:{developerId:string;pluginKey:string;name:string;version:string;description:string;mcpServerUrl?:string;requiredConfig?:unknown;capabilities?:unknown;status?:string}) { const r=await this.db.query('INSERT INTO plugins(developer_id,plugin_key,name,version,description,mcp_server_url,required_config,capabilities,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',[input.developerId,input.pluginKey,input.name,input.version,input.description,input.mcpServerUrl??null,JSON.stringify(input.requiredConfig??[]),JSON.stringify(input.capabilities??[]),input.status??'draft']); return r.rows[0]; }
  async get(id:string) { const r=await this.db.query('SELECT * FROM plugins WHERE id=$1',[id]); return r.rows[0] ?? null; }
  async listPublished() { const r=await this.db.query("SELECT * FROM plugins WHERE status='published' ORDER BY created_at DESC"); return r.rows; }
  async update(id:string, patch:{name?:string;version?:string;description?:string;mcpServerUrl?:string|null;requiredConfig?:unknown;capabilities?:unknown;status?:string}) { const r=await this.db.query(`UPDATE plugins SET name=COALESCE($2,name),version=COALESCE($3,version),description=COALESCE($4,description),mcp_server_url=COALESCE($5,mcp_server_url),required_config=COALESCE($6,required_config),capabilities=COALESCE($7,capabilities),status=COALESCE($8,status),updated_at=now() WHERE id=$1 RETURNING *`,[id,patch.name??null,patch.version??null,patch.description??null,patch.mcpServerUrl??null,patch.requiredConfig===undefined?null:JSON.stringify(patch.requiredConfig),patch.capabilities===undefined?null:JSON.stringify(patch.capabilities),patch.status??null]); return r.rows[0] ?? null; }
  async delete(id:string) { const r=await this.db.query('DELETE FROM plugins WHERE id=$1 RETURNING id',[id]); return Boolean(r.rowCount); }
}

export class ModelCatalogRepository {
  constructor(private readonly db: Queryable) {}
  async list(input:{planCode?:string;providerCode?:string;capability?:string}) {
    const values:any[]=[]; const where:string[]=["m.status='active'","p.status='active'"];
    if(input.providerCode){values.push(input.providerCode);where.push(`p.code=$${values.length}`)}
    if(input.capability){values.push(input.capability);where.push(`m.capability_json @> $${values.length}::jsonb`)}
    let entitlement='';
    if(input.planCode){values.push(input.planCode);entitlement=`JOIN plan_model_entitlements e ON e.model_id=m.id AND e.plan_code=$${values.length} AND e.allowed=true`}
    const r=await this.db.query(`SELECT m.id,m.model_key,m.display_name,m.context_window_tokens,m.capability_json,p.code AS provider,p.display_name AS provider_name FROM models m JOIN providers p ON p.id=m.provider_id ${entitlement} WHERE ${where.join(' AND ')} ORDER BY p.display_name,m.display_name`,values); return r.rows;
  }
}
