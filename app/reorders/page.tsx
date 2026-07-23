import { ReordersPageClient } from "@/components/pages/reorders-page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StyleSync | Reorders",
};

export default function ReordersPage() {
  return <ReordersPageClient />;
}
