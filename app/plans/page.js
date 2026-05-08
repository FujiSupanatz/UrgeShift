"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const cadenceLabels = {
  daily: "วันนี้ / Daily",
  everyOtherDay: "วันเว้นวัน / Every other day",
  weekly: "รายสัปดาห์ / Weekly"
};

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [activeCadence, setActiveCadence] = useState("daily");

  useEffect(() => {
    setPlans(JSON.parse(window.localStorage.getItem("urgeshift-plans") || "[]"));
  }, []);

  const visiblePlans = useMemo(
    () => plans.filter((plan) => plan.cadence === activeCadence),
    [plans, activeCadence]
  );

  function updateCadence(id, cadence) {
    const nextPlans = plans.map((plan) => (plan.id === id ? { ...plan, cadence } : plan));
    setPlans(nextPlans);
    window.localStorage.setItem("urgeshift-plans", JSON.stringify(nextPlans));
  }

  function removePlan(id) {
    const nextPlans = plans.filter((plan) => plan.id !== id);
    setPlans(nextPlans);
    window.localStorage.setItem("urgeshift-plans", JSON.stringify(nextPlans));
  }

  return (
    <main className="plans-page">
      <section className="plans-shell">
        <div className="plans-header">
          <div>
            <p className="eyebrow">Saved plans</p>
            <h1>แผนที่ช่วยได้</h1>
            <p>เก็บเฉพาะสิ่งที่ช่วย ไม่เก็บคำสารภาพ</p>
          </div>
          <Link className="text-link" href="/">กลับไป Shift Now</Link>
        </div>

        <div className="plan-tabs" role="tablist" aria-label="Plan cadence">
          {Object.entries(cadenceLabels).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={activeCadence === key ? "active" : ""}
              onClick={() => setActiveCadence(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="plan-list">
          {visiblePlans.length === 0 ? (
            <div className="empty-plan">
              <h2>ยังไม่มีแผนในหมวดนี้</h2>
              <p>หลังจาก Shift Now ช่วยได้ ให้บันทึกเป็นแผน 10 นาที</p>
            </div>
          ) : (
            visiblePlans.map((plan) => (
              <article className="plan-card" key={plan.id}>
                <p>{plan.text}</p>
                <div className="plan-actions">
                  {Object.entries(cadenceLabels).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      className={plan.cadence === key ? "active" : ""}
                      onClick={() => updateCadence(plan.id, key)}
                    >
                      {label}
                    </button>
                  ))}
            <button type="button" onClick={() => removePlan(plan.id)}>ลบ / Remove</button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
