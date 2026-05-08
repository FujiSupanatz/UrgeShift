import Link from "next/link";

export default function IdleScreen({ onStart }) {
  return (
    <section className="screen active">
      <div className="promise">
        <p className="tiny-label">เพื่อนที่คอยอยู่ข้างคุณเสมอ</p>
        <h2>ตอนใจเริ่มหลุด ไม่ต้องอธิบาย แค่ Shift.</h2>
      </div>
      <button className="shift-button" type="button" onClick={onStart}>
        <span>Shift Now</span>
        <small>เริ่มก้าวแรก</small>
      </button>
      <p className="privacy-note">
        ข้อมูลของผู้ใช้ จะหายไปหลังจากออกแอพโดยอัตโนมัติ
      </p>
      <Link className="text-link" href="/plans">ดูแผนที่บันทึกไว้ / Saved plans</Link>
    </section>
  );
}
