Status: ready-for-agent

## What to build

Wire the existing `Shift` and `Plans` flows into the local Hardcore Mode event model. `Shift` should record session outcomes, `Plans` should expose actual saved plans and allow explicit follow-through actions, and active urge sessions should soft-lock non-Shift tab navigation until the user confirms exit.

## Acceptance criteria

- [ ] `Shift` records start and completion-oriented events into the local store
- [ ] Leaving an active urge session through another tab requires explicit confirmation
- [ ] `Plans` shows saved plans grouped by cadence and supports explicit follow-through actions
- [ ] Plan follow-through updates Progress Board and MVP Metrics

## Blocked by

- [01-shared-tab-bar-and-page-shells.md](/home/kheaw/projects/luma/.scratch/hardcore-mode-navigation/issues/01-shared-tab-bar-and-page-shells.md)
- [02-local-hardcore-mode-store.md](/home/kheaw/projects/luma/.scratch/hardcore-mode-navigation/issues/02-local-hardcore-mode-store.md)
