"use client";

import { useMemo, useState } from "react";
import { Activity, ArrowDownWideNarrow, ArrowRight, BriefcaseBusiness, Check, ChevronDown, CircleHelp, Filter, LayoutGrid, Search, Sparkles, Users, X } from "lucide-react";
import candidateData from "@/data/resumes_data.json";
import CandidateCard from "@/components/CandidateCard";
import CandidateModal from "@/components/CandidateModal";
import LiveUploadBox from "@/components/LiveUploadBox";
import MethodologyModal from "@/components/MethodologyModal";
import type { Candidate, FilterState, JobDescription, JobId } from "@/types/resume";

const jobs: Record<JobId, JobDescription> = {
  jd1_lca: {
    id: "jd1_lca", title: "LCA Consultant", team: "Sustainability", location: "Chennai · On-site",
    employment: "Full-time", accent: "green",
    description: "Help leading teams measure and reduce the environmental impact of products across their entire lifecycle.",
    requirements: ["2–3 years independent LCA experience", "GaBi or SimaPro expertise", "3+ completed LCA projects", "ISO 14040 & 14044", "Environmental / Engineering degree", "Open to Chennai relocation"],
  },
  jd2_uiux: {
    id: "jd2_uiux", title: "UI/UX Design Intern", team: "Growth For Impact", location: "Remote · India",
    employment: "Internship", accent: "violet",
    description: "Shape thoughtful, high-impact digital experiences for a new generation of mission-driven products.",
    requirements: ["0–1 year experience", "Figma & high-fidelity prototyping", "User psychology & human-centered design", "Strong visual craft", "Remote-work compatibility"],
  },
};
const classificationOptions = ["All classifications", "LCA Role", "UI/UX Internship", "Both", "Neither/Uncertain"] as const;

export default function DashboardPage() {
  const [jobId, setJobId] = useState<JobId>("jd1_lca");
  const [candidates, setCandidates] = useState<Candidate[]>(candidateData as Candidate[]);
  const [filters, setFilters] = useState<FilterState>({ search: "", classification: "All classifications", sort: "score" });
  const [inspected, setInspected] = useState<Candidate | null>(null);
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const activeJob = jobs[jobId];
  const healthyCandidates = candidates.filter((candidate) => !candidate.parse_error);
  const scores = healthyCandidates.map((candidate) => candidate[jobId].score);
  const average = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
  const qualified = healthyCandidates.filter((candidate) => candidate[jobId].score >= 70).length;

  const filteredCandidates = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return [...candidates]
      .filter((candidate) => filters.classification === "All classifications" || candidate.classification === filters.classification)
      .filter((candidate) => !query || [candidate.name, candidate.location, candidate.education, ...candidate.tools, ...candidate.skills].join(" ").toLowerCase().includes(query))
      .sort((a, b) => {
        if (a.parse_error) return 1;
        if (b.parse_error) return -1;
        return filters.sort === "score" ? b[jobId].score - a[jobId].score : b.experience_years - a.experience_years;
      });
  }, [candidates, filters, jobId]);

  function addCandidate(candidate: Candidate) {
    setCandidates((current) => [candidate, ...current.filter((item) => item.id !== candidate.id)]);
  }

  return (
    <main className="min-h-screen bg-[#f7f8f6]">
      <header className="sticky top-0 z-30 border-b border-[#e8ece8] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-4 sm:px-7 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#285b43] text-white"><Activity size={18} strokeWidth={2.2} /></div>
            <div><div className="text-[15px] font-semibold tracking-[-.035em]">impact<span className="text-[#4f8a63]">ats</span></div><div className="text-[9px] font-semibold uppercase tracking-[.14em] text-[#969e98]">Talent workspace</div></div>
          </div>
          <div className="hidden items-center gap-1 rounded-full border border-[#e7ece7] bg-[#f8faf8] p-1 md:flex">
            <span className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#445249] shadow-sm"><span className="h-1.5 w-1.5 rounded-full bg-[#5b9b70]" />Recruiting</span>
            <span className="px-3 py-1.5 text-xs text-[#89928b]">Analytics</span>
          </div>
          <button onClick={() => setMethodologyOpen(true)} className="flex items-center gap-2 rounded-xl border border-[#e5eae5] px-3 py-2 text-xs font-semibold text-[#536158] transition hover:bg-[#f7faf7]"><CircleHelp size={15} /> <span className="hidden sm:inline">How it works</span></button>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 pb-14 pt-7 sm:px-7 lg:px-10 lg:pt-10">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#77837a]"><span>Workspace</span><span className="text-[#c1c8c2]">/</span><span className="text-[#3e5646]">Open roles</span></div>
            <h1 className="mt-3 text-[30px] font-semibold tracking-[-.055em] text-[#1d2922] sm:text-[36px]">Candidate overview</h1>
            <p className="mt-1 text-sm text-[#7d8780]">A clearer view of talent, evidence, and what comes next.</p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-xl border border-[#e5eae5] bg-white px-3 py-2 text-xs font-medium text-[#6e7971] shadow-sm md:self-auto"><span className="h-2 w-2 rounded-full bg-[#66a477]" /> Demo workspace <span className="text-[#ccd2cc]">·</span> Updated just now</div>
        </div>

        <section className="mt-7 grid gap-3 sm:grid-cols-3">
          <StatCard icon={<Users size={16} />} label="Resumes in pool" value={`${candidates.length + 35}`} note={`${candidates.length} profiles in this prototype`} />
          <StatCard icon={<Sparkles size={16} />} label="Strong matches" value={`${qualified}`} note="70%+ match for selected role" accent />
          <StatCard icon={<BriefcaseBusiness size={16} />} label="Average match" value={`${average}%`} note={`Across ${healthyCandidates.length} reviewed profiles`} />
        </section>

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#849087]">Your open roles</p>
            <p className="mt-1 text-xs text-[#9aa29c]">Select a role to see its candidate ranking</p>
          </div>
          <div className="inline-flex w-fit rounded-xl border border-[#e4e9e4] bg-white p-1 shadow-sm" role="tablist" aria-label="Open roles">
            {(Object.values(jobs)).map((job, index) => {
              const selected = job.id === jobId;
              return <button key={job.id} id={`tab-${job.id}`} role="tab" aria-selected={selected} aria-controls="candidate-panel" onClick={() => setJobId(job.id)} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-4 ${selected ? "bg-[#285b43] text-white shadow-sm" : "text-[#758078] hover:bg-[#f4f7f4]"}`}><span className={`grid h-5 w-5 place-items-center rounded-md text-[10px] ${selected ? "bg-white/15" : "bg-[#f0f2ef]"}`}>0{index + 1}</span><span className="text-left">{job.title}</span>{selected && <Check size={14} />}</button>;
            })}
          </div>
        </div>

        <section className="mt-4 overflow-hidden rounded-3xl border border-[#e5eae5] bg-white shadow-[0_2px_8px_rgba(31,45,35,.025)]">
          <div className={`relative overflow-hidden px-5 py-6 sm:px-7 sm:py-7 ${jobId === "jd1_lca" ? "bg-[#edf5ef]" : "bg-[#f2effa]"}`}>
            <div className={`absolute -right-10 -top-20 h-56 w-56 rounded-full opacity-40 blur-[1px] ${jobId === "jd1_lca" ? "bg-[#cde2d1]" : "bg-[#dfd4f1]"}`} />
            <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.09em] ${jobId === "jd1_lca" ? "bg-[#dcecdf] text-[#3d714b]" : "bg-[#e7e0f5] text-[#6b5797]"}`}>Role {jobId === "jd1_lca" ? "01" : "02"}</span>
                  <span className="text-xs font-medium text-[#77837a]">{activeJob.team} <span className="px-1 text-[#bdc4bd]">·</span> {activeJob.employment}</span>
                </div>
                <h2 className="mt-3 text-[25px] font-semibold tracking-[-.045em] text-[#1d2922] sm:text-[30px]">{activeJob.title}</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[#6f7d72]">{activeJob.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-x-7 gap-y-3 rounded-2xl border border-white/80 bg-white/65 p-4 sm:min-w-[290px]">
                <p className="text-[10px] font-semibold uppercase tracking-[.1em] text-[#929a94]">Location</p><p className="text-[10px] font-semibold uppercase tracking-[.1em] text-[#929a94]">Requirements</p>
                <p className="text-xs font-semibold text-[#45544a]">{activeJob.location}</p><p className="text-xs font-semibold text-[#45544a]">{activeJob.requirements.length} key criteria</p>
              </div>
            </div>
            <div className="relative mt-5 flex flex-wrap gap-2">{activeJob.requirements.map((requirement) => <span key={requirement} className="rounded-full border border-white/90 bg-white/70 px-2.5 py-1.5 text-[10px] font-medium text-[#647168]">{requirement}</span>)}</div>
          </div>

          <div id="candidate-panel" role="tabpanel" aria-labelledby={`tab-${jobId}`} className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0 px-4 py-5 sm:px-6 sm:py-6 lg:border-r lg:border-[#edf0ed]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative min-w-0 flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98a199]" />
                  <input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Search candidates, skills, tools…" className="h-10 w-full rounded-xl border border-[#e4e9e4] bg-[#fcfdfc] pl-10 pr-9 text-xs text-[#39463d] outline-none transition placeholder:text-[#a0a9a2] focus:border-[#8eae97] focus:ring-2 focus:ring-[#d9e8dc]" />
                  {filters.search && <button onClick={() => setFilters({ ...filters, search: "" })} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#89938b]"><X size={14} /></button>}
                </div>
                <label className="relative flex h-10 items-center gap-2 rounded-xl border border-[#e4e9e4] bg-white px-3 text-xs text-[#657168]">
                  <Filter size={14} className="text-[#8b968d]" />
                  <select value={filters.classification} onChange={(event) => setFilters({ ...filters, classification: event.target.value as FilterState["classification"] })} className="max-w-[190px] appearance-none bg-transparent pr-5 outline-none">
                    {classificationOptions.map((option) => <option key={option} value={option}>{option === "All classifications" ? "All classifications" : option}</option>)}
                  </select><ChevronDown size={13} className="pointer-events-none absolute right-3 text-[#909a92]" />
                </label>
                <label className="relative flex h-10 items-center gap-2 rounded-xl border border-[#e4e9e4] bg-white px-3 text-xs text-[#657168]">
                  <ArrowDownWideNarrow size={14} className="text-[#8b968d]" />
                  <select value={filters.sort} onChange={(event) => setFilters({ ...filters, sort: event.target.value as FilterState["sort"] })} className="appearance-none bg-transparent pr-5 outline-none">
                    <option value="score">Match score</option><option value="experience">Experience</option>
                  </select><ChevronDown size={13} className="pointer-events-none absolute right-3 text-[#909a92]" />
                </label>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div><h3 className="text-sm font-semibold tracking-[-.02em]">Ranked candidates <span className="ml-1.5 rounded-md bg-[#f0f3f0] px-1.5 py-0.5 text-[10px] font-semibold text-[#6d796f]">{filteredCandidates.length}</span></h3><p className="mt-1 text-[11px] text-[#909991]">Sorted by {filters.sort === "score" ? "match score" : "years of experience"} · Highest first</p></div>
                <button onClick={() => setFilters({ search: "", classification: "All classifications", sort: "score" })} className="text-[11px] font-semibold text-[#5d8065] hover:text-[#285b43]">Reset filters</button>
              </div>
              <div className="mt-4 space-y-3">
                {filteredCandidates.map((candidate, index) => <CandidateCard key={candidate.id} candidate={candidate} jobId={jobId} rank={index + 1} onInspect={setInspected} />)}
                {!filteredCandidates.length && <div className="rounded-2xl border border-dashed border-[#dce3dc] py-12 text-center"><div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-[#f0f4f0] text-[#7d8b7f]"><Search size={17} /></div><p className="mt-3 text-sm font-semibold">No candidates found</p><p className="mt-1 text-xs text-[#89938b]">Try a different search or clear your filters.</p></div>}
              </div>
            </div>

            <aside className="space-y-5 border-t border-[#edf0ed] bg-[#fcfdfb] p-4 sm:p-6 lg:border-l-0 lg:border-t-0">
              <LiveUploadBox onCandidate={addCandidate} onInspect={setInspected} />
              <section className="rounded-2xl border border-[#e8ece8] bg-white p-4">
                <div className="flex items-center justify-between"><div><h3 className="text-sm font-semibold">Pipeline snapshot</h3><p className="mt-1 text-[11px] text-[#879188]">For {activeJob.title}</p></div><LayoutGrid size={16} className="text-[#849188]" /></div>
                <div className="mt-4 space-y-3">
                  <ProgressRow label="Strong fit" count={healthyCandidates.filter((candidate) => candidate[jobId].score >= 80).length} total={healthyCandidates.length} color="bg-[#5a9a6f]" />
                  <ProgressRow label="Worth a look" count={healthyCandidates.filter((candidate) => candidate[jobId].score >= 55 && candidate[jobId].score < 80).length} total={healthyCandidates.length} color="bg-[#d2aa57]" />
                  <ProgressRow label="Low alignment" count={healthyCandidates.filter((candidate) => candidate[jobId].score < 55).length} total={healthyCandidates.length} color="bg-[#c6ceca]" />
                </div>
                <div className="mt-4 border-t border-[#eef1ee] pt-3 text-[10px] leading-4 text-[#929b94]">Scores are decision-support signals; review evidence and candidate context before taking action.</div>
              </section>
              <section className="overflow-hidden rounded-2xl bg-[#285b43] p-4 text-white">
                <div className="flex items-center gap-2"><div className="grid h-7 w-7 place-items-center rounded-lg bg-white/15"><Sparkles size={14} /></div><p className="text-xs font-semibold">Built for better decisions</p></div>
                <p className="mt-3 text-[11px] leading-5 text-white/75">Every match comes with transparent evidence and gaps—so your team can spend less time sorting, and more time connecting.</p>
                <button onClick={() => setMethodologyOpen(true)} className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-white hover:text-[#d4ebd8]">Explore our methodology <ArrowRight size={13} /></button>
              </section>
            </aside>
          </div>
        </section>
        <p className="mt-4 px-1 text-[10px] leading-5 text-[#9ba39d]">Prototype data is synthetic for demonstration. Candidate scores are heuristic, explainable signals—not a substitute for human review or a hiring decision.</p>
      </div>
      <CandidateModal candidate={inspected} jobId={jobId} onClose={() => setInspected(null)} />
      <MethodologyModal open={methodologyOpen} onClose={() => setMethodologyOpen(false)} />
    </main>
  );
}

function StatCard({ icon, label, value, note, accent }: { icon: React.ReactNode; label: string; value: string; note: string; accent?: boolean }) {
  return <article className="rounded-2xl border border-[#e7ebe7] bg-white p-4 shadow-[0_1px_2px_rgba(20,40,30,.025)] sm:p-5"><div className="flex items-center justify-between"><p className="text-xs font-medium text-[#78837b]">{label}</p><div className={`grid h-8 w-8 place-items-center rounded-lg ${accent ? "bg-[#edf5ef] text-[#528366]" : "bg-[#f3f5f3] text-[#828d84]"}`}>{icon}</div></div><div className="mt-3 flex items-baseline gap-2"><p className="text-[27px] font-semibold leading-none tracking-[-.055em]">{value}</p><span className="text-[10px] font-semibold text-[#5b956d]">{accent ? "↑" : ""}</span></div><p className="mt-2 text-[10px] text-[#99a19b]">{note}</p></article>;
}

function ProgressRow({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const width = total ? (count / total) * 100 : 0;
  return <div><div className="mb-1.5 flex justify-between text-[11px]"><span className="text-[#6e7971]">{label}</span><span className="font-semibold text-[#536057]">{count}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-[#f0f2f0]"><div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${width}%` }} /></div></div>;
}
