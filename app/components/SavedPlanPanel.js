export default function SavedPlanPanel({ savedPlan, onClear }) {
  return (
    <section className="saved-plan">
      <p className="tiny-label">แผนใน session นี้ / Current session plan</p>
      <div>{savedPlan}</div>
      <button type="button" onClick={onClear}>ล้างแผน</button>
    </section>
  );
}
