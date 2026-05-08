# Luma Domain Context

## Glossary

### UrgeShift

A one-tap urge interruption product. It helps a user get through the next few minutes of an urge with one safer next move, without clinical claims, full confession, or account setup.

### Urge moment

A short high-friction period where the user's intention is collapsing and ordinary reflective tools are too slow or demanding.

### Shift Now

The primary action in UrgeShift. It starts a private urge-interruption session immediately, before onboarding, typing, or full check-in.

### No-context first move

The first safe, low-effort intervention shown immediately after `Shift Now`, before the system knows the user's urge category or personal history.

### First Pause

The opening 90-second urge-interruption window after `Shift Now`. It is a product rhythm, not necessarily a visible countdown. The UI may show calm progress instead of numeric time to avoid pressure.

### Context Crumb

A one-tap signal collected after the first move has started. Context crumbs replace forms and long check-ins during an urge moment.

### Current Context

Optional user-editable session context such as name, place, and what is happening now. Current context supports tailoring, but UrgeShift must still work without it.

### Background Quiz

An optional lightweight quiz that gathers stable user context before an urge moment. Its output must be structured so a backend LLM can use it later as preference and support context, while UrgeShift still works if the user skips it.

### Personal Helper Spirit

Thai term: `ธูติประจำตัว`. A shareable, Thai-casual persona result from the Background Quiz. It represents how the app should help the user during an urge moment. It is not a diagnosis or fixed personality label.

### Printable Schedule

A user-owned, printable plan output for saved 10-minute plans. Use this when privacy matters more than long-term storage. UrgeShift should prefer session-only storage and printable/exportable artifacts over persistent user-data storage.

### Better Self Preview

Thai term: `ตัวเราที่ค่อยๆ กลับมาคุมได้`. A visual preview that shows possible near-term shifts after one safer next move. It is not a prediction, diagnosis, or outcome guarantee.

### Spirit Stage Image

An image asset for a `ธูติประจำตัว` at a Better Self Preview time stage. File naming convention is `/spirits/{spirit}_{stage}.png`, for example `/spirits/spark_now.png`, `/spirits/spark_10mins.png`, `/spirits/spark_today.png`, and `/spirits/spark_7days.png`.

### Escape Hatch

A user-controlled response to an action card, such as `Done`, `Too hard`, `Different`, `I need a person`, or `Stop`.

### Too Hard

An escape hatch that tells UrgeShift to downshift the current action into a smaller, lower-effort version without scolding the user.

### Harm-Reduction Mode

A low-readiness flow used when the user says or signals that they will do the behavior anyway. UrgeShift shifts from prevention to safer next moves, without framing the behavior as success.

### Personal 10-Minute Plan

An optional saved if-then plan created only after something helped. It stores the useful action pattern, not raw sensitive transcripts by default.

### Plan Cadence

The repetition rhythm for a saved plan. UrgeShift uses `Daily`, `Every other day`, and `Weekly`. Avoid `bi-daily` because it can mean either twice daily or every two days.

### Buddy Bridge

A user-controlled message draft for asking another person to stay present during an urge moment. UrgeShift drafts only; it never auto-sends.

## Language Rules

- UrgeShift UI is Thai-primary bilingual: Thai text comes first; English appears only as helper text where useful.
- Say `urge interruption`, not `addiction treatment`.
- Say `one safer next move`, not `therapy`.
- Say `harm-reduction mode`, not `permission`.
- Say `context crumbs`, not `intake form`.
- Say `save what helped`, not `save confession`.
- Avoid shame or clinical labels such as `addict`, `failed`, `relapse predictor`, and `AI therapist`.
