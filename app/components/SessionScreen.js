import { harmReductionMoves } from "../lib/urgeshift";

export default function SessionScreen({
  currentAction,
  currentCrumb,
  mode,
  buddyVisible,
  buddyDraft,
  saveVisible,
  planPreview,
  copyText,
  onEscape,
  onSelectCrumb,
  onHarmMove,
  onCopyBuddy,
  onCloseBuddy,
  onSavePlan,
  onSkipSave
}) {
  return (
    <section className="screen active">
      <div className="timer-band">
        <div>
          <span className="tiny-label">ช่วงแรก / first pause</span>
          <strong>ผ่านไปทีละก้าว</strong>
          <p>ไม่ต้องตัดสินใจทั้งชีวิตตอนนี้</p>
        </div>
        <div className="pulse-ring" aria-hidden="true" />
      </div>

      <article className="action-card">
        <p className="tiny-label">{currentAction.mode}</p>
        <h2>{currentAction.text}</h2>
        <p>{currentAction.subtext}</p>
      </article>

      <div className="button-grid" aria-label="Action responses">
        <button type="button" onClick={() => onEscape("done")}>ทำแล้ว</button>
        <button type="button" data-intent="warm" onClick={() => onEscape("too-hard")}>ยากเกินไป</button>
        <button type="button" onClick={() => onEscape("different")}>เปลี่ยนวิธี</button>
        <button type="button" onClick={() => onEscape("person")}>ขอคนช่วย</button>
        <button type="button" data-intent="warm" onClick={() => onEscape("anyway")}>ยังจะทำอยู่</button>
        <button type="button" data-intent="quiet" onClick={() => onEscape("stop")}>หยุด</button>
      </div>

      {currentCrumb ? (
        <div className="crumb-panel">
          <p className="tiny-label">{currentCrumb.prompt}</p>
          <div className="chip-row">
            {currentCrumb.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onSelectCrumb(currentCrumb.key, option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {mode === "harm-reduction mode" ? (
        <div className="crumb-panel">
          <p className="tiny-label">เลือกหนึ่งอย่างที่ปลอดภัยขึ้น</p>
          <div className="chip-row">
            {harmReductionMoves.map((option) => (
              <button key={option} type="button" onClick={() => onHarmMove(option)}>
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {buddyVisible ? (
        <div className="buddy-panel">
          <p className="tiny-label">ขอคนช่วย / Buddy Bridge - draft only</p>
          <textarea value={buddyDraft} readOnly />
          <div className="panel-actions">
            <button type="button" onClick={onCopyBuddy}>
              {copyText === "Copy draft" ? "คัดลอกข้อความ" : copyText}
            </button>
            <button type="button" onClick={onCloseBuddy}>ไปต่อ</button>
          </div>
        </div>
      ) : null}

      {saveVisible ? (
        <div className="save-panel">
          <p className="tiny-label">แผนสำหรับรอบนี้</p>
          <h3>เก็บไว้ใช้ระหว่าง session นี้ไหม?</h3>
          <p>{planPreview}</p>
          <div className="panel-actions">
            <button type="button" onClick={onSavePlan}>บันทึกแผน</button>
            <button type="button" onClick={onSkipSave}>ยังไม่เอา</button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
