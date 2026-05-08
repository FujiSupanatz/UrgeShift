"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const actions = {
  first: {
    mode: "เริ่มช่วยทันที / No-context first move",
    text: "ขยับออกไป 20 ก้าว",
    subtext: "Move 20 steps away. ยังไม่ต้องตัดสินใจอะไรตอนนี้"
  },
  downshift: {
    mode: "ลดให้เล็กลง / Too hard downshift",
    text: "หันออกจากทางเข้า จับโทรศัพท์สองมือ หายใจหนึ่งครั้ง",
    subtext: "This still counts. เล็กลงคือจุดประสงค์"
  },
  different: {
    mode: "เปลี่ยนวิธี / Different move",
    text: "วางอะไรสักอย่างคั่นระหว่างคุณกับสิ่งกระตุ้น",
    subtext: "A door, table, water bottle. เพิ่มแรงเสียดทานนิดเดียวพอ"
  },
  water: {
    mode: "แรงน้อยก็ทำได้ / Low-effort next move",
    text: "ซื้อน้ำก่อน ยังไม่ต้องสัญญาอะไร",
    subtext: "Delay by 10 minutes. แค่ก้าวถัดไป ไม่ใช่ทั้งชีวิต"
  },
  harm: {
    mode: "ลดอันตราย / Harm-reduction mode",
    text: "โอเค งั้นทำ 10 นาทีถัดไปให้ปลอดภัยขึ้นก่อน",
    subtext: "Pick one safer move. ไม่มีการสอน ไม่มีการดุ"
  },
  crisis: {
    mode: "ขอคนช่วย / Crisis gate",
    text: "เรื่องนี้ควรมีคนจริงอยู่ด้วย ไม่ใช่คุยกับแอปต่อ",
    subtext: "If you may not stay safe, contact emergency support or someone nearby now."
  },
  stopped: {
    mode: "หยุดเซสชัน / Session stopped",
    text: "ไม่ต้องรู้สึกผิด จะออกตอนนี้หรือเริ่มใหม่ก็ได้",
    subtext: "Stopping is user control, not failure."
  }
};

const crumbSteps = [
  {
    key: "urge",
    prompt: "urge แบบไหน / What kind?",
    options: ["ดื่ม / Drink", "สูบ / Vape", "ไถฟีด / Scroll", "พนัน / Gamble", "อื่นๆ / Other"]
  },
  {
    key: "energy",
    prompt: "แรงตอนนี้ / Energy?",
    options: ["ไม่คุย / No talking", "ทำเล็กๆ / Tiny action", "คุยได้ / Can talk"]
  },
  {
    key: "blocker",
    prompt: "ติดตรงไหน / What blocked you?",
    options: ["ยากเกินไป / Too hard", "ไม่ใช่ / Wrong vibe", "ยังอยากทำ / Still want it", "ขอคนช่วย / Need person"]
  }
];

const harmReductionMoves = ["กินก่อน / Eat first", "ซื้อน้ำด้วย / Buy water too", "ขยับออกไป / Move away", "ตั้งจุดหยุด / Set endpoint", "ทักใครสักคน / Message someone"];

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
  const [copyText, setCopyText] = useState("Copy draft");
  const [currentContext, setCurrentContext] = useState({
    name: "Mint",
    place: "หน้าร้านสะดวกซื้อ กรุงเทพฯ",
    situation: "เลิกงานดึก เครียดมาก อยากดื่ม ไม่อยากอธิบาย"
  });

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
    setSessionStatus("plan saved");
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
            <h1>ก่อนจะทำ ลอง...</h1>
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
            <section className="screen active">
              <div className="timer-band">
                <div>
                  <span className="tiny-label">ช่วงแรก / first pause</span>
                  <strong>ผ่านไปทีละก้าว</strong>
                  <p>ไม่ต้องตัดสินใจทั้งชีวิตตอนนี้</p>
                </div>
                <div className="pulse-ring" aria-hidden="true" />
              </div>

              <article className="action-card">
                <p className="tiny-label">{currentAction.mode}</p>
                <h2>{currentAction.text}</h2>
                <p>{currentAction.subtext}</p>
              </article>

              <div className="button-grid" aria-label="Action responses">
                <button type="button" onClick={() => handleEscape("done")}>ทำแล้ว</button>
                <button type="button" data-intent="warm" onClick={() => handleEscape("too-hard")}>ยากเกินไป</button>
                <button type="button" onClick={() => handleEscape("different")}>เปลี่ยนวิธี</button>
                <button type="button" onClick={() => handleEscape("person")}>ขอคนช่วย</button>
                <button type="button" data-intent="warm" onClick={() => handleEscape("anyway")}>ยังจะทำอยู่</button>
                <button type="button" data-intent="quiet" onClick={() => handleEscape("stop")}>หยุด</button>
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
                  <p className="tiny-label">เลือกหนึ่งอย่างที่ปลอดภัยขึ้น</p>
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
                  <p className="tiny-label">ขอคนช่วย / Buddy Bridge - draft only</p>
                  <textarea value={buddyDraft} readOnly />
                  <div className="panel-actions">
                    <button type="button" onClick={copyBuddy}>{copyText === "Copy draft" ? "คัดลอกข้อความ" : copyText}</button>
                    <button type="button" onClick={() => {
                      setBuddyVisible(false);
                      showCrumbs(crumbStep ?? 0);
                    }}>
                      ไปต่อ
                    </button>
                  </div>
                </div>
              ) : null}

              {saveVisible ? (
                <div className="save-panel">
                  <p className="tiny-label">บันทึกสิ่งที่ช่วยได้</p>
                  <h3>บันทึกเป็นแผน 10 นาทีไหม?</h3>
                  <p>{planPreview}</p>
                  <div className="panel-actions">
                    <button type="button" onClick={savePlan}>บันทึกแผน</button>
                    <button type="button" onClick={() => setSaveVisible(false)}>ยังไม่เอา</button>
                  </div>
                </div>
              ) : null}
            </section>
          )}
        </div>
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
