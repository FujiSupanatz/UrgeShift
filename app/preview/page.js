"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const profiles = {
  spark: {
    title: "ธูติประกายไฟ",
    tone: "คิดทีหลัง ขยับก่อน",
    encourage: "ไม่ต้องชนะทั้งคืน แค่ขยับออกจากจุดเดิมก่อน",
    color: "ember"
  },
  mist: {
    title: "ธูติหมอกนุ่ม",
    tone: "อย่าเร่งฉัน เดี๋ยวฉันกลับมาเอง",
    encourage: "ลดเสียงทุกอย่างลงก่อน ใจไม่ต้องรีบเก่ง",
    color: "mist"
  },
  sprout: {
    title: "ธูติต้นกล้า",
    tone: "ร่างกายนิ่ง ใจค่อยตาม",
    encourage: "จับร่างกายไว้กับพื้น น้ำ ลมหายใจ และก้าวเล็กๆ",
    color: "sprout"
  },
  water: {
    title: "ธูติน้ำใจ",
    tone: "ตั้งชื่อมันก่อน มันจะเล็กลง",
    encourage: "นี่คือ urge ไม่ใช่ตัวคุณทั้งหมด เรียกชื่อมัน แล้วค่อยขยับ",
    color: "water"
  },
  wind: {
    title: "ธูติลมเย็น",
    tone: "ถ้าเกินหนึ่งปุ่ม ฉันหาย",
    encourage: "ใช้ทางสั้นสุด ปุ่มเดียว ก้าวเดียว พอสำหรับตอนนี้",
    color: "wind"
  },
  light: {
    title: "ธูติแสงดาว",
    tone: "ไม่ต้องแก้ แค่อยู่ด้วย",
    encourage: "ขอคนอยู่ด้วยได้ ไม่ต้องอธิบายเก่ง แค่ไม่อยู่คนเดียว",
    color: "light"
  }
};

const stages = [
  {
    id: "now",
    label: "ตอนนี้",
    action: "หยุดเพิ่มแรงกด",
    line: "ธูติยืนข้างๆ ก่อน ยังไม่ต้องพิสูจน์อะไร"
  },
  {
    id: "10mins",
    label: "10 นาที",
    action: "ทำหนึ่งก้าวที่ปลอดภัยขึ้น",
    line: "ช่องว่างเล็กๆ เริ่มกลับมา คุณมีสิทธิ์เลือกอีกครั้ง"
  },
  {
    id: "today",
    label: "วันนี้",
    action: "บันทึกสิ่งที่ช่วยได้",
    line: "ไม่ต้องเก็บคำสารภาพ เก็บแค่วิธีที่พาคุณรอด"
  },
  {
    id: "7days",
    label: "7 วัน",
    action: "เห็นแพทเทิร์นเบาๆ",
    line: "คุณไม่ได้กลายเป็นคนใหม่ แค่มีธูติที่รู้ทางกลับมากขึ้น"
  }
];

function getStoredSpirit() {
  try {
    const raw = window.sessionStorage.getItem("urgeshift-user-context");
    if (!raw) return "wind";
    const parsed = JSON.parse(raw);
    return parsed?.result?.id && profiles[parsed.result.id] ? parsed.result.id : "wind";
  } catch {
    return "wind";
  }
}

export default function PreviewPage() {
  const [spirit, setSpirit] = useState("wind");
  const [stage, setStage] = useState(1);
  const [imageMissing, setImageMissing] = useState(false);

  useEffect(() => {
    setSpirit(getStoredSpirit());
  }, []);

  const profile = profiles[spirit];
  const currentStage = stages[stage];
  const imagePath = `/spirits/${spirit}_${currentStage.id}.png`;

  const progress = useMemo(() => `${(stage / (stages.length - 1)) * 100}%`, [stage]);

  function changeStage(nextStage) {
    setStage(Number(nextStage));
    setImageMissing(false);
  }

  return (
    <main className="preview-page">
      <section className="preview-shell">
        <nav className="quiz-nav">
          <Link className="text-link" href="/">กลับ / Back</Link>
          <Link className="text-link" href="/context">เลือกธูติ / Quiz</Link>
        </nav>

        <section className="preview-hero">
          <p className="eyebrow">Better Self Preview</p>
          <h1>ตัวเราที่ค่อยๆ กลับมาคุมได้</h1>
          <p>{profile.encourage}</p>
        </section>

        <section className="twin-card">
          <div className={`spirit-frame ${profile.color}`}>
            {!imageMissing ? (
              <img src={imagePath} alt={`${profile.title} ${currentStage.label}`} onError={() => setImageMissing(true)} />
            ) : (
              <div className="spirit-fallback" aria-label={`${profile.title} fallback`}>
                <span />
              </div>
            )}
          </div>

          <div className="twin-copy">
            <p className="tiny-label">{profile.title}</p>
            <h2>{currentStage.label}</h2>
            <h3>{profile.tone}</h3>
            <p>{currentStage.line}</p>
            <strong>{currentStage.action}</strong>
          </div>
        </section>

        <section className="timebar-panel">
          <div className="timebar-labels">
            {stages.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={stage === index ? "active" : ""}
                onClick={() => changeStage(index)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="timebar-track">
            <div style={{ width: progress }} />
          </div>
          <input
            className="timebar-input"
            type="range"
            min="0"
            max={stages.length - 1}
            value={stage}
            onChange={(event) => changeStage(event.target.value)}
            aria-label="ปรับช่วงเวลา"
          />
        </section>
      </section>
    </main>
  );
}
