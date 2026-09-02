INSERT INTO providers(code,display_name) VALUES
 ('gemini','Google Gemini'),('mistral','Mistral')
ON CONFLICT(code) DO UPDATE SET display_name=EXCLUDED.display_name;

INSERT INTO plan_limits(plan_code,max_ai_participants,max_turns_per_discussion,monthly_ai_credits,max_project_connections,plugins_enabled)
VALUES
 ('free',1,10,1000,1,false),
 ('starter',2,30,8000,3,true),
 ('pro',4,75,30000,10,true),
 ('team',8,150,100000,50,true)
ON CONFLICT(plan_code) DO UPDATE SET
 max_ai_participants=EXCLUDED.max_ai_participants,
 max_turns_per_discussion=EXCLUDED.max_turns_per_discussion,
 monthly_ai_credits=EXCLUDED.monthly_ai_credits,
 max_project_connections=EXCLUDED.max_project_connections,
 plugins_enabled=EXCLUDED.plugins_enabled;
