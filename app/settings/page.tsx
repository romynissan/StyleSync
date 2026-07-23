import { SettingsPageClient } from "@/components/pages/settings-page-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StyleSync | Settings",
};

export default function SettingsPage() {
  return <SettingsPageClient />;
}
