#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${FIREBASE_EMULATOR_PROJECT_ID:-team-ai-official}"
AUTH_PORT="${FIREBASE_AUTH_EMULATOR_PORT:-9099}"
FIRESTORE_PORT="${FIRESTORE_EMULATOR_PORT:-8080}"
EMULATOR_LOG="${TMPDIR:-/tmp}/teamai-firebase-rules-gate-004.log"

cleanup() {
  if [[ -n "${EMULATOR_PID:-}" ]]; then
    kill "${EMULATOR_PID}" >/dev/null 2>&1 || true
    wait "${EMULATOR_PID}" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

firebase_cmd=(npx --yes firebase-tools@15.28.2 emulators:start --only auth,firestore --project "$PROJECT_ID")
"${firebase_cmd[@]}" >"$EMULATOR_LOG" 2>&1 &
EMULATOR_PID=$!

for _ in {1..60}; do
  if curl -fsS "http://127.0.0.1:${AUTH_PORT}/" >/dev/null 2>&1 && \
     curl -fsS "http://127.0.0.1:${FIRESTORE_PORT}/" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

curl -fsS "http://127.0.0.1:${AUTH_PORT}/" >/dev/null
curl -fsS "http://127.0.0.1:${FIRESTORE_PORT}/" >/dev/null

create_user() {
  local email="$1"
  curl -fsS -X POST \
    -H 'Content-Type: application/json' \
    "http://127.0.0.1:${AUTH_PORT}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key" \
    -d "{\"email\":\"${email}\",\"password\":\"Gate4Password!123\",\"returnSecureToken\":true}"
}

json_a="$(create_user "gate4-a@example.test")"
json_b="$(create_user "gate4-b@example.test")"
TOKEN_A="$(node -e 'const x=JSON.parse(process.argv[1]); process.stdout.write(x.idToken)' "$json_a")"
TOKEN_B="$(node -e 'const x=JSON.parse(process.argv[1]); process.stdout.write(x.idToken)' "$json_b")"
UID_A="$(node -e 'const x=JSON.parse(process.argv[1]); process.stdout.write(x.localId)' "$json_a")"
UID_B="$(node -e 'const x=JSON.parse(process.argv[1]); process.stdout.write(x.localId)' "$json_b")"

firestore_base="http://127.0.0.1:${FIRESTORE_PORT}/v1/projects/${PROJECT_ID}/databases/(default)/documents"
account_a="${firestore_base}/accounts/${UID_A}"
account_b="${firestore_base}/accounts/${UID_B}"
task_a="${firestore_base}/accounts/${UID_A}/workplaces/gate4-workplace/projects/gate4-project/tasks/gate4-task"
event_a="${firestore_base}/accounts/${UID_A}/workplaces/gate4-workplace/projects/gate4-project/events/gate4-event"

payload='{"fields":{"gate":{"stringValue":"phase-004"}}}'

# Same-UID ownership: allowed write.
curl -fsS -X PATCH \
  -H "Authorization: Bearer ${TOKEN_A}" \
  -H 'Content-Type: application/json' \
  "$account_a" \
  -d "$payload" >/dev/null

# Same-UID ownership: allowed read.
curl -fsS \
  -H "Authorization: Bearer ${TOKEN_A}" \
  "$account_a" >/dev/null

# Cross-UID read/write must be denied. 403 is the expected rules result.
status="$(curl -sS -o /dev/null -w '%{http_code}' \
  -H "Authorization: Bearer ${TOKEN_B}" \
  "$account_a")"
[[ "$status" == "403" ]] || { echo "cross-UID read expected 403, got $status"; exit 1; }

status="$(curl -sS -o /dev/null -w '%{http_code}' -X PATCH \
  -H "Authorization: Bearer ${TOKEN_B}" \
  -H 'Content-Type: application/json' \
  "$account_a" \
  -d "$payload")"
[[ "$status" == "403" ]] || { echo "cross-UID write expected 403, got $status"; exit 1; }

# UID B must still be able to own its own account path.
curl -fsS -X PATCH \
  -H "Authorization: Bearer ${TOKEN_B}" \
  -H 'Content-Type: application/json' \
  "$account_b" \
  -d "$payload" >/dev/null

# Authoritative task/event state is server-owned: client writes must be denied.
status="$(curl -sS -o /dev/null -w '%{http_code}' -X PATCH \
  -H "Authorization: Bearer ${TOKEN_A}" \
  -H 'Content-Type: application/json' \
  "$task_a" \
  -d "$payload")"
[[ "$status" == "403" ]] || { echo "task client write expected 403, got $status"; exit 1; }

status="$(curl -sS -o /dev/null -w '%{http_code}' -X PATCH \
  -H "Authorization: Bearer ${TOKEN_A}" \
  -H 'Content-Type: application/json' \
  "$event_a" \
  -d "$payload")"
[[ "$status" == "403" ]] || { echo "event client write expected 403, got $status"; exit 1; }

echo "PHASE-004 Firebase Emulator / Security Rules assertions passed."
