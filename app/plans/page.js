import Link from "next/link";

export default function PlansPage() {
  return (
    <main className="plans-page">
      <section className="plans-shell">
        <div className="plans-header">
          <div>
            <p className="eyebrow">No stored plans</p>
            <h1>แผนไม่ถูกเก็บถาวร</h1>
            <p>UrgeShift รอบนี้ไม่ใช้ database, account, หรือ browser persistence สำหรับข้อมูลผู้ใช้</p>
          </div>
          <Link className="text-link" href="/">กลับไป Shift Now</Link>
        </div>

        <div className="empty-plan">
          <h2>ใช้แผนได้เฉพาะระหว่าง session ปัจจุบัน</h2>
          <p>ถ้า refresh หรือปิดหน้า แผนจะหายไปตาม privacy-first mode.</p>
        </div>
      </section>
    </main>
  );
}
