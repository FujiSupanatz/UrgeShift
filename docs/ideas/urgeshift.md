# UrgeShift — Killer-Feature-Led MVP

## Problem Statement

How might UrgeShift help someone survive the next 10 minutes when willpower is offline, without requiring typing, motivation, full honesty, account setup, or clinical framing?

## Recommended Direction

Build **UrgeShift: one tap between urge and regret**.

The killer wedge is not **AI chatbot for addiction**, **wellness companion**, or **tracking dashboard**. It is **one-tap urge autopilot**: AI that buys the user the next 90 seconds when intention is collapsing.

The first screen should be one giant button:

```text
[ Shift Now ]
```

Tap starts help immediately. No login. No onboarding. No check-in form. First move appears in seconds:

```text
Move 20 steps away from where you are.
No need to decide anything yet.

[Done] [Too hard] [Different] [I need a person] [Stop]
```

Context comes after action starts. The user leaks signal through taps, not essays. UrgeShift should treat low energy, ambivalence, denial, and "I'll do it anyway" as normal urge states, not failures.

## Refined Product Promise

> UrgeShift helps you survive the next 10 minutes when willpower is offline. Tap once, get one safer move, and keep control without explaining your whole life.

Short pitch:

> One tap between urge and regret.

---

# Killer Features

## 1. Shift Now

One button starts a private session immediately. First action appears before any full check-in.

**Why it matters:** people in craving moments will not fill forms. The app should act first, then ask.

**Demo moment:**

```text
Mint opens UrgeShift.
She taps Shift Now.
The app gives a first move in seconds.
```

---

## 2. No-Context First Move

UrgeShift must work with zero user context.

Default safe intervention stack:

```text
1. Pause timer: 90 seconds
2. Move away from cue
3. Drink water, sit, or eat
4. Ground body
5. Message person
6. Reduce harm if user will do it anyway
7. Escalate if crisis language appears
```

Core principle:

> Low effort beats personalization in the first session.

**Why it matters:** most wellness apps require honesty, energy, and explanation. UrgeShift assumes the user may have none.

---

## 3. Context Crumbs

Replace check-in form with tiny buttons after the first action starts:

```text
What kind of urge?
[Drink] [Vape] [Scroll] [Gamble] [Other]

Energy right now?
[No talking] [Tiny action] [Can talk]

What blocked you?
[Too hard] [Wrong vibe] [Still want it] [Need person]
```

AI updates ranking from crumbs:

```text
Too hard -> lower effort
Different -> change category
Still want it -> harm reduction
Need person -> buddy bridge
No talking -> nonverbal action
```

**Why it matters:** the user does not write context. They leak context through taps.

---

## 4. Too Hard Button

Every action has escape hatches:

```text
[Done] [Too hard] [Different] [I need a person] [Stop]
```

When the user taps **Too hard**, UrgeShift downshifts without scolding.

```text
Original:
Walk outside for 5 minutes.

Too hard version:
Stand up. Turn around. Put one hand on wall. Breathe once.
```

**Why it matters:** the user did not fail; the system adapted.

---

## 5. I’ll Do It Anyway Mode

For low-readiness users.

User says:

```text
I'm going to drink anyway.
```

Bad app response:

```text
Don't drink. Think of your goals.
```

UrgeShift response:

```text
Okay. Let's make the next 10 minutes safer.
Pick one:
[Eat first] [Buy water too] [Move away from store] [Message someone] [Set endpoint]
```

**Why it matters:** UrgeShift still helps when the user is not ready to change.

---

## 6. Personal 10-Minute Plan

After a session helps, ask:

```text
Save this as your plan?

When urge hits after work near a store, show me:
1. Walk away
2. Buy food/water
3. Message someone
```

Store as an if-then plan:

```text
IF stress + night + near store
THEN walk 20 steps away + buy water + send buddy text
```

**Why it matters:** this creates learning without creepy tracking.

---

## 7. Buddy Bridge

One tap creates a message draft.

```text
[ I need a person ]
```

English draft:

```text
Hey, I’m trying to get through a craving for 10 minutes.
Can you stay with me by chat?
No need to fix anything.
```

Thai draft:

```text
เฮ้ เราขอให้ช่วยอยู่เป็นเพื่อน 10 นาทีได้ไหม
ตอนนี้กำลังพยายามผ่าน urge อยู่
ไม่ต้องแก้ปัญหา แค่อยู่ด้วยก็พอ
```

**Boundary:** do not auto-send. Draft only. User stays in control.

---

# Refined AI System

UrgeShift’s AI system is built around one principle:

> Act before asking. Adapt from taps, not essays.

```text
Shift Now
  -> no-context first move
  -> crisis gate
  -> one action card
  -> escape-hatch listener
  -> context crumb collector
  -> burden-aware ranker
  -> next safer move
  -> low-readiness harm reduction if needed
  -> optional buddy draft
  -> optional save as 10-minute plan
```

## Core AI Loops

### No-Context Starter Loop

- User taps **Shift Now**.
- AI gives the safest low-effort first move without asking for background.
- Default priority:
  - pause
  - move away from cue
  - reduce stimulation
  - ground body
  - drink/eat/sit
  - contact person
  - escalate if crisis language appears

### Escape-Hatch Adaptation Loop

- **Too hard** -> make action smaller.
- **Different** -> switch intervention category.
- **I need a person** -> generate buddy draft.
- **Stop** -> end session without shame.
- **I’ll do it anyway** -> switch to harm-reduction mode.

### Context Crumb Loop

- Ask only one-tap signals after action starts.
- Examples:
  - urge type
  - energy level
  - location category
  - social state
  - blocker
- No long text required.

### Personal 10-Minute Plan Loop

- If user says an action helped, save it as an if-then rule.
- Example:
  - **IF** stress + night + near store
  - **THEN** walk away + buy water + message friend
- No raw transcript saved by default.

## Burden-Aware Ranking

```text
score =
  0.25 safety
+ 0.20 immediacy
+ 0.20 low_effort
+ 0.15 trigger_match
+ 0.10 past_success
+ 0.10 autonomy_fit
- 0.25 context_required
- 0.20 shame_or_pushiness
- 0.15 social_exposure_risk
```

## Non-Negotiable Rule

> In the first 90 seconds, low effort beats personalization.

Personalization matters only after user survives the first friction point.

---

# Key Assumptions to Validate

## Killer Feature 1: Shift Now

- [ ] Users tap **Shift Now** more often than they complete a check-in-first flow.
- [ ] Time-to-first-action is under 10 seconds.
- [ ] Users understand the product without explanation.
- [ ] No-login private session increases willingness to use the app for sensitive urges.

## Killer Feature 2: No-Context First Move

- [ ] A no-context first move feels useful, not random.
- [ ] Default actions are safe across alcohol, vaping, doomscrolling, gambling, and “regretted choice.”
- [ ] Users tolerate the first action before giving context.
- [ ] Judges understand why “help before explanation” is the wedge.

## Killer Feature 3: Context Crumbs

- [ ] One-tap crumbs produce enough signal for better next action.
- [ ] Crumbs reduce drop-off versus free-text check-in.
- [ ] Users prefer chips/buttons during high urge.
- [ ] The system can adapt meaningfully from only 2–3 crumbs.

## Killer Feature 4: Too Hard Button

- [ ] **Too hard** increases continuation instead of session abandonment.
- [ ] Downshifted actions reduce shame.
- [ ] Users feel the system adapts to their energy.
- [ ] “Too hard” gives better signal than asking “why?”

## Killer Feature 5: I’ll Do It Anyway Mode

- [ ] Low-readiness users accept harm-reduction options more than stop/quit advice.
- [ ] The app can reduce risk without sounding permissive.
- [ ] Users do not feel judged when they admit they still want the behavior.
- [ ] Safety review confirms harm-reduction copy does not encourage dangerous behavior.

## Killer Feature 6: Personal 10-Minute Plan

- [ ] Users are willing to save only what helped.
- [ ] If-then plans feel lightweight, not clinical.
- [ ] Saved plans improve second-session speed.
- [ ] Users trust the app more when it saves actions, not confessions.

## Killer Feature 7: Buddy Bridge

- [ ] A buddy message draft feels useful and not embarrassing.
- [ ] Users prefer manual send over auto-contact.
- [ ] Thai/English copy feels natural.
- [ ] Buddy Bridge works without exposing sensitive history.

---

# MVP Scope

Build the demo around **one complete urge-interruption loop**, not a full wellness platform.

## Must Build

### Shift Now

- One-button entry.
- Private session.
- No login required for demo.

### No-Context First Move

- First action appears immediately.
- Action card includes:
  - instruction
  - 90-second timer
  - Done
  - Too hard
  - Different
  - I need a person
  - Stop

### Too Hard Adaptation

- Original action downshifts into smaller action.
- Example:
  - “Walk 20 steps away”
  - -> “Turn away from entrance. Hold phone with both hands. Breathe once.”

### Context Crumbs

- One-tap urge type.
- One-tap energy level.
- One-tap blocker.

### I’ll Do It Anyway Mode

- Switches from prevention to harm reduction.
- Example options:
  - eat first
  - buy water too
  - move to safer place
  - set endpoint
  - message someone

### Personal 10-Minute Plan

- After **Helped**, ask to save plan.
- Save as if-then rule.
- Show next-session personalization.

### Buddy Bridge

- Generate message draft.
- User sends manually.
- No auto-sharing.

### Crisis Gate

- Detect:
  - self-harm
  - overdose risk
  - withdrawal danger
  - immediate danger
  - abuse/coercion
  - inability to stay safe
- Route away from coaching.
- Show human/emergency support message.

---

# Demo Persona

```text
Mint, 27, Bangkok.
Stressful workday. 10:45 PM.
Near convenience store.
Craving level: 8/10.
Low energy.
Does not want to explain.
```

# Demo Flow

```text
1. Mint opens app.
2. Taps Shift Now.
3. App gives no-context first move:
   "Walk 20 steps away from the store. No decision yet."
4. Mint taps Too hard.
5. App downshifts:
   "Turn away from the entrance. Hold your phone with both hands. Breathe once."
6. App asks one crumb:
   "What kind of urge?"
   [Drink] [Vape] [Scroll] [Other]
7. Mint taps Drink.
8. App asks:
   "Energy?"
   [No talking] [Tiny action] [Can talk]
9. Mint taps No talking.
10. App gives low-effort next move:
    "Buy water first. No promise. Just delay the first drink."
11. Mint taps:
    "I'm going to drink anyway."
12. App switches:
    "Okay. Let's make it safer first."
    [Eat first] [Buy water too] [Set endpoint] [Message someone]
13. Mint chooses Buy water too.
14. App asks:
    "Did this help?"
    [Helped] [Too hard] [Wrong] [I did it anyway]
15. Mint taps Helped.
16. App asks:
    "Save this as your 10-minute plan?"
```

## Cut From MVP

- Leaderboard.
- Friend leaderboard.
- Friend position tracking.
- Streak competition.
- Heavy dashboard.
- Full profile.
- Passive GPS.
- App/browser monitoring.
- Deep addiction-specific protocol.
- Recovery community.
- Clinical claims.

---

# Not Doing and Why

## Not building an addiction recovery app

The wedge is urgent interruption, not long-term treatment.

## Not building an AI therapist

Clinical framing creates safety, trust, and regulatory risk.

## Not building a generic chatbot

Conversation is not the product. The product is one safer next move.

## Not asking for full context first

Users in urge moments may have low energy, low honesty, low patience, or low trust.

## Not requiring account setup

Account friction kills the first session.

## Not saving raw sensitive data by default

The app should save “what helped,” not confessions.

## Not using leaderboards as killer feature

Leaderboards can motivate some users, but in urge/substance contexts they risk shame, comparison, and disengagement. Gamification evidence in health is mixed and context-dependent, not automatically good.

## Not tracking friends’ behavior

Friend surveillance conflicts with privacy, autonomy, and stigma-sensitive design. Substance-use stigma is a real barrier to help-seeking and engagement.

## Not auto-contacting anyone

Buddy Bridge drafts only. User stays in control.

## Not claiming clinical outcomes

Measure short-term agency, delay, safer-action selection, and perceived usefulness.

---

# Open Questions

## Shift Now

- What should the first no-context action be?
- Should first action differ by selected mode?
  - No talking
  - Tiny action
  - Distract me
  - Calm body
- How fast must the first action appear to feel useful?

## No-Context First Move

- Which actions are safe across urge types?
- Which actions are unsafe for specific categories?
- Should alcohol, gambling, and self-harm-adjacent cases have stricter guardrails?

## Context Crumbs

- What is the minimum useful crumb set?
- Is 1 crumb enough?
- Is 3 crumbs too many?
- Should crumbs appear before or after the 90-second pause?

## Too Hard Button

- How small should the downshifted action become?
- Can “Too hard” accidentally train avoidance?
- What copy avoids making the user feel weak?

## I’ll Do It Anyway Mode

- What harm-reduction options are safe to show for alcohol?
- What copy avoids sounding like permission?
- When should harm reduction stop and crisis routing begin?

## Personal 10-Minute Plan

- Should plans be saved locally only?
- Should users name their own plan?
- Should the app show “last time walking helped” or avoid memory language?

## Buddy Bridge

- Should the app show a trusted-contact setup after the first successful session?
- Should Thai copy be casual, serious, or very minimal?
- Should Buddy Bridge include hotline/resources only after danger signals?

---

# Evidence Notes

## JITAI / Timing Support

UrgeShift fits Just-in-Time Adaptive Intervention logic: give the right type or amount of support at the right time, adapting to the user’s changing internal/contextual state.

Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC5364076/

## EMA Burden / Context Burden

Mobile EMA research shows compliance and reporting burden are design problems. This supports replacing long check-ins with **Context Crumbs** and tap-based signals.

Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC7970161/

## Motivational Interviewing / Ambivalence

Motivational interviewing is built around ambivalence and autonomy rather than confrontation. This supports **I’ll Do It Anyway Mode**, but UrgeShift should not claim to deliver MI therapy.

Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC1463134/

## Implementation Intentions / If-Then Plans

Implementation-intention research supports if-then planning as a bridge from intention to action. This supports the **Personal 10-Minute Plan** feature.

Source: https://www.sciencedirect.com/science/chapter/bookseries/pii/S0065260106380021

## Gamification Caution

Gamification can help health behavior, but effects depend on design and user context. Competitive leaderboards are risky for UrgeShift because the product deals with shame-sensitive, private, high-risk moments. Use private progress, not public ranking.

Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC5073629/

## Stigma / Privacy

Substance-use stigma can harm engagement and help-seeking. This supports private sessions, no raw sensitive storage, no friend tracking, and no shame metrics.

Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC6260179/
