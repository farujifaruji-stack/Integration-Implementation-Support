# Reject invalid webhook event IDs before deduplication

The receiver currently acknowledges two distinct signed events without IDs as successful, marking the second as a duplicate because both use `undefined` as their Set key. This change rejects invalid JSON, non-object envelopes, and missing or invalid IDs with HTTP 400 before deduplication state is accessed.

Valid signed events and duplicate retries retain their existing behavior. Numeric IDs are now rejected; callers must provide non-empty string IDs.

Validation: the same 15 route-level regression tests produce 3 passes / 12 failures on the original source and 15 passes / 0 failures after the fix. The harness executes the actual handler with stubbed Express registration; HTTP middleware and persistent processing are not covered. Synthetic data only. AI assistance and remaining limitations are documented in `investigation/README.md`.
