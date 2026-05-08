Status: ready-for-agent

## What to build

Create a device-local Hardcore Mode state layer that stores Local Name and an append-only event log used for Progress Board and MVP Metrics. This store should be the single place that records and derives hardcore-mode signals.

## Acceptance criteria

- [ ] A reusable local store exists for Local Name, event recording, and derived progress metrics
- [ ] Core flows can record events such as urge session start/completion, plan save, plan follow-through, and check-in completion
- [ ] Derived Progress Board and MVP Metrics values can be computed from the same local event model

## Blocked by

None - can start immediately
