"use client";

import { useEffect } from "react";
import { CheckCircle2, Database, FileCheck2, Gauge, ShieldCheck, X } from "lucide-react";

interface MethodologyModalProps { open: boolean; onClose: () => void; }

const stages = [
  { icon: FileCheck2, title: "1. Ingest & extract", text: "PDF uploads are size- and signature-checked before lightweight text extraction. Unreadable files are kept visible as parse-error records rather than silently discarded." },
  { icon: ShieldCheck, title: "2. Validate & normalize", text: "The API validates its structured response with a Zod schema, normalizes missing fields, bounds scores, and rejects malformed candidate data. A production integration can add a document parser and a human review queue." },
  { icon: Database, title: "3. Map job criteria", text: "Candidate evidence is compared against a versioned role rubric: experience, domain projects, software, standards or design methods, education, and work-location fit." },
  { icon: Gauge, title: "4. Score & explain", text: "A deterministic, weighted heuristic creates a 0–100 score, positive evidence, and explicit criteria gaps for each role. Reviewers can inspect the original source alongside the explanation." },
];

export default function MethodologyModal({ open, onClose }: MethodologyModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-[#14221b]/40 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="methodology-title" className="my-auto w-full max-w-[680px] rounded-3xl border border-white/60 bg-[#fbfcfa] p-6 shadow-2xl sm:p-8 animate-enter">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#548063]">Under the hood</p><h2 id="methodology-title" className="mt-2 text-2xl font-semibold tracking-[-.04em]">How matching works</h2><p className="mt-2 max-w-xl text-sm leading-6 text-[#768078]">A transparent screening assistant that helps teams focus their review—not an automated hiring decision.</p></div>
          <button onClick={onClose} aria-label="Close methodology" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-500 hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {stages.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-[#e8ece8] bg-white p-4"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#edf5ef] text-[#47775b]"><Icon size={17} /></div><h3 className="mt-3 text-sm font-semibold">{title}</h3><p className="mt-1.5 text-xs leading-5 text-[#77827a]">{text}</p></article>)}
        </div>
        <div className="mt-4 rounded-2xl bg-[#f1f6f1] p-4">
          <p className="flex items-center gap-2 text-xs font-semibold text-[#42684d]"><CheckCircle2 size={15} /> Scoring is deterministic and explainable</p>
          <p className="mt-2 text-xs leading-5 text-[#68766c]">The prototype scores relevant experience, tools, projects, standards, education, and role fit, then displays supporting evidence and missing requirements. The included candidate pool is synthetic; verify all information with candidates before making decisions.</p>
        </div>
        <button onClick={onClose} className="mt-6 w-full rounded-xl bg-[#285b43] px-4 py-3 text-sm font-semibold text-white hover:bg-[#204c37]">Got it</button>
      </section>
    </div>
  );
}
