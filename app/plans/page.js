"use client";

import { useEffect, useMemo, useState } from "react";
import AppTabBar from "../components/AppTabBar";
import { recordHardcoreEvent } from "../lib/hardcore";
import { cadenceLabels } from "../lib/urgeshift";

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [activeCadence, setActiveCadence] = useState("daily");

  useEffect(() => {
    setPlans(JSON.parse(window.sessionStorage.getItem("urgeshift-plans") || "[]"));
  }, []);

  const visiblePlans = useMemo(
    () => plans.filter((plan) => plan.cadence === activeCadence),
    [plans, activeCadence]
  );

  function updateCadence(id, cadence) {
    const nextPlans = plans.map((plan) => (plan.id === id ? { ...plan, cadence } : plan));
    setPlans(nextPlans);
    window.sessionStorage.setItem("urgeshift-plans", JSON.stringify(nextPlans));
  }

  function removePlan(id) {
    const nextPlans = plans.filter((plan) => plan.id !== id);
    setPlans(nextPlans);
    window.sessionStorage.setItem("urgeshift-plans", JSON.stringify(nextPlans));
  }

  function followPlan(plan) {
    recordHardcoreEvent("plan_followed", {
      planId: plan.id,
      cadence: plan.cadence,
      text: plan.text
    });
  }

  return (
    <main className="plans-page">
      <section className="plans-shell">
        <AppTabBar />

        <div className="plans-header">
          <div>
            <p className="eyebrow">Saved plans</p>
            <h1>แผนที่ช่วยได้</h1>
            <p>เก็บเฉพาะใน session นี้ ถ้าต้องใช้ต่อให้พิมพ์หรือเซฟ PDF</p>
          </div>
          <div className="plans-header-actions">
            <button type="button" onClick={() => window.print()}>พิมพ์ / Print</button>
          </div>
        </div>

        <div className="plan-tabs">
          {Object.entries(cadenceLabels).map(([cadence, label]) => (
            <button
              key={cadence}
              type="button"
              className={activeCadence === cadence ? "active" : ""}
              onClick={() => setActiveCadence(cadence)}
            >
              {label}
            </button>
          ))}
        </div>

        {visiblePlans.length ? (
          <div className="plan-list">
            {visiblePlans.map((plan) => (
              <article key={plan.id} className="plan-card">
                <p className="tiny-label">{cadenceLabels[plan.cadence] || plan.cadence}</p>
                <p>{plan.text}</p>
                <div className="plan-actions">
                  <button type="button" className="active" onClick={() => followPlan(plan)}>
                    ทำตามแผนแล้ว
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateCadence(
                        plan.id,
                        plan.cadence === "daily"
                          ? "everyOtherDay"
                          : plan.cadence === "everyOtherDay"
                            ? "weekly"
                            : "daily"
                      )
                    }
                  >
                    เปลี่ยนรอบ
                  </button>
                  <button type="button" onClick={() => removePlan(plan.id)}>ลบ</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-plan">
            <h2>ยังไม่มีแผนในรอบนี้</h2>
            <p>กด Shift แล้วบันทึกสิ่งที่ช่วยได้ แผนจะมาอยู่ที่นี่ตาม cadence ที่เลือกไว้</p>
          </div>
        )}
      </section>
    </main>
  );
}
