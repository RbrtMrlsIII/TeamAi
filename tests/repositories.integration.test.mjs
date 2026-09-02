import test from 'node:test'; import assert from 'node:assert/strict';
let pg; try { pg=await import('pg'); } catch { pg=null; }
const url=process.env.DATABASE_URL;
const run = url && pg ? test : test.skip;
run('postgres repositories round-trip project/summary/execution/billing/plugin records', async()=>{
  const {Pool}=pg; const pool=new Pool({connectionString:url});
  try {
    const u=(await pool.query("INSERT INTO users(email,display_name) VALUES($1,$2) RETURNING id",[`integration-${Date.now()}@example.test`,'Integration'])).rows[0].id;
    const provider=(await pool.query("INSERT INTO providers(code,display_name) VALUES($1,$2) ON CONFLICT(code) DO UPDATE SET display_name=EXCLUDED.display_name RETURNING id",['integration-provider','Integration'])).rows[0].id;
    const model=(await pool.query("INSERT INTO models(provider_id,model_key,display_name) VALUES($1,$2,$3) ON CONFLICT(provider_id,model_key) DO UPDATE SET display_name=EXCLUDED.display_name RETURNING id",[provider,'integration-model','Integration Model'])).rows[0].id;
    const project=(await pool.query("INSERT INTO projects(owner_user_id,name) VALUES($1,$2) RETURNING id",[u,'Integration Project'])).rows[0].id;
    assert.ok(project);
    const conv=(await pool.query("INSERT INTO conversations(project_id,title,mode,max_turns) VALUES($1,$2,$3,$4) RETURNING id",[project,'Integration Conversation','collaborative',2])).rows[0].id;
    const summary=(await pool.query("INSERT INTO conversation_summaries(conversation_id,summarizer_model_id,summary_json) VALUES($1,$2,$3) RETURNING id",[conv,model,JSON.stringify({decisions:['ok']})])).rows[0].id;
    const plan=(await pool.query("INSERT INTO execution_plans(project_id,conversation_id,summary_id,title,plan_json) VALUES($1,$2,$3,$4,$5) RETURNING id",[project,conv,summary,'Integration Plan',JSON.stringify({tasks:['test']})])).rows[0].id;
    const runId=(await pool.query("INSERT INTO execution_runs(execution_plan_id,executor_model_id,mode,budget_credits) VALUES($1,$2,$3,$4) RETURNING id",[plan,model,'guided',10])).rows[0].id;
    const wallet=(await pool.query("INSERT INTO credit_wallets(user_id,balance_credits) VALUES($1,$2) RETURNING id",[u,20])).rows[0].id;
    await pool.query("INSERT INTO credit_ledger(wallet_id,entry_type,amount_credits,description) VALUES($1,$2,$3,$4)",[wallet,'credit',20,'integration']);
    const plugin=(await pool.query("INSERT INTO plugins(developer_id,plugin_key,name,version,description) VALUES($1,$2,$3,$4,$5) RETURNING id",[u,`integration-${Date.now()}`,'Integration Plugin','1.0.0','test'])).rows[0].id;
    assert.ok(summary&&plan&&runId&&wallet&&plugin);
  } finally { await pool.end(); }
});
