import StatCard from "@/components/dashboard/StatCard";
import { stats } from "@/data/dashboard";

export default function StatsCards() {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <StatCard
          key={item.label}
          label={item.label}
          value={item.value}
          icon={item.icon}
        />
      ))}
    </section>
  );
}
