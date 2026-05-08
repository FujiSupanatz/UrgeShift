import "./globals.css";

export const metadata = {
  title: "UrgeShift MVP",
  description: "One-tap urge interruption MVP."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
