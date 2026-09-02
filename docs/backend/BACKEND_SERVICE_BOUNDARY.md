# TeamAi Backend Service Boundary

| Service | Canonical role | Must not become |
|---|---|---|
| Firebase Auth | Identity | Payment or worker authority |
| Firebase Firestore (`default`) | TeamAi domain/application state | Static hosting or secret store |
| Firebase Hosting | Web delivery | Server runtime or webhook receiver |
| Supabase Edge Functions | Trusted server runtime | TeamAi domain database |
| Supabase Storage | Optional entitled user content | Project-ZIP store |
| GitHub | Engineering repository/workstation | Runtime, payment authority, webhook receiver |
| PayPal | External payment rail/event source | TeamAi state store |
| Supabase Postgres | Supabase platform infrastructure | TeamAi domain source of truth |
| Historical PostgreSQL/WoWSQL | Evidence only | Active runtime |

## Re-entry rule
A retired backend technology cannot return to active runtime merely because legacy code exists. Re-entry requires an explicit architecture decision, canonical documentation update, implementation evidence, and validation.
