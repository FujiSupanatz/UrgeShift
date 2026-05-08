"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PlansList from "../components/PlansList";

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [activeCadence, setActiveCadence] = useState("daily");

  useEffect(() => {
    setPlans(JSON.parse(window.localStorage.getItem("urgeshift-plans") || "[]"));
  }, []);

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

        <PlansList
          plans={plans}
          activeCadence={activeCadence}
          onCadenceChange={setActiveCadence}
          onUpdatePlanCadence={updateCadence}
          onRemovePlan={removePlan}
        />
      </section>
    </main>
  );
}
