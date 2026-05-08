import Link from "next/link";

export default function SavedPlanPanel({ savedPlan, onClear }) {
  return (
    <section className="saved-plan">
      <p className="tiny-label">แผนที่บันทึก / Saved plan</p>
      <div>{savedPlan}</div>
      <Link className="text-link" href="/plans">เปิดแผนทั้งหมด / Open plans</Link>
      <button type="button" onClick={onClear}>ล้างแผน</button>
    </section>
  );
}
