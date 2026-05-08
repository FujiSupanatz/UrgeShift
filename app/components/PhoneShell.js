export default function PhoneShell({ status, children }) {
  return (
    <div className="phone-shell" aria-live="polite">
      <div className="status-bar">
        <span>Private session</span>
        <span>{status}</span>
      </div>
      {children}
    </div>
  );
}
