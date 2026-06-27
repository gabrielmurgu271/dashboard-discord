import ActivityPanel from "@/components/dashboard/ActivityPanel";
import StatsCards from "@/components/dashboard/StatsCards";
import SystemOverview from "@/components/dashboard/SystemOverview";

export default function HomeSection() {
  return (
    <>
      <StatsCards />
      <SystemOverview />
      <ActivityPanel />
    </>
  );
}
