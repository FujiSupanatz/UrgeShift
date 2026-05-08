import Link from "next/link";

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

  return (
    <main className="plans-page">
      <section className="plans-shell">
        <div className="plans-header">
          <div>
            <p className="eyebrow">Saved plans</p>
            <h1>แผนที่ช่วยได้</h1>
            <p>เก็บเฉพาะใน session นี้ ถ้าต้องใช้ต่อให้พิมพ์หรือเซฟ PDF</p>
          </div>
          <div className="plans-header-actions">
            <button type="button" onClick={() => window.print()}>พิมพ์ / Print</button>
            <Link className="text-link" href="/">กลับไป Shift Now</Link>
          </div>
        </div>

        <div className="empty-plan">
          <h2>ใช้แผนได้เฉพาะระหว่าง session ปัจจุบัน</h2>
          <p>ถ้า refresh หรือปิดหน้า แผนจะหายไปตาม privacy-first mode.</p>
        </div>
      </section>
    </main>
  );
}
