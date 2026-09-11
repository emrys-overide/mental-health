# Security Specification for Bible Recovery & Mind Renewal

## 1. Data Invariants
1. **User Identity Isolation**: All documents under `/users/{userId}/*` must be strictly isolated to the authenticated user whose `request.auth.uid == userId`.
2. **PII Protection**: Profile data (including email and display name) is strictly readable and writable only by the authenticated owner (`request.auth.uid == userId`).
3. **No Blanket Reads / Listings**: Listing of subcollections (`urge_logs`, `journal_entries`) requires authentication and must be constrained to the owning user.
4. **Strict Schema Validation**: Inbound documents must conform to bounded size limits (e.g. notes <= 2000 chars, triggerNote <= 500 chars, physicalNeed <= 128 chars).
5. **Immutable Ownership & Identifiers**: Document IDs, user IDs, and creation timestamps cannot be mutated or forged across updates.
6. **Path Hardening**: Path variables such as `userId`, `urgeLogId`, and `entryId` must conform to standard safe identifier patterns (`isValidId()`).

## 2. The "Dirty Dozen" Threat Payloads
1. **Unauthenticated Read of User Profile**: Attempting `get(/users/user_abc)` with `request.auth == null`. (Expected: DENIED)
2. **Impersonated Profile Write**: User `uid_123` attempting to write to `/users/uid_999`. (Expected: DENIED)
3. **Ghost Field Poisoning**: Inserting unexpected admin/role fields like `isAdmin: true` into user profile. (Expected: DENIED)
4. **Denial of Wallet Payload**: Inbound `note` containing 500KB of junk data exceeding size limits. (Expected: DENIED)
5. **Path Traversal / Malformed Document ID**: Inserting illegal characters in path ID (e.g. `../../admin`). (Expected: DENIED)
6. **Cross-Tenant Urge Log Read**: User A querying `/users/userB/urge_logs`. (Expected: DENIED)
7. **Cross-Tenant Urge Log Create**: User A writing an urge log into `/users/userB/urge_logs/log1`. (Expected: DENIED)
8. **Forged Timestamp / Replay**: Setting `createdAt` to arbitrary future dates. (Expected: DENIED)
9. **Tampering with Recovery Streaks**: Setting arbitrary negative numbers or non-numeric types for `currentStreak`. (Expected: DENIED)
10. **Blanket Collection Scrape**: Running an unconstrained list query across all users' collections. (Expected: DENIED)
11. **Modifying Immortal Fields**: Attempting to alter `userId` on existing streak data. (Expected: DENIED)
12. **Unverified Email Writes (when required)**: Writes without verified authentication credentials. (Expected: DENIED)

## 3. Test Runner Coverage
The `firestore.rules` enforces these rules mathematically using catch-all default deny, `isValidId()`, `isSignedIn()`, and ownership guards.
