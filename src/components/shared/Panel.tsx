import { ReactNode } from "react";

type PanelProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export default function Panel({ title, children, className = "" }: PanelProps) {
  return (
    <div
      className={`rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)] ${className}`}
    >
      {title ? <h2 className="text-lg font-semibold text-white">{title}</h2> : null}
      {title ? <div className="mt-6">{children}</div> : children}
    </div>
  );
}
