import { ReactNode } from "react";

type InfoRowProps = {
  title: string;
  description: string;
  meta?: ReactNode;
  leading?: ReactNode;
};

export default function InfoRow({
  title,
  description,
  meta,
  leading,
}: InfoRowProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          {leading ? (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-xl">
              {leading}
            </div>
          ) : null}

          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
          </div>
        </div>

        {meta ? (
          <div className="flex flex-wrap items-center gap-3">{meta}</div>
        ) : null}
      </div>
    </div>
  );
}
