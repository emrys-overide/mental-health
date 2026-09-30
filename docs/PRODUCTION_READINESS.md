# Production readiness plan (2026-09-30)

## Estimate
**40% ready** (rough engineering judgment). The PWA, Firebase authentication, owner-scoped rules, and voice UI exist. Sensitive data and live voice require further controls and clinical review.

## Evidence
- `firestore.rules` protects user paths by UID but permits broad subcollection reads and does not fully enforce the strict schema described in `security_spec.md`.
- `server.ts` accepts unauthenticated WebSocket connections at `/api/live`, initiating a paid Gemini session per connection.
- No automated tests or CI workflow appears in the default-branch tree.
- Voice system prompt includes unqualified neuroscience claims; the application handles potentially sensitive recovery data.

## Execute on this branch
1. Require verified Firebase identity before opening Gemini Live; enforce session/time/message limits and origin policy.
2. Reconcile Firestore rules with actual client writes, then add emulator tests for owner isolation and malformed payloads.
3. Add crisis escalation and clear non-clinical boundaries to voice behavior; obtain domain review before release.
4. Establish retention/deletion/export flows, privacy policy, consent, and incident response.
5. Add CI for typecheck, build, and rule tests; exercise offline/PWA updates and accessibility.

## Production gate
Clinical and privacy review, authenticated bounded voice sessions, passing rules tests, deletion/export verification, and tested monitoring are required before public release.
