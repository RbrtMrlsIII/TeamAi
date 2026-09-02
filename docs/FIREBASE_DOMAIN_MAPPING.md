# Firebase Domain Mapping

## Status

`DESIGN / IMPLEMENTATION PREPARATION`

The Firebase backend must implement TeamAi domain behavior without making Firebase concepts authoritative over Product Law.

| Domain surface | Current canonical implementation evidence | Firebase target adapter |
|---|---|---|
| Project | `ProjectRepository` SQL boundary | Firestore project repository |
| Conversation | `PostgresConversationStore` / orchestrator contract | Firestore conversation store |
| Messages | SQL repository | Firestore message subcollection |
| Turn events | Planned/durable domain requirement | Firestore event documents |
| Execution task | `src/task-scheduler.ts` domain model | Firestore task document |
| Task dependency | `TaskDependencyRecord` | Dependency subcollection/documents |
| Task event | `TaskEventRecord` | Append-only event collection |
| Billing ledger | Credit-ledger domain contract | Separate transactional ledger design; do not equate it to provider payment records |
| Provider catalog | Catalog service | Firestore or controlled server-side catalog cache, pending capability/consistency decision |
| Audit | Audit domain | Append-only server-side audit records |

## Important implementation rule

`execution_task_dependencies` and `execution_task_events` are PostgreSQL implementation artifacts from the 029 tranche. They define behavior that should be retained in the domain contract, but they do not require Firebase to reproduce the SQL schema literally.

## Consistency rule

Where a TeamAi invariant depends on the current state of one or more documents, use a Firestore transaction. Where a set of writes can be atomically committed without a read dependency, use a batched write. Keep transaction callbacks side-effect free because Firestore may retry a transaction under concurrent edits.
