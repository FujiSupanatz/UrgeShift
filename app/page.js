"use client";

import { useEffect, useMemo, useState } from "react";
import BrandHeader from "./components/BrandHeader";
import ContextPanel from "./components/ContextPanel";
import IdleScreen from "./components/IdleScreen";
import PhoneShell from "./components/PhoneShell";
import SavedPlanPanel from "./components/SavedPlanPanel";
import SessionScreen from "./components/SessionScreen";
import StateBoard from "./components/StateBoard";
import { fetchBuddyDraft, recommendShift } from "./lib/shiftApi";
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
  const [savedPlan, setSavedPlan] = useState("No current session plan yet.");
  const [copyText, setCopyText] = useState("Copy draft");
  const [buddyDraftText, setBuddyDraftText] = useState(buddyDraft);
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
    const stored = window.sessionStorage.getItem("urgeshift-plan");
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

  async function showBuddyBridge() {
    setBuddyDraftText(await fetchBuddyDraft(buddyDraft));
    setBuddyVisible(true);
    setMode("buddy bridge");
  }

  async function showHarmReduction() {
    const result = await recommendShift(
      {
        event: "anyway",
        urge,
        energy,
        blocker,
        mode
      },
      actions.harm
    );
    applyAction(result.action || actions.harm);
    setCrumbStep(null);
    setMode("harm-reduction mode");
  }

  async function selectCrumb(key, value) {
    const nextValue = normalize(value);
    if (key === "urge") setUrge(nextValue);
    if (key === "energy") setEnergy(nextValue);
    if (key === "blocker") setBlocker(nextValue);

    if (value.includes("Need person")) {
      await showBuddyBridge();
      return;
    }

    if (value.includes("Still want it")) {
      setBlocker("still want it");
      await showHarmReduction();
      return;
    }

    const nextStep = (crumbStep ?? 0) + 1;
    showCrumbs(nextStep);
  }

  async function handleEscape(action) {
    if (!active && action !== "stop") return;

    if (action === "done") {
      showCrumbs(0);
      askToSavePlan(currentAction.text);
    }

    if (action === "too-hard") {
      setBlocker("too hard");
      const result = await recommendShift(
        { event: "too-hard", urge, energy, blocker: "too hard", mode },
        actions.downshift
      );
      applyAction(result.action || actions.downshift);
      showCrumbs(0);
    }

    if (action === "different") {
      setBlocker("wrong vibe");
      const result = await recommendShift(
        { event: "different", urge, energy, blocker: "wrong vibe", mode },
        actions.different
      );
      applyAction(result.action || actions.different);
      showCrumbs(0);
    }

    if (action === "person") await showBuddyBridge();

    if (action === "anyway") {
      setBlocker("still want it");
      await showHarmReduction();
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
    const plans = JSON.parse(window.sessionStorage.getItem("urgeshift-plans") || "[]");
    const nextPlans = [
      {
        id: Date.now(),
        text: planPreview,
        cadence: "daily",
        createdAt: new Date().toISOString()
      },
      ...plans
    ];
    window.sessionStorage.setItem("urgeshift-plans", JSON.stringify(nextPlans));
    window.sessionStorage.setItem("urgeshift-plan", planPreview);
    setSavedPlan(planPreview);
    setSaveVisible(false);
    setSessionStatus("session plan ready");
  }

  function clearPlan() {
    window.sessionStorage.removeItem("urgeshift-plan");
    window.sessionStorage.removeItem("urgeshift-plans");
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
      await navigator.clipboard.writeText(buddyDraftText);
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
            <section className="screen active">
              <div className="promise">
                <p className="tiny-label">เพื่อนที่คอยอยู่ข้างคุณเสมอ</p>
                <h2>ตอนใจเริ่มหลุด ไม่ต้องอธิบาย แค่ Shift.</h2>
              </div>
              <button className="shift-button" type="button" onClick={startSession}>
                <span>Shift Now</span>
                <small>เริ่มก้าวแรก</small>
              </button>
              <p className="privacy-note">
                ข้อมูลของผู้ใช้ จะหายไปหลังจากออกแอพโดยอัตโนมัติ
              </p>
              <div className="link-row">
                <Link className="text-link" href="/context">ทำ quiz สั้นๆ / Context quiz</Link>
                <Link className="text-link" href="/preview">ดูตัวเราที่ค่อยๆ กลับมา / Preview</Link>
                <Link className="text-link" href="/plans">ดูแผนที่บันทึกไว้ / Saved plans</Link>
              </div>
            </section>
          ) : (
            <SessionScreen
              currentAction={currentAction}
              currentCrumb={currentCrumb}
              mode={mode}
              buddyVisible={buddyVisible}
              buddyDraft={buddyDraftText}
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
        <section className="demo-brief">
          <p className="tiny-label">บริบทตอนนี้ / current state</p>
          <div className="context-fields">
            <label>
              <span>ชื่อ / Name</span>
              <input
                type="text"
                value={currentContext.name}
                onChange={(event) => updateContext("name", event.target.value)}
              />
            </label>
            <label>
              <span>ที่ไหน / Place</span>
              <input
                type="text"
                value={currentContext.place}
                onChange={(event) => updateContext("place", event.target.value)}
              />
            </label>
            <label>
              <span>ตอนนี้เกิดอะไรขึ้น / Situation</span>
              <textarea
                value={currentContext.situation}
                onChange={(event) => updateContext("situation", event.target.value)}
              />
            </label>
          </div>
        </section>

        <section className="state-board">
          <p className="tiny-label">สรุปบริบท / Context Crumbs</p>
          <dl>
            <div><dt>urge</dt><dd>{urge}</dd></div>
            <div><dt>แรง</dt><dd>{energy}</dd></div>
            <div><dt>ติดขัด</dt><dd>{blocker}</dd></div>
            <div><dt>โหมด</dt><dd>{mode}</dd></div>
          </dl>
        </section>

        <section className="saved-plan">
          <p className="tiny-label">แผนที่บันทึก / Saved plan</p>
          <div>{savedPlan}</div>
          <Link className="text-link" href="/context">อัปเดตพื้นหลัง / Context quiz</Link>
          <Link className="text-link" href="/preview">ดู Better Self Preview</Link>
          <Link className="text-link" href="/plans">เปิดแผนทั้งหมด / Open plans</Link>
          <button type="button" onClick={clearPlan}>ล้างแผน</button>
        </section>
      </aside>
    </main>
  );
}
