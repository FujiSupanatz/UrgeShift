"use client";

import { useEffect, useMemo, useState } from "react";

const actions = {
  first: {
    mode: "No-context first move",
    text: "Move 20 steps away from where you are.",
    subtext: "No need to decide anything yet."
  },
  downshift: {
    mode: "Too hard downshift",
    text: "Turn away from the entrance. Hold your phone with both hands. Breathe once.",
    subtext: "This still counts. Smaller is the point."
  },
  different: {
    mode: "Different move",
    text: "Put one object between you and the cue.",
    subtext: "A door, a table, a bottle of water, anything that adds friction."
  },
  water: {
    mode: "Low-effort next move",
    text: "Buy water first. No promise. Delay the first drink by 10 minutes.",
    subtext: "You are not negotiating your whole life. Just the next move."
  },
  harm: {
    mode: "Harm-reduction mode",
    text: "Okay. Let's make the next 10 minutes safer first.",
    subtext: "Pick one damage-reducing move. No lecture."
  },
  crisis: {
    mode: "Crisis gate",
    text: "This needs a person, not a coaching loop.",
    subtext: "If you may not stay safe, contact emergency support or someone nearby now."
  },
  stopped: {
    mode: "Session stopped",
    text: "No shame. You can leave now or start again.",
    subtext: "Stopping is user control, not failure."
  }
};

const crumbSteps = [
  {
    key: "urge",
    prompt: "What kind of urge?",
    options: ["Drink", "Vape", "Scroll", "Gamble", "Other"]
  },
  {
    key: "energy",
    prompt: "Energy right now?",
    options: ["No talking", "Tiny action", "Can talk"]
  },
  {
    key: "blocker",
    prompt: "What blocked you?",
    options: ["Too hard", "Wrong vibe", "Still want it", "Need person"]
  }
];

const harmReductionMoves = ["Eat first", "Buy water too", "Move away", "Set endpoint", "Message someone"];

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function normalize(value) {
  return value.toLowerCase();
}

export default function Home() {
  const [active, setActive] = useState(false);
  const [seconds, setSeconds] = useState(90);
  const [sessionStatus, setSessionStatus] = useState("not started");
  const [currentAction, setCurrentAction] = useState(actions.first);
  const [urge, setUrge] = useState("unknown");
  const [energy, setEnergy] = useState("unknown");
  const [blocker, setBlocker] = useState("none");
  const [mode, setMode] = useState("waiting");
  const [crumbStep, setCrumbStep] = useState(null);
  const [buddyVisible, setBuddyVisible] = useState(false);
  const [saveVisible, setSaveVisible] = useState(false);
  const [planPreview, setPlanPreview] = useState("");
  const [savedPlan, setSavedPlan] = useState("No plan saved yet.");
  const [freeSignal, setFreeSignal] = useState("");
  const [copyText, setCopyText] = useState("Copy draft");

  const buddyDraft =
    "Hey, I'm trying to get through a craving for 10 minutes.\n" +
    "Can you stay with me by chat?\n" +
    "No need to fix anything.\n\n" +
    "เฮ้ เราขอให้ช่วยอยู่เป็นเพื่อน 10 นาทีได้ไหม\n" +
    "ตอนนี้กำลังพยายามผ่าน urge อยู่\n" +
    "ไม่ต้องแก้ปัญหา แค่อยู่ด้วยก็พอ";

  const currentCrumb = useMemo(() => {
    if (crumbStep === null) return null;
    return crumbSteps[crumbStep] ?? null;
  }, [crumbStep]);

  useEffect(() => {
    const stored = window.localStorage.getItem("urgeshift-plan");
    if (stored) setSavedPlan(stored);
  }, []);

  useEffect(() => {
    if (!active || seconds === 0) return undefined;
    const timer = window.setInterval(() => {
      setSeconds((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [active, seconds]);

  useEffect(() => {
    if (active && seconds === 0) setSessionStatus("pause complete");
  }, [active, seconds]);

  function applyAction(action) {
    setCurrentAction(action);
    setMode(action.mode.toLowerCase());
  }

  function hidePanels() {
    setCrumbStep(null);
    setBuddyVisible(false);
    setSaveVisible(false);
  }

  function startSession() {
    setActive(true);
    setSeconds(90);
    setSessionStatus("active");
    setUrge("unknown");
    setEnergy("unknown");
    setBlocker("none");
    setMode("first move");
    hidePanels();
    applyAction(actions.first);
  }

  function askToSavePlan(actionText = currentAction.text) {
    setPlanPreview(`IF stress + night + cue nearby, THEN ${actionText.toLowerCase()} + wait 10 minutes.`);
    setSaveVisible(true);
  }

  function showCrumbs(step = 0) {
    setCrumbStep(step < crumbSteps.length ? step : null);
    if (step >= crumbSteps.length) applyAction(actions.water);
  }

  function showBuddyBridge() {
    setBuddyVisible(true);
    setMode("buddy bridge");
  }

  function showHarmReduction() {
    applyAction(actions.harm);
    setCrumbStep(null);
    setMode("harm-reduction mode");
  }

  function selectCrumb(key, value) {
    const nextValue = normalize(value);
    if (key === "urge") setUrge(nextValue);
    if (key === "energy") setEnergy(nextValue);
    if (key === "blocker") setBlocker(nextValue);

    if (value === "Need person") {
      showBuddyBridge();
      return;
    }

    if (value === "Still want it") {
      setBlocker("still want it");
      showHarmReduction();
      return;
    }

    const nextStep = (crumbStep ?? 0) + 1;
    showCrumbs(nextStep);
  }

  function handleEscape(action) {
    if (!active && action !== "stop") return;

    if (action === "done") {
      showCrumbs(0);
      askToSavePlan(currentAction.text);
    }

    if (action === "too-hard") {
      setBlocker("too hard");
      applyAction(actions.downshift);
      showCrumbs(0);
    }

    if (action === "different") {
      setBlocker("wrong vibe");
      applyAction(actions.different);
      showCrumbs(0);
    }

    if (action === "person") showBuddyBridge();

    if (action === "anyway") {
      setBlocker("still want it");
      showHarmReduction();
    }

    if (action === "stop") {
      setActive(false);
      setSessionStatus("stopped");
      applyAction(actions.stopped);
      hidePanels();
    }
  }

  function handleSignal() {
    const text = freeSignal.trim().toLowerCase();
    if (!text) return;
    if (!active) startSession();

    const crisisWords = ["kill myself", "suicide", "overdose", "can't stay safe", "hurt myself"];
    if (crisisWords.some((word) => text.includes(word))) {
      applyAction(actions.crisis);
      setSessionStatus("crisis gate");
      setFreeSignal("");
      return;
    }

    if (text.includes("anyway") || text.includes("drink") || text.includes("do it")) {
      if (text.includes("drink")) setUrge("drink");
      setBlocker("still want it");
      showHarmReduction();
    }

    setFreeSignal("");
  }

  function savePlan() {
    window.localStorage.setItem("urgeshift-plan", planPreview);
    setSavedPlan(planPreview);
    setSaveVisible(false);
    setSessionStatus("plan saved");
  }

  function clearPlan() {
    window.localStorage.removeItem("urgeshift-plan");
    setSavedPlan("No plan saved yet.");
  }

  async function copyBuddy() {
    try {
      await navigator.clipboard.writeText(buddyDraft);
      setCopyText("Copied");
    } catch {
      setCopyText("Select text");
    }
  }

  return (
    <main className="stage" data-state={active ? "active" : "idle"}>
      <section className="left-pane" aria-label="UrgeShift session">
        <div className="brand-row">
          <div className="mark" aria-hidden="true">
            <span />
          </div>
          <div>
            <p className="eyebrow">UrgeShift</p>
            <h1>One tap between urge and regret.</h1>
          </div>
        </div>

        <div className="phone-shell" aria-live="polite">
          <div className="status-bar">
            <span>Private session</span>
            <span>{sessionStatus}</span>
          </div>

          {!active ? (
            <section className="screen active">
              <div className="promise">
                <p className="tiny-label">No login. No typing. No confession.</p>
                <h2>When willpower goes offline, do not explain. Shift.</h2>
              </div>
              <button className="shift-button" type="button" onClick={startSession}>
                <span>Shift Now</span>
                <small>start first move</small>
              </button>
              <p className="privacy-note">
                Demo stores only saved plans in this browser. Raw urge text is not saved.
              </p>
            </section>
          ) : (
            <section className="screen active">
              <div className="timer-band">
                <div>
                  <span className="tiny-label">First 90 seconds</span>
                  <strong>{formatTime(seconds)}</strong>
                </div>
                <div className="pulse-ring" aria-hidden="true" />
              </div>

              <article className="action-card">
                <p className="tiny-label">{currentAction.mode}</p>
                <h2>{currentAction.text}</h2>
                <p>{currentAction.subtext}</p>
              </article>

              <div className="button-grid" aria-label="Action responses">
                <button type="button" onClick={() => handleEscape("done")}>Done</button>
                <button type="button" data-intent="warm" onClick={() => handleEscape("too-hard")}>Too hard</button>
                <button type="button" onClick={() => handleEscape("different")}>Different</button>
                <button type="button" onClick={() => handleEscape("person")}>I need a person</button>
                <button type="button" data-intent="warm" onClick={() => handleEscape("anyway")}>I&apos;ll do it anyway</button>
                <button type="button" data-intent="quiet" onClick={() => handleEscape("stop")}>Stop</button>
              </div>

              {currentCrumb ? (
                <div className="crumb-panel">
                  <p className="tiny-label">{currentCrumb.prompt}</p>
                  <div className="chip-row">
                    {currentCrumb.options.map((option) => (
                      <button key={option} type="button" onClick={() => selectCrumb(currentCrumb.key, option)}>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {mode === "harm-reduction mode" ? (
                <div className="crumb-panel">
                  <p className="tiny-label">Pick one safer move</p>
                  <div className="chip-row">
                    {harmReductionMoves.map((option) => (
                      <button key={option} type="button" onClick={() => {
                        setBlocker("harm reduction");
                        askToSavePlan(option);
                      }}>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {buddyVisible ? (
                <div className="buddy-panel">
                  <p className="tiny-label">Buddy Bridge - draft only</p>
                  <textarea value={buddyDraft} readOnly />
                  <div className="panel-actions">
                    <button type="button" onClick={copyBuddy}>{copyText}</button>
                    <button type="button" onClick={() => {
                      setBuddyVisible(false);
                      showCrumbs(crumbStep ?? 0);
                    }}>
                      Keep shifting
                    </button>
                  </div>
                </div>
              ) : null}

              {saveVisible ? (
                <div className="save-panel">
                  <p className="tiny-label">Save what helped</p>
                  <h3>Save this as your 10-minute plan?</h3>
                  <p>{planPreview}</p>
                  <div className="panel-actions">
                    <button type="button" onClick={savePlan}>Save plan</button>
                    <button type="button" onClick={() => setSaveVisible(false)}>Not now</button>
                  </div>
                </div>
              ) : null}
            </section>
          )}
        </div>
      </section>

      <aside className="right-pane" aria-label="Demo controls and state">
        <section className="demo-brief">
          <p className="tiny-label">Demo persona</p>
          <h2>Mint, 27, Bangkok. 10:45 PM. Near convenience store.</h2>
          <p>Stressful workday. Craving 8/10. Low energy. Does not want to explain.</p>
        </section>

        <section className="state-board">
          <p className="tiny-label">Context Crumbs</p>
          <dl>
            <div><dt>Urge</dt><dd>{urge}</dd></div>
            <div><dt>Energy</dt><dd>{energy}</dd></div>
            <div><dt>Blocker</dt><dd>{blocker}</dd></div>
            <div><dt>Mode</dt><dd>{mode}</dd></div>
          </dl>
        </section>

        <section className="manual-signal">
          <p className="tiny-label">Optional typed signal</p>
          <label htmlFor="freeSignal">Use for crisis gate / low-readiness demo</label>
          <div className="signal-row">
            <input
              id="freeSignal"
              type="text"
              autoComplete="off"
              placeholder="e.g. I'm going to drink anyway"
              value={freeSignal}
              onChange={(event) => setFreeSignal(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSignal();
              }}
            />
            <button type="button" onClick={handleSignal}>Send</button>
          </div>
          <p id="signalHint">Try: &quot;I&apos;m going to drink anyway&quot; or crisis-like wording.</p>
        </section>

        <section className="saved-plan">
          <p className="tiny-label">Saved plan</p>
          <div>{savedPlan}</div>
          <button type="button" onClick={clearPlan}>Clear saved plan</button>
        </section>
      </aside>
    </main>
  );
}
