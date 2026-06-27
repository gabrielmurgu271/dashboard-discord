import Panel from "@/components/shared/Panel";

type StatCardProps = {
  label: string;
  value: string;
  icon: string;
};

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <Panel className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-400">{label}</p>
          <p className="mt-5 text-4xl font-bold tracking-tight text-white">
            {value}
          </p>
        </div>

        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-800/80 text-lg shadow-inner">
          {icon}
        </span>
      </div>
    </Panel>
  );
}
