import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import MenuSection from "@/components/MenuSection";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Tapas, tacos, asados and more — the full food menu at En Llamas 87 in Franklin Square, NY.",
};

export default function MenuPage() {
  return (
    <>
      <PageHeader
        kicker="The Table"
        title="Menu"
        description="Every dish crosses the open flame — from tapas built for sharing to asados carved tableside. A full menu of Latin classics, made to be passed around."
      />
      <MenuSection />
    </>
  );
}
