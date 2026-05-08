# UrgeShift   PRD

Status: ready-for-agent

## Problem Statement

UrgeShift's original MVP solves the right moment but still assumes too much from the user. It assumes a person in a craving moment has enough energy, trust, readiness, and patience to open an app, answer check-in questions, receive ranked advice, and reflect afterward.

The non-user personas show the real adoption risk: many people who need help most will not behave like ideal wellness-app users. Some are too tired to open anything. Some are ambivalent and only want the next moment to be less damaging. Some hate being told what to do. Some fear storing sensitive craving data. Some are in crisis and need human care, not an AI intervention.

The refined problem is:

> How might UrgeShift help a person preserve agency during the few minutes when intention breaks, while requiring almost no effort, storing almost nothing by default, and never pretending to provide clinical care?

## Solution

Build **UrgeShift  **, a private, short-session AI intervention layer for urge moments.

The first screen centers one action: **Shift Now**. Tapping it starts a private 10-minute session immediately, without requiring an account, full onboarding, or a reflective check-in. The system can ask lightweight questions after the first intervention begins, but the user should receive help within seconds.

During the session, UrgeShift offers one low-friction next move at a time, with escape hatches such as **Too hard**, **Different**, **I need a person**, and **Stop**. The AI ranks interventions internally, but the user experiences choices, not commands. The product must sound like a calm peer preserving agency, not a therapist, coach, parent, judge, or authority.

By default, sessions are ephemeral. The user can optionally save what helped, but raw craving transcripts, exact locations, crisis statements, and sensitive behavior details should not be retained by default. Crisis-level language interrupts the normal flow and routes the user toward human care.

## User Stories

1. As a person in an urge moment, I want one large Shift Now action, so that I can start without thinking.
2. As a person in an urge moment, I want help within seconds, so that the app does not add friction when I have low self-control.
3. As a person in an urge moment, I want to start without creating an account, so that privacy fear does not stop me.
4. As a person in an urge moment, I want to use a private session, so that my sensitive moment is not saved unless I choose.
5. As a person in an urge moment, I want the app to begin with a simple pause or grounding action, so that I can delay before deciding.
6. As a person in an urge moment, I want to choose "No talking," so that I can get support when words feel like too much.
7. As a person in an urge moment, I want to choose "Distract me," so that I can interrupt the loop without doing emotional processing.
8. As a person in an urge moment, I want to choose "Calm my body," so that I can regulate physical stress before choosing.
9. As a person in an urge moment, I want to choose "Get me through 10 minutes," so that I can focus on delay rather than quitting forever.
10. As a person in an urge moment, I want the app to ask optional check-in questions after the first intervention starts, so that I am not blocked by forms.
11. As a person with mixed readiness, I want the app to support delay or harm reduction, so that I am not forced into an abstinence-only flow.
12. As a person with low readiness, I want help making the next action less risky, so that the app remains useful even if I am not ready to stop.
13. As a person who dislikes advice, I want the app to offer options rather than commands, so that I still feel in control.
14. As a person who dislikes advice, I want to reject all options, so that the app does not argue with me.
15. As a person who dislikes advice, I want to make my own plan, so that the app supports agency instead of replacing it.
16. As a person who dislikes advice, I want a "No advice" tone mode, so that the app can simply help me wait.
17. As a person who feels shame, I want nonjudgmental language, so that asking for help does not make me feel worse.
18. As a person who feels shame, I want the app to avoid words like addict, failed, clean, relapse, or bad habit, so that the experience stays safe and usable.
19. As a person who is privacy-fearful, I want to see before the session that no account is required, so that I can trust the first use.
20. As a person who is privacy-fearful, I want session data to disappear unless I save it, so that I can use the product in sensitive moments.
21. As a person who is privacy-fearful, I want to know exactly what will be remembered, so that memory does not feel hidden.
22. As a person who is privacy-fearful, I want to delete a session immediately, so that I remain in control.
23. As a person who is privacy-fearful, I want no automatic sharing with family, sponsors, clinicians, employers, insurers, schools, or law enforcement, so that the app cannot be used against me.
24. As a person who wants support, I want to preview any message before sending it, so that sharing remains my choice.
25. As a person who may be in crisis, I want the app to stop ordinary urge coaching when I describe danger, so that I am routed toward human care.
26. As a person who may be in crisis, I want the app to avoid false reassurance, so that it does not pretend to know I am safe.
27. As a person who may be in crisis, I want emergency, crisis, or trusted-person options, so that I can reach help beyond the app.
28. As a returning user, I want saved sessions to create pattern insights only when I opt in, so that personalization does not depend on silent tracking.
29. As a returning user, I want the Patterns view to show what helped, so that I can reuse safer next moves.
30. As a returning user, I want the Patterns view to avoid shame metrics, so that progress is not framed as failure or relapse.
31. As a returning user, I want to see "urges navigated" or "patterns learned," so that the language supports agency.
32. As a user, I want the product to avoid clinical claims, so that I understand this is wellness support, not treatment.
33. As a user, I want the product to say it cannot replace therapy, emergency care, or medical advice, so that its limits are clear.
34. As a user in Thailand, I want Thai/English privacy and safety notices, so that I can understand the product's limits and data behavior.
35. As a hackathon judge, I want to understand the product in under 30 seconds, so that the demo is clear.
36. As a hackathon judge, I want to see a live intervention within seconds, so that the product feels useful in the actual urge moment.
37. As a hackathon judge, I want to see why the AI chose an option without exposing sensitive details, so that the system feels credible and safe.
38. As a hackathon judge, I want to see a crisis case route away from normal coaching, so that the safety boundary is visible.
39. As a hackathon judge, I want to see simulated metrics labeled clearly, so that the prototype remains honest.
40. As a builder, I want a clear active-session state machine, so that product, safety, memory, and UI behavior stay consistent.
41. As a builder, I want tone rules and banned-language tests, so that copy changes do not accidentally become moralizing.
42. As a builder, I want privacy contracts around unsaved and saved sessions, so that sensitive data handling is testable.
43. As a builder, I want crisis disclosures excluded from personalization and analytics, so that safety data is not reused inappropriately.
44. As a builder, I want internal ranking hidden behind one next action and escape hatches, so that the user is not burdened by choices.
45. As a builder, I want fixtures for high-readiness, mixed-readiness, low-readiness, privacy-fearful, reactance, and crisis sessions, so that the non-user personas become test cases.

## Implementation Decisions

- The refined MVP should replace the original primary entry action "I'm having an urge" with **Shift Now**.
- The first intervention must begin before a full check-in. The target is help within seconds, not a complete intake form.
- The active session should support four fast modes:
  - **No talking**
  - **Distract me**
  - **Calm my body**
  - **Get me through 10 minutes**
- The active-session flow should use a simple state model:

```text
idle
  -> private_session_started
  -> first_shift_action
  -> optional_context
  -> next_action
  -> feedback_or_done
  -> save_or_discard

Any state
  -> human_care_routing
  -> exit
```

- The intervention ranker remains internal. The UI should not show a ranked list during an active urge.
- The user should receive one next action at a time, with escape hatches: **Too hard**, **Different**, **I need a person**, and **Stop**.
- **Too hard** should downgrade to lower-effort actions. **Different** should switch action category. **I need a person** should move toward trusted-contact or human-care options. **Stop** should allow exit without guilt.
- The product should include tone preferences: **Direct**, **Gentle**, and **No advice**.
- The "No advice" tone should use autonomy-preserving language such as "Want to wait 90 seconds before deciding?" and "You still choose. I can just keep time."
- All intervention copy must preserve agency. The app may suggest, offer, or keep time. It must not command.
- The product should support readiness-aware flows:
  - **High readiness:** user wants to avoid the urge.
  - **Mixed readiness:** part of the user wants to act.
  - **Low readiness:** user expects they may act anyway.
  - **No-problem-here:** user is exploring or does not identify with addiction framing.
- Low-readiness sessions should offer harm-reduction options: delay, reduce amount or intensity, move to a safer location, contact someone, remove one risky condition, choose a less harmful substitute, or plan a safer endpoint.
- The product positioning should avoid heavy addiction identity language. Prefer "urge," "pattern," "risky moment," "regret," "short reset," "safer next move," and "agency."
- Crisis signals must interrupt the normal product flow. Crisis routing should cover self-harm, overdose risk, withdrawal danger, immediate physical danger, abuse, coercion, inability to stay safe, and explicit "I need help now" language.
- Crisis routing must not say the user is safe, not at risk, or that the app can get them through it. It should say the situation is bigger than an urge-management moment and route to emergency, crisis, professional, or trusted-human support.
- The data model should be session-first. Default sessions require no account, no cloud sync, and no long-term memory.
- Unsaved session data should expire or be discarded after the intervention. Saved data should be narrow labels, not raw transcripts.
- Saved memory should be opt-in, scoped, inspectable, editable, and deletable.
- "Remember this for next time" should show exactly what will be remembered.
- The prototype should not save raw craving transcripts, exact locations, substance names, relapse admissions, or crisis statements by default.
- Separate consent should be required for account creation, saved history, personalization memory, analytics, notifications, emergency contact setup, and any human review.
- Sharing requires preview and explicit confirmation. There should be no automatic sharing with family, sponsors, clinicians, employers, insurers, schools, law enforcement, or community groups.
- The Patterns dashboard should be separate from the active urge flow. The active session should end with lightweight choices: **Done** or **Save what helped**.
- The Patterns dashboard should only use saved sessions and should avoid "failed urges," "relapses," "success rate," and streak framing.
- The demo should focus on one primary story: late-night stress in Bangkok, where the user is about to make a regretted choice and uses Shift Now to create a short pause and choose a safer next move.
- The strongest pitch line is: "Most wellness products help before or after the crisis. UrgeShift helps during the three minutes when the user is about to break their own intention."

## Testing Decisions

- Tests should verify external behavior and safety contracts rather than internal prompt wording.
- Active-session tests should verify that Shift Now starts a session and produces a first action before full check-in.
- Friction-budget tests should verify the user can reach the first intervention without account creation, long onboarding, or required mood journaling.
- Escape-hatch tests should verify **Too hard**, **Different**, **I need a person**, and **Stop** each produce the correct next state.
- Tone tests should verify Direct, Gentle, and No advice modes preserve the same safety behavior while changing surface language.
- Banned-language tests should reject intervention copy containing moralizing or clinical language such as "you should," "don't do it," "stay strong," "you failed," "addict," "clean," "relapse prevention," "treatment," or "AI therapist."
- Readiness tests should cover high-readiness, mixed-readiness, low-readiness, and no-problem-here messages.
- Harm-reduction tests should verify that "I'm going to do it anyway" receives safer-use, delay, reduction, environment-safety, or support options rather than abstinence-only advice.
- Reactance tests should verify that "don't tell me what to do" switches to autonomy-preserving language and allows exit.
- Privacy tests should verify that a private session can complete without an account and without saved history.
- Memory tests should verify that memory cannot be created silently and that saved labels are inspectable, editable, and deletable.
- Sharing tests should verify that messages are previewed and require explicit confirmation.
- Crisis tests should verify that self-harm, overdose, withdrawal danger, immediate physical danger, abuse, coercion, and emergency language stop ordinary coaching and route to human care.
- Crisis data tests should verify that crisis disclosures are not reused for personalization, analytics, or model training in the prototype.
- Pattern tests should verify that only saved sessions appear in the Patterns dashboard.
- Demo tests should verify that the full judge demo can be completed in under three minutes and that simulated metrics are labeled as simulated.

## Out of Scope

- Convincing users who do not see any problem that they need help.
- Full addiction recovery planning.
- Therapy, clinical counseling, diagnosis, treatment, detox, withdrawal management, medication advice, or emergency care.
- Claims that UrgeShift cures addiction, prevents relapse, treats compulsive behavior, detects crisis, or keeps the user safe.
- Passive surveillance, background monitoring, exact GPS collection, microphone listening, browser/app surveillance, biometrics, contacts upload, social graph ingestion, or ad-targeting IDs.
- Automatic reporting to family, sponsors, clinicians, employers, insurers, schools, law enforcement, or community groups.
- Automatic emergency calling, police notification, or involuntary contact alerts in the prototype.
- Sponsor, clinician, therapist, employer, insurer, school, public-sector, or law-enforcement dashboards.
- Peer matching, community feeds, or group support using craving data.
- Persistent raw transcript storage.
- Using production user data for model training.
- Child or minor flows without separate legal and safety design.
- Multi-country regulatory strategy.
- Marketplace of coaches, therapists, retreats, or wellness providers.
- Complex wearable, biometric, or semiconductor-dependent integrations.

## Further Notes

- The persona debate changed the product from a reflective wellness app into a low-friction intervention layer.
- The best early target remains people who already want to reduce a specific behavior and retain enough agency to tap once. The MVP should not target denial-stage users, crisis-level users, or people needing clinical care as primary users.
- The product succeeds when users report choosing a safer next action within 10 minutes without increased shame or reduced agency.
- Good prototype metrics include time to first intervention, before/after urge intensity, safer-action selection, perceived agency, perceived judgment, perceived pushiness, option rejection rate, low-readiness completion rate, and privacy-related onboarding drop-off.
- The PDPA-friendly prototype posture is consent-forward and data-minimizing: no account by default, no persistent memory by default, no silent analytics over raw craving content, Thai/English privacy notice before external testing, and no production user data for model training.
- For hackathon storytelling, keep the post-AGI framing as the "why now": as persuasive environments become stronger, people need personal AI that protects their own stated intentions.
