export default function ContextPanel({ context, onChange }) {
  return (
    <section className="demo-brief">
      <p className="tiny-label">บริบทตอนนี้ / current state</p>
      <div className="context-fields">
        <label>
          <span>ชื่อ / Name</span>
          <input
            type="text"
            value={context.name}
            onChange={(event) => onChange("name", event.target.value)}
          />
        </label>
        <label>
          <span>ที่ไหน / Place</span>
          <input
            type="text"
            value={context.place}
            onChange={(event) => onChange("place", event.target.value)}
          />
        </label>
        <label>
          <span>ตอนนี้เกิดอะไรขึ้น / Situation</span>
          <textarea
            value={context.situation}
            onChange={(event) => onChange("situation", event.target.value)}
          />
        </label>
      </div>
    </section>
  );
}
