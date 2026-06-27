import { mobileNavItems } from "@/data/navigation";
import type { Section } from "@/types/dashboard";

type MobileNavProps = {
  activeItem: Section;
  onItemChange: (item: Section) => void;
};

export default function MobileNav({
  activeItem,
  onItemChange,
}: MobileNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-800 bg-zinc-950/95 px-2 py-2 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between gap-1">
        {mobileNavItems.map((item) => {
          const isActive = item.id === activeItem;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onItemChange(item.id)}
              className={
                isActive
                  ? "flex min-w-0 flex-1 flex-col items-center rounded-xl bg-white/10 px-2 py-2 text-white"
                  : "flex min-w-0 flex-1 flex-col items-center rounded-xl px-2 py-2 text-zinc-400"
              }
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="mt-1 truncate text-[11px] leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
