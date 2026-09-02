# PostgreSQL migrations

Run migrations in lexical order:

1. `001_init.sql`
2. `002_seed_core.sql`

The migration set targets PostgreSQL 15+ and uses `pgcrypto` for UUID generation.

A production migration runner should record applied filenames/checksums and execute each migration transactionally where PostgreSQL allows it.
