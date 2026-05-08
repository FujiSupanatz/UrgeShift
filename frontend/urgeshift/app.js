const state = {
  active: false,
  seconds: 90,
  timerId: null,
  urge: "unknown",
  energy: "unknown",
  blocker: "none",
  mode: "waiting",
  helpedAction: "",
  crumbStep: 0,
};

const actions = {
  first: {
    mode: "No-context first move",
    text: "Move 20 steps away from where you are.",
    subtext: "No need to decide anything yet.",
  },
  downshift: {
    mode: "Too hard downshift",
    text: "Turn away from the entrance. Hold your phone with both hands. Breathe once.",
    subtext: "This still counts. Smaller is the point.",
  },
  different: {
    mode: "Different move",
    text: "Put one object between you and the cue.",
    subtext: "A door, a table, a bottle of water, anything that adds friction.",
  },
  water: {
    mode: "Low-effort next move",
    text: "Buy water first. No promise. Delay the first drink by 10 minutes.",
    subtext: "You are not negotiating your whole life. Just the next move.",
  },
  harm: {
    mode: "Harm-reduction mode",
    text: "Okay. Let's make the next 10 minutes safer first.",
    subtext: "Pick one damage-reducing move. No lecture.",
  },
  crisis: {
    mode: "Crisis gate",
    text: "This needs a person, not a coaching loop.",
    subtext: "If you may not stay safe, contact emergency support or someone nearby now.",
  },
};

const crumbSteps = [
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

const $ = (selector) => document.querySelector(selector);

const elements = {
  stage: $(".stage"),
  idleScreen: $("#idleScreen"),
  sessionScreen: $("#sessionScreen"),
  sessionStatus: $("#sessionStatus"),
  timer: $("#timer"),
  actionMode: $("#actionMode"),
  actionText: $("#actionText"),
  actionSubtext: $("#actionSubtext"),
  crumbPanel: $("#crumbPanel"),
  crumbPrompt: $("#crumbPrompt"),
  crumbOptions: $("#crumbOptions"),
  buddyPanel: $("#buddyPanel"),
  buddyDraft: $("#buddyDraft"),
  savePanel: $("#savePanel"),
  planPreview: $("#planPreview"),
  stateUrge: $("#stateUrge"),
  stateEnergy: $("#stateEnergy"),
  stateBlocker: $("#stateBlocker"),
  stateMode: $("#stateMode"),
  freeSignal: $("#freeSignal"),
  savedPlanText: $("#savedPlanText"),
};

function startSession() {
  state.active = true;
  state.seconds = 90;
  state.urge = "unknown";
  state.energy = "unknown";
  state.blocker = "none";
  state.mode = "first move";
  state.crumbStep = 0;
  state.helpedAction = actions.first.text;

  elements.idleScreen.classList.remove("active");
  elements.sessionScreen.classList.add("active");
  elements.stage.dataset.state = "active";
  elements.sessionStatus.textContent = "active";
  hidePanels();
  setAction(actions.first);
  updateStateBoard();
  startTimer();
}

function startTimer() {
  window.clearInterval(state.timerId);
  renderTimer();
  state.timerId = window.setInterval(() => {
    state.seconds = Math.max(0, state.seconds - 1);
    renderTimer();
    if (state.seconds === 0) {
      window.clearInterval(state.timerId);
      elements.sessionStatus.textContent = "pause complete";
    }
  }, 1000);
}

function renderTimer() {
  const minutes = Math.floor(state.seconds / 60).toString().padStart(2, "0");
  const seconds = (state.seconds % 60).toString().padStart(2, "0");
  elements.timer.textContent = `${minutes}:${seconds}`;
}

function setAction(action) {
  elements.actionMode.textContent = action.mode;
  elements.actionText.textContent = action.text;
  elements.actionSubtext.textContent = action.subtext;
  state.helpedAction = action.text;
  state.mode = action.mode.toLowerCase();
  updateStateBoard();
}

function hidePanels() {
  elements.crumbPanel.classList.add("hidden");
  elements.buddyPanel.classList.add("hidden");
  elements.savePanel.classList.add("hidden");
}

function showCrumbs(step = state.crumbStep) {
  const crumb = crumbSteps[step];
  if (!crumb) {
    setAction(actions.water);
    return;
  }

  elements.crumbPrompt.textContent = crumb.prompt;
  elements.crumbOptions.innerHTML = "";
  crumb.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => selectCrumb(crumb.key, option));
    elements.crumbOptions.appendChild(button);
  });
  elements.crumbPanel.classList.remove("hidden");
}

function selectCrumb(key, value) {
  state[key] = value.toLowerCase();
  state.crumbStep += 1;
  updateStateBoard();

  if (value === "Need person") {
    showBuddyBridge();
    return;
  }

  if (value === "Still want it") {
    showHarmReduction();
    return;
  }

  showCrumbs(state.crumbStep);
}

function showBuddyBridge() {
  elements.buddyDraft.value =
    "Hey, I'm trying to get through a craving for 10 minutes.\n" +
    "Can you stay with me by chat?\n" +
    "No need to fix anything.\n\n" +
    "เฮ้ เราขอให้ช่วยอยู่เป็นเพื่อน 10 นาทีได้ไหม\n" +
    "ตอนนี้กำลังพยายามผ่าน urge อยู่\n" +
    "ไม่ต้องแก้ปัญหา แค่อยู่ด้วยก็พอ";
  elements.buddyPanel.classList.remove("hidden");
  state.mode = "buddy bridge";
  updateStateBoard();
}

function showHarmReduction() {
  setAction(actions.harm);
  elements.crumbPrompt.textContent = "Pick one safer move";
  elements.crumbOptions.innerHTML = "";
  ["Eat first", "Buy water too", "Move away", "Set endpoint", "Message someone"].forEach(
    (option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option;
      button.addEventListener("click", () => {
        state.blocker = "harm reduction";
        state.helpedAction = option;
        updateStateBoard();
        askToSavePlan(option);
      });
      elements.crumbOptions.appendChild(button);
    },
  );
  elements.crumbPanel.classList.remove("hidden");
}

function askToSavePlan(actionText = state.helpedAction) {
  elements.savePanel.classList.remove("hidden");
  elements.planPreview.textContent =
    `IF stress + night + cue nearby, THEN ${actionText.toLowerCase()} + wait 10 minutes.`;
}

function savePlan() {
  const plan = elements.planPreview.textContent;
  localStorage.setItem("urgeshift-plan", plan);
  renderSavedPlan();
  elements.savePanel.classList.add("hidden");
  elements.sessionStatus.textContent = "plan saved";
}

function renderSavedPlan() {
  const saved = localStorage.getItem("urgeshift-plan");
  elements.savedPlanText.textContent = saved || "No plan saved yet.";
}

function clearPlan() {
  localStorage.removeItem("urgeshift-plan");
  renderSavedPlan();
}

function updateStateBoard() {
  elements.stateUrge.textContent = state.urge;
  elements.stateEnergy.textContent = state.energy;
  elements.stateBlocker.textContent = state.blocker;
  elements.stateMode.textContent = state.mode;
}

function handleEscape(action) {
  if (!state.active && action !== "stop") return;

  if (action === "done") {
    showCrumbs();
    askToSavePlan(state.helpedAction);
  }

  if (action === "too-hard") {
    state.blocker = "too hard";
    setAction(actions.downshift);
    showCrumbs(0);
  }

  if (action === "different") {
    state.blocker = "wrong vibe";
    setAction(actions.different);
    showCrumbs(0);
  }

  if (action === "person") {
    showBuddyBridge();
  }

  if (action === "anyway") {
    state.blocker = "still want it";
    showHarmReduction();
  }

  if (action === "stop") {
    stopSession();
  }

  updateStateBoard();
}

function stopSession() {
  window.clearInterval(state.timerId);
  state.active = false;
  state.mode = "stopped";
  elements.sessionStatus.textContent = "stopped";
  elements.actionMode.textContent = "Session stopped";
  elements.actionText.textContent = "No shame. You can leave now or start again.";
  elements.actionSubtext.textContent = "Stopping is user control, not failure.";
  hidePanels();
  updateStateBoard();
}

function handleSignal() {
  const text = elements.freeSignal.value.trim().toLowerCase();
  if (!text) return;

  if (!state.active) startSession();

  const crisisWords = ["kill myself", "suicide", "overdose", "can't stay safe", "hurt myself"];
  if (crisisWords.some((word) => text.includes(word))) {
    setAction(actions.crisis);
    elements.sessionStatus.textContent = "crisis gate";
    return;
  }

  if (text.includes("anyway") || text.includes("drink") || text.includes("do it")) {
    state.urge = text.includes("drink") ? "drink" : state.urge;
    state.blocker = "still want it";
    showHarmReduction();
  }

  elements.freeSignal.value = "";
  updateStateBoard();
}

$("#shiftNow").addEventListener("click", startSession);

$("#escapeHatches").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  handleEscape(button.dataset.action);
});

$("#copyBuddy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(elements.buddyDraft.value);
    $("#copyBuddy").textContent = "Copied";
  } catch {
    $("#copyBuddy").textContent = "Select text";
  }
});

$("#closeBuddy").addEventListener("click", () => {
  elements.buddyPanel.classList.add("hidden");
  showCrumbs(state.crumbStep);
});

$("#savePlan").addEventListener("click", savePlan);
$("#skipSave").addEventListener("click", () => elements.savePanel.classList.add("hidden"));
$("#sendSignal").addEventListener("click", handleSignal);
$("#freeSignal").addEventListener("keydown", (event) => {
  if (event.key === "Enter") handleSignal();
});
$("#clearPlan").addEventListener("click", clearPlan);

renderSavedPlan();
updateStateBoard();
