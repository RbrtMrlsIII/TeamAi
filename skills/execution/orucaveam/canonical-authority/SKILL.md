# ORUCAVEAM — Canonical Authority Skill

## WHEN TO USE
Use when determining which existing document, service, datastore, or external authority owns the meaning or state involved in the task.

## INPUT
Product Law concept, Masterplan item, authority map, affected system/resource, and current configuration.

## AUTHORITY
The current Product Law authority map and protected canonical contracts define ownership.

## ACTION
Resolve the owning canonical root before changing or reading state. Preserve distinctions such as Firebase Auth identity, Firestore durable domain state, Supabase trusted execution, PayPal payment events, GitHub source/change, and Firebase Hosting delivery.

## DO NOT
Do not create a parallel authority because another service is easier, faster, or already connected.

## PASS
The task names the canonical owner and the planned operation uses that authority.

## EVIDENCE
Record the canonical authority selected and the affected path/system.

## SEE ALSO
- `PRODUCT_LAW.md`
- `POLICY.md`
- `MASTERPLAN.md`
- `skills/execution/orucaveam/SKILL.md`
