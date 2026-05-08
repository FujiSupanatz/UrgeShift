export const crumbSteps = [
  {
    key: "urge",
    prompt: "What kind of urge?",
    options: ["Drink", "Vape", "Scroll", "Gamble", "Other"],
  },
  {
    key: "energy",
    prompt: "Energy right now?",
    options: ["No talking", "Tiny action", "Can talk"],
  },
  {
    key: "blocker",
    prompt: "What blocked you?",
    options: ["Too hard", "Wrong vibe", "Still want it", "Need person"],
  },
];

export const actions = {
  first: {
    mode: "No-context first move",
    text: "Move 20 steps away from where you are.",
    subtext: "No need to decide anything yet.",
    planStep: "move 20 steps away",
    category: "move-away",
  },
  downshift: {
    mode: "Too hard downshift",
    text: "Turn away from the entrance. Hold your phone with both hands. Breathe once.",
    subtext: "This still counts. Smaller is the point.",
    planStep: "turn away, hold the phone with both hands, and breathe once",
    category: "downshift",
  },
  different: {
    mode: "Different move",
    text: "Put one object between you and the cue.",
    subtext: "A door, a table, a bottle of water, anything that adds friction.",
    planStep: "put one object between you and the cue",
    category: "friction",
  },
  water: {
    mode: "Low-effort next move",
    text: "Buy water first. No promise. Delay the first drink by 10 minutes.",
    subtext: "You are not negotiating your whole life. Just the next move.",
    planStep: "buy water first and wait 10 minutes",
    category: "delay",
  },
  vape: {
    mode: "Low-effort next move",
    text: "Put the vape out of reach. Keep both feet on the floor for 10 breaths.",
    subtext: "Create one small gap before the next decision.",
    planStep: "put the cue out of reach and take 10 breaths",
    category: "distance",
  },
  scroll: {
    mode: "Low-effort next move",
    text: "Lock the screen and place the phone face down for 90 seconds.",
    subtext: "No productivity goal. Just one quiet gap.",
    planStep: "place the phone face down for 90 seconds",
    category: "reduce-stimulation",
  },
  gamble: {
    mode: "Low-effort next move",
    text: "Step away from payment access and wait 90 seconds before any next tap.",
    subtext: "Add friction before money moves.",
    planStep: "step away from payment access and wait 90 seconds",
    category: "money-friction",
  },
  harm: {
    mode: "Harm-reduction mode",
    text: "Okay. Let's make the next 10 minutes safer first.",
    subtext: "Pick one damage-reducing move. No lecture.",
    planStep: "choose one safer move before the next decision",
    category: "harm-reduction",
  },
  buddy: {
    mode: "Buddy Bridge",
    text: "Draft a short message to someone safe.",
    subtext: "Preview it first. Nothing is sent automatically.",
    planStep: "message someone safe before the next decision",
    category: "support",
  },
  crisis: {
    mode: "Crisis gate",
    text: "This needs a person, not a coaching loop.",
    subtext: "If you may not stay safe, contact emergency support or someone nearby now.",
    planStep: "",
    category: "human-care",
    supportOptions: [
      "Contact local emergency services if there is immediate danger.",
      "Reach a trusted person nearby and stay with them.",
      "Use a local crisis or medical support line if emergency care is not the right fit.",
    ],
  },
  stopped: {
    mode: "Session stopped",
    text: "No shame. You can leave now or start again.",
    subtext: "Stopping is user control, not failure.",
    planStep: "",
    category: "exit",
  },
};

export const harmReductionOptions = [
  {
    label: "Eat first",
    planStep: "eat something small first",
    action: {
      mode: "Harm-reduction option",
      text: "Eat something small before the next decision.",
      subtext: "Add one body-care step before anything else.",
    },
  },
  {
    label: "Buy water too",
    planStep: "buy water too",
    action: {
      mode: "Harm-reduction option",
      text: "Add water to the next step.",
      subtext: "Keep the 10-minute pause visible.",
    },
  },
  {
    label: "Move away",
    planStep: "move to a safer spot",
    action: {
      mode: "Harm-reduction option",
      text: "Move to a brighter or less cue-heavy spot before deciding.",
      subtext: "Change the setting before the next move.",
    },
  },
  {
    label: "Set endpoint",
    planStep: "set a clear endpoint for the next 10 minutes",
    action: {
      mode: "Harm-reduction option",
      text: "Set a clear endpoint for the next 10 minutes.",
      subtext: "Pick where you will be and when this pause ends.",
    },
  },
  {
    label: "Message someone",
    planStep: "message someone safe",
    action: {
      mode: "Harm-reduction option",
      text: "Use the buddy draft before the next decision.",
      subtext: "A person can hold the moment with you.",
    },
  },
];

export const buddyDraft =
  "Hey, I'm trying to get through a craving for 10 minutes.\n" +
  "Can you stay with me by chat?\n" +
  "No need to fix anything.";
