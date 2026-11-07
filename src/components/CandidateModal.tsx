"use client";

import { useEffect } from "react";
import { ExternalLink, GraduationCap, MapPin, X } from "lucide-react";
import type { Candidate, JobId } from "@/types/resume";

interface CandidateModalProps {
  candidate: Candidate | null;
  jobId: JobId;
  onClose: () => void;
}

export default function CandidateModal({ candidate, jobId, onClose }: CandidateModalProps) {
  useEffect(() => {
    if (!candidate) return;
    const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [candidate, onClose]);

  if (!candidate) return null;
  const evaluation = candidate[jobId];
  const initials = candidate.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#14221b]/35 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside role="dialog" aria-modal="true" aria-labelledby="candidate-title" className="soft-scrollbar h-full w-full max-w-[560px] overflow-y-auto bg-[#fbfcfa] shadow-2xl animate-enter">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e8ece8] bg-[#fbfcfa]/95 px-6 py-4 backdrop-blur">
          <span className="text-xs font-semibold uppercase tracking-[.13em] text-[#7b867d]">Candidate profile</span>
          <button onClick={onClose} aria-label="Close candidate profile" className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="px-6 pb-10 pt-7 sm:px-8">
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#e6f0e8] text-lg font-semibold text-[#456b54]">{initials}</div>
            <div className="min-w-0 flex-1">
              <h2 id="candidate-title" className="text-2xl font-semibold tracking-[-.04em]">{candidate.name}</h2>
              <p className="mt-1 text-sm text-[#738078]">{candidate.email}</p>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-[#758078]"><MapPin size={13} />{candidate.location}</p>
            </div>
            <div className="rounded-2xl border border-[#e2e9e2] bg-white px-4 py-3 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#869087]">Match</p>
              <p className="mt-1 text-2xl font-semibold tracking-[-.05em] text-[#2e7158]">{evaluation.score}<span className="text-xs text-[#94a099]">/100</span></p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#e8ece8] bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#87918a]">Experience</p>
              <p className="mt-2 text-lg font-semibold">{candidate.experience_years} <span className="text-sm font-normal text-[#78827b]">years</span></p>
            </div>
            <div className="rounded-2xl border border-[#e8ece8] bg-white p-4">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[.12em] text-[#87918a]"><GraduationCap size={13} />Education</p>
              <p className="mt-2 text-sm font-medium leading-5">{candidate.education}</p>
            </div>
          </div>

          <section className="mt-7">
            <h3 className="text-sm font-semibold">Tools & skills</h3>
            <div className="mt-3 flex flex-wrap gap-2">{[...candidate.tools, ...candidate.skills].map((item) => <span key={item} className="rounded-lg border border-[#e7ebe7] bg-white px-2.5 py-1.5 text-xs font-medium text-[#59665e]">{item}</span>)}</div>
          </section>

          <section className="mt-7 rounded-2xl border border-[#dce9df] bg-[#f1f7f2] p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">Why this match</h3>
              <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-[#3b7554]">{jobId === "jd1_lca" ? "LCA Consultant" : "UI/UX Design Intern"}</span>
            </div>
            <ul className="mt-4 space-y-3">{evaluation.evidence.map((item) => <li key={item} className="flex gap-2.5 text-sm leading-5 text-[#43554a]"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#4e9167]" />{item}</li>)}</ul>
          </section>

          <section className="mt-4 rounded-2xl border border-[#eee7d9] bg-[#fbf8f1] p-5">
            <h3 className="text-sm font-semibold text-[#5b4b2c]">Gaps to review</h3>
            {evaluation.missing_criteria.length ? <ul className="mt-3 space-y-2.5">{evaluation.missing_criteria.map((item) => <li key={item} className="flex gap-2.5 text-sm leading-5 text-[#75674a]"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#bd9a52]" />{item}</li>)}</ul> : <p className="mt-2 text-sm text-[#75674a]">No key gaps surfaced for this role.</p>}
          </section>

          {candidate.source_file ? (
            <a href={`/resumes/${encodeURIComponent(candidate.source_file)}`} target="_blank" rel="noreferrer" className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#285b43] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#204c37]">
              <ExternalLink size={16} /> View source resume PDF
            </a>
          ) : (
            <p className="mt-6 rounded-xl border border-[#e8ece8] bg-white px-4 py-3 text-center text-xs leading-5 text-[#78827b]">The uploaded resume was analyzed in memory and is not stored by this prototype.</p>
          )}
          <p className="mt-2 text-center text-[10px] text-[#929b94]">Demo candidate records and preview documents are synthetic.</p>
        </div>
      </aside>
    </div>
  );
}
