export default function StateBoard({ urge, energy, blocker, mode }) {
  return (
    <section className="state-board">
      <p className="tiny-label">สรุปบริบท / Context Crumbs</p>
      <dl>
        <div><dt>urge</dt><dd>{urge}</dd></div>
        <div><dt>แรง</dt><dd>{energy}</dd></div>
        <div><dt>ติดขัด</dt><dd>{blocker}</dd></div>
        <div><dt>โหมด</dt><dd>{mode}</dd></div>
      </dl>
    </section>
  );
}
