"use client";

import { useEffect, useMemo, useState } from "react";
import BrandHeader from "./components/BrandHeader";
import ContextPanel from "./components/ContextPanel";
import IdleScreen from "./components/IdleScreen";
import PhoneShell from "./components/PhoneShell";
import SavedPlanPanel from "./components/SavedPlanPanel";
import SessionScreen from "./components/SessionScreen";
import StateBoard from "./components/StateBoard";
import { actions, buddyDraft, crumbSteps, normalize } from "./lib/urgeshift";

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
  const [copyText, setCopyText] = useState("Copy draft");
  const [currentContext, setCurrentContext] = useState({
    name: "Mint",
    place: "หน้าร้านสะดวกซื้อ กรุงเทพฯ",
    situation: "เลิกงานดึก เครียดมาก อยากดื่ม ไม่อยากอธิบาย"
  });

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
    setPlanPreview(
      `ถ้า ${currentContext.situation || "urge กลับมา"} ที่ ${currentContext.place || "จุดกระตุ้น"} ให้ ${actionText.toLowerCase()} แล้วรอ 10 นาที.`
    );
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

    if (value.includes("Need person")) {
      showBuddyBridge();
      return;
    }

    if (value.includes("Still want it")) {
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

  function handleHarmMove(option) {
    setBlocker("harm reduction");
    askToSavePlan(option);
  }

  function savePlan() {
    const plans = JSON.parse(window.localStorage.getItem("urgeshift-plans") || "[]");
    const nextPlans = [
      {
        id: Date.now(),
        text: planPreview,
        cadence: "daily",
        createdAt: new Date().toISOString()
      },
      ...plans
    ];
    window.localStorage.setItem("urgeshift-plans", JSON.stringify(nextPlans));
    window.localStorage.setItem("urgeshift-plan", planPreview);
    setSavedPlan(planPreview);
    setSaveVisible(false);
    setSessionStatus("plan saved");
  }

  function clearPlan() {
    window.localStorage.removeItem("urgeshift-plan");
    window.localStorage.removeItem("urgeshift-plans");
    setSavedPlan("No plan saved yet.");
  }

  function updateContext(field, value) {
    setCurrentContext((context) => ({
      ...context,
      [field]: value
    }));
  }

  async function copyBuddy() {
    try {
      await navigator.clipboard.writeText(buddyDraft);
      setCopyText("Copied");
    } catch {
      setCopyText("Select text");
    }
  }

  function closeBuddy() {
    setBuddyVisible(false);
    showCrumbs(crumbStep ?? 0);
  }

  return (
    <main className="stage" data-state={active ? "active" : "idle"}>
      <section className="left-pane" aria-label="UrgeShift session">
        <BrandHeader />
        <PhoneShell status={sessionStatus} active={active}>
          {!active ? (
            <IdleScreen onStart={startSession} />
          ) : (
            <SessionScreen
              currentAction={currentAction}
              currentCrumb={currentCrumb}
              mode={mode}
              buddyVisible={buddyVisible}
              saveVisible={saveVisible}
              planPreview={planPreview}
              copyText={copyText}
              onEscape={handleEscape}
              onSelectCrumb={selectCrumb}
              onHarmMove={handleHarmMove}
              onCopyBuddy={copyBuddy}
              onCloseBuddy={closeBuddy}
              onSavePlan={savePlan}
              onSkipSave={() => setSaveVisible(false)}
            />
          )}
        </PhoneShell>
      </section>

      <aside className="right-pane" aria-label="Session context and state">
        <ContextPanel context={currentContext} onChange={updateContext} />
        <StateBoard urge={urge} energy={energy} blocker={blocker} mode={mode} />
        <SavedPlanPanel savedPlan={savedPlan} onClear={clearPlan} />
      </aside>
    </main>
  );
}
