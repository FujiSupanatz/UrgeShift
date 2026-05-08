import { cadenceLabels } from "../lib/urgeshift";

export default function PlansList({
  plans,
  activeCadence,
  onCadenceChange,
  onUpdatePlanCadence,
  onRemovePlan
}) {
  const visiblePlans = plans.filter((plan) => plan.cadence === activeCadence);

  return (
    <>
      <div className="plan-tabs" role="tablist" aria-label="Plan cadence">
        {Object.entries(cadenceLabels).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={activeCadence === key ? "active" : ""}
            onClick={() => onCadenceChange(key)}
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
                    onClick={() => onUpdatePlanCadence(plan.id, key)}
                  >
                    {label}
                  </button>
                ))}
                <button type="button" onClick={() => onRemovePlan(plan.id)}>ลบ / Remove</button>
              </div>
            </article>
          ))
        )}
      </div>
    </>
  );
}
