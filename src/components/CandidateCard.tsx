"use client";

import { ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import type { Candidate, JobId } from "@/types/resume";

const classificationStyles: Record<Candidate["classification"], string> = {
  "LCA Role": "bg-emerald-50 text-emerald-800 ring-emerald-200",
  "UI/UX Internship": "bg-violet-50 text-violet-800 ring-violet-200",
  Both: "bg-sky-50 text-sky-800 ring-sky-200",
  "Neither/Uncertain": "bg-amber-50 text-amber-800 ring-amber-200",
};

interface CandidateCardProps {
  candidate: Candidate;
  jobId: JobId;
  rank: number;
  onInspect: (candidate: Candidate) => void;
}

export default function CandidateCard({ candidate, jobId, rank, onInspect }: CandidateCardProps) {
  const score = candidate[jobId].score;
  const initials = candidate.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  const scoreColor = score >= 80 ? "text-emerald-700" : score >= 55 ? "text-amber-700" : "text-slate-500";

  if (candidate.parse_error) {
    return (
      <article className="animate-enter rounded-2xl border border-rose-200 bg-rose-50/70 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-700">!</div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-rose-900">Couldn’t extract this resume</p>
            <p className="mt-1 break-words text-sm leading-5 text-rose-800">{candidate.error_message || "The file is unreadable or is missing required candidate details."}</p>
            <p className="mt-2 text-xs text-rose-700">File: {candidate.name}</p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onInspect(candidate)}
      className="animate-enter group w-full rounded-2xl border border-[#e8ece8] bg-white p-4 text-left shadow-[0_1px_2px_rgba(20,40,30,.03)] transition duration-200 hover:-translate-y-0.5 hover:border-[#cbd9cf] hover:shadow-[0_10px_28px_rgba(31,65,47,.08)] focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
      aria-label={`Inspect ${candidate.name}`}
    >
      <div className="flex items-start gap-3.5">
        <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[#edf3ee] text-sm font-semibold text-[#456b54]">
          {initials}
          <span className="absolute -bottom-1 -right-1 grid h-[18px] w-[18px] place-items-center rounded-full border-2 border-white bg-[#4d936d] text-[9px] font-bold text-white">{rank}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-semibold tracking-[-.02em] text-[#202b25]">{candidate.name}</h3>
              <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-[#818a84]"><MapPin size={12} />{candidate.location}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <span className={`text-[22px] font-semibold leading-none tracking-[-.05em] ${scoreColor}`}>{score}</span>
              <span className="mt-1 text-[10px] font-medium text-slate-400">/100</span>
              <ArrowUpRight size={15} className="ml-1 text-slate-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#397256]" />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${classificationStyles[candidate.classification]}`}>{candidate.classification}</span>
            <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-medium text-slate-600">{candidate.experience_years} yrs experience</span>
            {candidate.tools.slice(0, 2).map((tool) => <span key={tool} className="rounded-full bg-[#f3f5f2] px-2.5 py-1 text-[10px] font-medium text-[#68746c]">{tool}</span>)}
          </div>
          <p className="mt-3 line-clamp-1 text-xs text-[#747f77]">{candidate.jd1_lca.evidence[0] || candidate.jd2_uiux.evidence[0] || candidate.education}</p>
          <div className="mt-3 flex items-center gap-1.5 border-t border-[#f0f2ef] pt-3 text-[11px] font-medium text-[#47755a]">
            <Sparkles size={12} /> AI match summary <span className="ml-auto text-[#8b948e] group-hover:text-[#47755a]">Review profile</span>
          </div>
        </div>
      </div>
    </button>
  );
}
