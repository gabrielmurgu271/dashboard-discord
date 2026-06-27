"use client";

import { useState } from "react";
import DashboardContent from "@/components/dashboard/DashboardContent";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import Sidebar from "@/components/layout/Sidebar";
import { sectionLabels } from "@/data/navigation";
import type { Section } from "@/types/dashboard";

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>("dashboard");

  return (
    <main className="h-screen overflow-hidden bg-zinc-950 text-white">
      <div className="flex h-full">
        <Sidebar
          activeItem={activeSection}
          onItemChange={setActiveSection}
        />

        <section className="flex flex-1 flex-col overflow-hidden">
          <Header
            sectionLabel={sectionLabels[activeSection]}
            activeSection={activeSection}
          />

          <div className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6">
            <DashboardContent activeSection={activeSection} />
          </div>
        </section>
      </div>

      <MobileNav
        activeItem={activeSection}
        onItemChange={setActiveSection}
      />
    </main>
  );
}