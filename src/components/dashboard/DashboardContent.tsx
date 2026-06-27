import ActivitySection from "@/components/dashboard/ActivitySection";
import BotsSection from "@/components/dashboard/BotsSection";
import HomeSection from "@/components/dashboard/HomeSection";
import ServersSection from "@/components/dashboard/ServersSection";
import SettingsSection from "@/components/dashboard/SettingsSection";
import type { Section } from "@/types/dashboard";

type DashboardContentProps = {
  activeSection: Section;
};

function SectionWrapper({
  children,
  sectionKey,
}: {
  children: React.ReactNode;
  sectionKey: string;
}) {
  return (
    <div key={sectionKey} className="section-animate">
      {children}
    </div>
  );
}

export default function DashboardContent({
  activeSection,
}: DashboardContentProps) {
  if (activeSection === "dashboard") {
    return (
      <SectionWrapper sectionKey="dashboard">
        <HomeSection />
      </SectionWrapper>
    );
  }

  if (activeSection === "bots") {
    return (
      <SectionWrapper sectionKey="bots">
        <BotsSection />
      </SectionWrapper>
    );
  }

  if (activeSection === "activite") {
    return (
      <SectionWrapper sectionKey="activite">
        <ActivitySection />
      </SectionWrapper>
    );
  }

  if (activeSection === "serveurs") {
    return (
      <SectionWrapper sectionKey="serveurs">
        <ServersSection />
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper sectionKey="parametres">
      <SettingsSection />
    </SectionWrapper>
  );
}