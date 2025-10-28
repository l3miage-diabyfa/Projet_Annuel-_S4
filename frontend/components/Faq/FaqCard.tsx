'use client';
import { useState } from 'react';
import { BiChevronRight } from 'react-icons/bi';

export default function FaqCard({
  question,
  children,
  defaultOpen = false,
}: {
  question: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = question.toLowerCase().replace(/\s+/g, '-');

  return (
    <article className="rounded-lg border border-[#F4F4F4]  bg-[#F4F4F4] p-6">
      <h3>
        <button
          className="group flex w-full items-center justify-between text-left"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-[16px] font-bold leading-none text-[#131316]">
            {question}
          </span>

          <BiChevronRight
            className={`size-5 shrink-0 transition-transform duration-200 ${
              open ? 'rotate-90' : ''
            }`}
            strokeWidth={2}
          />
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        className={`grid overflow-hidden transition-all duration-300 ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="min-h-0">
          <div className="pt-4 text-[16px] leading-[1.6] text-[#464646]">
            {children}
          </div>
        </div>
      </div>
    </article>
  );
}
