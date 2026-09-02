# TeamAi Firestore Domain Model — Backend Foundation

Firestore `default` is the TeamAi durable application/domain system of record. Firebase Auth owns identity; Firebase UID is the ownership root.

Canonical hierarchy:
`accounts/{uid}/workplaces/{workplaceId}/projects/{projectId}/teams/{teamId}/seats/{seatId}`
`accounts/{uid}/workplaces/{workplaceId}/projects/{projectId}/tasks/{taskId}`
`accounts/{uid}/workplaces/{workplaceId}/projects/{projectId}/events/{eventId}`

Client rules remain deny-by-default until tenancy, role, and data classification are explicitly validated. Trusted server operations do not require opening client rules. Commerce and entitlement mutation remains server-owned.

State classes: Account, Workplace, Project, Team/Solo, Web AI Seat, Task, Event. Seat state includes provider/model/runtime, effective skills, tools, permissions, settings, commands and shortcuts. Task state includes dependencies, lifecycle, leases, retries, timeouts, approvals, cancellation and recovery evidence. Events use stable event and idempotency identifiers.

This is a contract, not proof of live deployment. Live Firebase integration, rules/index deployment and verification remain open TEAM-BACKEND-001 gates.
