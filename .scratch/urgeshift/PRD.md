# UrgeShift PRD

Status: ready-for-agent

## Problem Statement

People trying to reduce addictive or compulsive behavior often fail in a short, high-pressure window: the few minutes after a craving, trigger, social pressure, or stressful event hits. Generic advice is usually too late, too broad, or too moralizing. Clinical support is valuable, but it is rarely available inside the exact moment when the person needs a better next action.

For the Wellness AI hackathon, the base idea of an "AI platform for stopping addiction" is too broad and too medically risky. The useful problem is narrower: help a user preserve agency during the next 10 minutes by turning a craving into a safe, personalized alternative action, while clearly avoiding diagnosis, treatment, detox, medication, or recovery guarantees.

## Solution

Build **UrgeShift**, a mobile-first AI wellness companion for craving interruption and safer replacement planning.

UrgeShift gives the user a single urgent entry point: "I'm having an urge." The product asks a few fast questions, classifies the context and safety risk, retrieves suitable coping interventions, ranks alternatives using transparent criteria, and generates a short action plan for the next 90 seconds to 10 minutes. It learns from feedback, such as which alternatives helped, which did not, and which triggers tend to appear.

The product should be pitched as an AI safety layer for high-risk craving moments, not as addiction treatment. In a post-AGI world where persuasive systems, hyper-personalized content, and automated environments can amplify compulsive behavior, UrgeShift protects human agency by helping users pause, choose, and reconnect with human support when needed.

## User Stories

1. As a person experiencing a craving, I want a one-tap way to ask for help, so that I do not need to navigate a complicated app while distressed.
2. As a person experiencing a craving, I want the app to ask only a few questions, so that I can get support before the urge becomes automatic.
3. As a person experiencing a craving, I want to describe my urge in natural language, so that I can use my own words instead of fitting into rigid categories.
4. As a person experiencing a craving, I want to rate urge intensity from 1 to 10, so that the app can adjust the support level.
5. As a person experiencing a craving, I want to identify the trigger, so that the app can suggest alternatives matched to the real cause.
6. As a person experiencing a craving, I want a short plan for the next 90 seconds, so that I have something immediate to do.
7. As a person experiencing a craving, I want a 10-minute detour plan, so that I can delay the harmful behavior long enough for the urge to pass or weaken.
8. As a person experiencing a craving, I want the plan to include only practical actions available in my situation, so that the advice does not feel generic.
9. As a person experiencing a craving, I want alternatives that match my preferences, so that I am more likely to try them.
10. As a person experiencing a craving, I want the app to avoid shame or moralizing language, so that I do not feel worse after asking for help.
11. As a person experiencing a craving, I want to reject an action that does not work for me, so that the system can adapt.
12. As a person experiencing a craving, I want the system to remember which actions helped before, so that future suggestions improve.
13. As a person experiencing a craving, I want the system to explain why it suggested an action, so that I can trust the recommendation.
14. As a person experiencing a craving, I want to choose between solo, movement, reflection, environment-change, and social-support actions, so that I can pick what feels possible.
15. As a person experiencing a craving, I want a safe way to message a support person, so that I can ask for help without composing the message myself.
16. As a person experiencing a craving, I want the support message to be non-shaming and specific, so that the recipient knows how to help.
17. As a person experiencing a craving, I want the app to escalate crisis language, so that emergencies are not handled like ordinary wellness moments.
18. As a person experiencing a craving, I want the app to refuse unsafe medical, detox, overdose, or self-harm guidance, so that I am routed toward appropriate human help.
19. As a person experiencing a craving, I want the app to show local support resources, so that I know where to turn when risk is high.
20. As a person experiencing a craving, I want the app to work in Thai and English, so that I can use the language that feels natural in the moment.
21. As a person trying to reduce alcohol use, I want help when I am near a place where I can buy alcohol, so that I can choose a route change or delay action.
22. As a person trying to reduce vaping or smoking, I want quick alternatives for workplace or school stress, so that I can interrupt habitual use.
23. As a person trying to reduce doomscrolling or compulsive digital behavior, I want bedtime and loneliness interventions, so that I can stop before losing hours.
24. As a person trying to reduce gambling, I want salary-day and high-access interventions, so that I can protect money before acting impulsively.
25. As a returning user, I want a dashboard of my top triggers, so that I can see patterns without feeling judged.
26. As a returning user, I want to see which alternatives worked most often, so that I can build a personal recovery playbook.
27. As a returning user, I want to see high-risk time windows, so that I can plan ahead.
28. As a returning user, I want the app to summarize progress without using brittle streaks, so that one lapse does not erase all progress.
29. As a returning user, I want feedback questions after a plan, so that the system can learn what happened.
30. As a returning user, I want to control what memory the system keeps, so that I can protect sensitive data.
31. As a returning user, I want to delete or reset my history, so that I remain in control of my data.
32. As a returning user, I want the app to distinguish between wellness support and medical care, so that I understand its limits.
33. As a trusted support person, I want a clear message explaining what kind of support is needed, so that I do not have to guess.
34. As a trusted support person, I want the message to say that I do not need to fix the whole problem, so that I can provide realistic support.
35. As a hackathon judge, I want to see a live craving scenario, so that I can understand the product within three minutes.
36. As a hackathon judge, I want to see how AI is used beyond generic chat, so that the technical contribution is credible.
37. As a hackathon judge, I want to see the classifier, retrieval, ranking, and safety gate outputs, so that the system is explainable.
38. As a hackathon judge, I want to see simulated before/after craving intensity, so that the MVP has measurable outcomes.
39. As a hackathon judge, I want clear safety boundaries, so that the product does not overclaim clinical impact.
40. As a hackathon judge, I want a Thailand-specific wellness story, so that the project aligns with the Wellness Thailand strategy.
41. As a hackathon judge, I want a post-AGI rationale, so that the project is not just a generic health chatbot.
42. As a builder, I want a constrained intervention library, so that recommendations can be safer and testable.
43. As a builder, I want interventions tagged with metadata, so that retrieval and ranking can be deterministic enough to debug.
44. As a builder, I want the risk classifier to return structured output, so that safety and ranking modules can consume it reliably.
45. As a builder, I want a transparent ranking score, so that I can compare recommendations against a baseline.
46. As a builder, I want synthetic demo profiles, so that the product can be demonstrated without collecting sensitive real data.
47. As a builder, I want simulated interaction logs, so that the dashboard can show learning behavior during the hackathon.
48. As a builder, I want a safety test set, so that crisis and unsafe prompts can be checked before demo.
49. As a builder, I want the app to label synthetic metrics as simulated, so that the pitch remains honest.
50. As a builder, I want the MVP to avoid integrations with hospitals, insurers, employers, and law enforcement, so that the deployment story stays consent-first.

## Implementation Decisions

- The MVP should be a mobile-first web app optimized around a single urgent action: "I'm having an urge."
- The initial demo wedge should focus on one primary scenario, preferably alcohol craving for a young Thai professional or university student in Bangkok. Secondary scenarios may include nicotine, gambling, and doomscrolling only as synthetic examples.
- The product positioning must use "wellness support," "harm-reduction support," "craving interruption," "alternative action," and "agency" language. It must not claim to cure, stop, diagnose, treat, prevent relapse, provide therapy, manage withdrawal, or provide medical advice.
- The core system should be composed of deep modules with simple interfaces:
  - **Craving intake module:** captures user message, craving intensity, trigger, setting, language, and optional support preference.
  - **Risk and intent classifier:** returns structured categories for behavior type, craving severity, relapse risk, emergency risk, trigger, and user intent.
  - **Safety gate:** detects crisis, self-harm, overdose, severe withdrawal, violence, minors, unsafe requests, and medical requests before ordinary coaching continues.
  - **Intervention library:** stores curated coping actions with metadata such as behavior type, trigger fit, risk level, duration, effort, social support requirement, contraindications, and cultural relevance.
  - **Intervention retriever:** selects candidate interventions from the library using behavior, trigger, risk, language, and user profile.
  - **Intervention ranker:** scores interventions by trigger match, safety, immediacy, user preference, past success, and effort.
  - **Action plan generator:** turns the highest-ranked interventions into a concise 90-second or 10-minute plan.
  - **Feedback loop:** captures whether the user tried the plan, whether craving intensity changed, and whether an action should be preferred or avoided later.
  - **Pattern insight module:** summarizes triggers, high-risk windows, best alternatives, and simulated progress.
  - **Demo scenario module:** provides synthetic personas, interactions, and dashboard data for hackathon presentation.
- The risk classifier should return structured data rather than free prose, because downstream safety and ranking behavior should be testable.
- The intervention library should be constrained and metadata-driven rather than relying on the LLM to invent coping strategies freely.
- The intervention ranker should be transparent. For the demo, the scoring formula should be:

```text
score =
  0.30 * trigger_match
+ 0.20 * safety_score
+ 0.15 * immediacy
+ 0.15 * user_preference_match
+ 0.10 * historical_success
+ 0.10 * low_effort
```

- The action plan should be short. In a craving moment, the app should not produce therapy essays.
- The safety gate must run before and after action generation. It should escalate crisis scenarios and prevent unsafe generated content.
- The system should include local Thailand support resources in the demo flow where appropriate, including mental health hotline and emergency support references if high-risk language appears.
- The product should support Thai/English content if feasible within the hackathon, but bilingual support is secondary to a safe single-language demo.
- Memory should be explicit and user-controlled. The prototype can simulate memory but should still show controls for deleting or disabling it.
- The support-person feature should be optional. It should draft a message but should not send without user confirmation.
- The dashboard should avoid streaks as the primary progress metaphor. It should use "urges navigated," "patterns learned," "money/time protected," "actions that helped," and "next prevention plan."
- The MVP should label all demo data and outcome metrics as prototype or simulated.

## Testing Decisions

- Tests should verify external behavior through module inputs and outputs. They should not assert implementation details such as exact prompt wording, private chain-of-thought, or internal scoring steps beyond public scoring contracts.
- The risk and intent classifier should be tested with representative synthetic user messages covering low, medium, high, and crisis-risk cases.
- The safety gate should be tested with adversarial cases for self-harm, overdose, severe withdrawal, medical advice requests, unsafe concealment, sourcing substances, combining substances, and minors.
- The intervention retriever should be tested for retrieval precision: the top candidates should match behavior type, trigger, risk level, and contraindications.
- The intervention ranker should be tested with fixed candidate sets to verify that safer, more immediate, and more preference-matched actions outrank generic alternatives.
- The action plan generator should be tested for behavioral constraints: concise output, no diagnosis, no treatment claim, no medication guidance, no shame language, and clear next action.
- The feedback loop should be tested to ensure accepted and rejected interventions affect future ranking in predictable ways.
- The pattern insight module should be tested using synthetic logs to verify trigger summaries, high-risk windows, and best-action summaries.
- The demo scenario module should be tested to ensure all synthetic metrics are clearly labeled as simulated.
- End-to-end tests should cover the main demo path: high alcohol craving near a convenience store, safe classification, ranked intervention, action plan, feedback, and updated dashboard.
- End-to-end tests should also cover crisis escalation: user expresses self-harm or overdose danger, ordinary coaching is stopped, and escalation content is shown.
- Since there is currently no application code in this workspace, there is no prior test pattern to reuse. The implementation should introduce focused tests around the deep modules above before adding broad UI tests.

## Out of Scope

- Diagnosing addiction, substance use disorder, depression, anxiety, or any medical condition.
- Providing therapy, clinical treatment, detox instructions, withdrawal management, medication advice, or emergency medical advice.
- Claiming that UrgeShift stops addiction, prevents relapse, cures addiction, or improves abstinence outcomes.
- Training a clinical model on real patient data.
- Collecting real sensitive health data during the hackathon.
- Integrating with hospitals, clinics, insurers, employers, law enforcement, or public-sector records.
- Automatically notifying family, employers, clinicians, police, or support contacts without explicit user confirmation.
- Building a full multi-addiction platform with complete clinical pathways.
- Building wearable, biometric, or semiconductor-dependent sensing.
- Building a therapist dashboard or clinician workflow.
- Building payment, subscription, or production account management.
- Building production-grade PDPA compliance beyond a prototype-level consent and data-minimization story.
- Running a clinical efficacy study.

## Further Notes

- The strongest pitch line is: "UrgeShift is an AI safety layer for craving moments: it helps people survive the next 10 minutes by replacing harmful impulses with personalized, culturally relevant, safer alternatives."
- The post-AGI argument should be explicit: as AI systems become more persuasive and environments become more optimized for compulsion, wellness tools must help humans preserve agency rather than only maximize engagement.
- The Thailand alignment should emphasize preventive wellness, mental health, culturally relevant alternatives, tourism-grade wellness services, and responsible AI adoption.
- The best three-minute demo is a live scenario with Mint, a 27-year-old in Bangkok, who is stressed after work and about to buy alcohol. UrgeShift detects high risk, retrieves and ranks interventions, generates a short detour plan, drafts an optional buddy message, records feedback, and updates the insight dashboard.
- The product should make its safety design visible in the pitch. Judges should see that the team knows addiction is a high-risk domain and has deliberately narrowed the claim.
