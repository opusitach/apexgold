import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "ApexGold: Admin",
  robots: { index: false, follow: false },
};

// Separate root layout for the admin panel: it lives outside the localized
// `[lang]` tree, so it provides its own <html>/<body>.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
