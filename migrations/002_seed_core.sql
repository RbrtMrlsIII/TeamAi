INSERT INTO providers (code, display_name)
VALUES
  ('openai', 'OpenAI'),
  ('anthropic', 'Anthropic'),
  ('xai', 'xAI')
ON CONFLICT (code) DO NOTHING;

-- Model records and pricing are intentionally provisioned by the catalog job.
-- Provider model inventories and prices are volatile and must be effective-dated.
