import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dialogue & Letters",
  description: "Send a direct message or literary inquiry to Linda Emefa Daniels’ desk at House of Wild Ink.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
