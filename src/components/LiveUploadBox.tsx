"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, FileText, LoaderCircle, UploadCloud } from "lucide-react";
import type { Candidate } from "@/types/resume";

interface LiveUploadBoxProps {
  onCandidate: (candidate: Candidate) => void;
  onInspect: (candidate: Candidate) => void;
}

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const UPLOAD_TIMEOUT_MS = 55_000;

type ConfigurationStatus = "checking" | "configured" | "missing" | "unavailable";

function isCandidate(value: unknown): value is Candidate {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  const isEvaluation = (evaluation: unknown) => {
    if (typeof evaluation !== "object" || evaluation === null) return false;
    const item = evaluation as Record<string, unknown>;
    return typeof item.score === "number"
      && Array.isArray(item.evidence)
      && item.evidence.every((entry) => typeof entry === "string")
      && Array.isArray(item.missing_criteria)
      && item.missing_criteria.every((entry) => typeof entry === "string");
  };
  return typeof candidate.id === "string"
    && typeof candidate.name === "string"
    && typeof candidate.email === "string"
    && typeof candidate.location === "string"
    && typeof candidate.education === "string"
    && typeof candidate.experience_years === "number"
    && Array.isArray(candidate.tools)
    && candidate.tools.every((entry) => typeof entry === "string")
    && Array.isArray(candidate.skills)
    && candidate.skills.every((entry) => typeof entry === "string")
    && typeof candidate.source_file === "string"
    && ["LCA Role", "UI/UX Internship", "Both", "Neither/Uncertain"].includes(String(candidate.classification))
    && isEvaluation(candidate.jd1_lca)
    && isEvaluation(candidate.jd2_uiux);
}

export default function LiveUploadBox({ onCandidate, onInspect }: LiveUploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState<{ text: string; kind: "success" | "error" } | null>(null);
  const [configurationStatus, setConfigurationStatus] = useState<ConfigurationStatus>("checking");

  useEffect(() => {
    const controller = new AbortController();

    async function checkConfiguration() {
      try {
        const response = await fetch("/api/config-status", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Configuration check failed.");
        const result: unknown = await response.json();
        if (
          typeof result !== "object"
          || result === null
          || !("configured" in result)
          || typeof result.configured !== "boolean"
        ) {
          throw new Error("Configuration check returned an invalid response.");
        }
        setConfigurationStatus(result.configured ? "configured" : "missing");
      } catch {
        if (!controller.signal.aborted) setConfigurationStatus("unavailable");
      }
    }

    void checkConfiguration();
    return () => controller.abort();
  }, []);

  async function upload(file?: File) {
    if (!file) return;
    setMessage(null);
    const supportedType = /\.(pdf|docx)$/i.test(file.name);
    if (!supportedType) {
      setMessage({ text: "Choose a PDF or DOCX resume.", kind: "error" });
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setMessage({ text: "This file exceeds the 10 MB upload limit.", kind: "error" });
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body,
        signal: controller.signal,
      });
      const result: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const errorMessage = typeof result === "object" && result !== null && "error" in result && typeof result.error === "string"
          ? result.error
          : `The server could not process this file (HTTP ${response.status}).`;
        throw new Error(errorMessage);
      }
      if (typeof result !== "object" || result === null || !("candidate" in result) || !isCandidate(result.candidate)) {
        throw new Error("The server returned an invalid response. Please try again.");
      }
      const candidate = result.candidate;
      onCandidate(candidate);
      setMessage({ text: "Resume analyzed and added to the ranked list.", kind: "success" });
      onInspect(candidate);
    } catch (error) {
      const isTimeout = error instanceof Error && error.name === "AbortError";
      setMessage({
        text: isTimeout
          ? "Resume analysis timed out. Please try again with a smaller or clearer file."
          : error instanceof Error
            ? error.message
            : "Upload failed. Check your connection and try again.",
        kind: "error",
      });
    } finally {
      window.clearTimeout(timeout);
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <section
      className={`rounded-2xl border bg-white p-4 transition ${dragging ? "border-[#4e9167] bg-[#f3f9f4]" : "border-[#e8ece8]"}`}
      onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
      onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false); }}
      onDrop={(event) => { event.preventDefault(); setDragging(false); void upload(event.dataTransfer.files[0]); }}
    >
      <input ref={inputRef} type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={(event) => void upload(event.target.files?.[0])} />
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#edf5ef] text-[#47775b]">{loading ? <LoaderCircle size={19} className="animate-spin" /> : <UploadCloud size={19} />}</div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold">{loading ? "Analyzing resume with Gemini AI…" : "Add a resume"}</h3>
          <p className="mt-0.5 text-xs text-[#818b83]">{loading ? "Extracting candidate details and role matches" : "Drop a PDF or DOCX here, or select a file"}</p>
        </div>
        <button type="button" disabled={loading} onClick={() => inputRef.current?.click()} className="rounded-lg border border-[#dfe6df] px-3 py-2 text-xs font-semibold text-[#3e664d] transition hover:bg-[#f6faf6] disabled:opacity-50">Browse</button>
      </div>
      {configurationStatus === "missing" && (
        <p role="status" className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
          Resume analysis is not configured. Add GEMINI_API_KEY to the server&apos;s .env.local file and restart Next.js.
        </p>
      )}
      {configurationStatus === "unavailable" && (
        <p role="status" className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-700">
          Configuration status could not be checked. You can still try uploading a resume.
        </p>
      )}
      {loading && <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#edf2ed]" role="progressbar" aria-label="Analyzing resume"><div className="h-full w-2/3 animate-pulse rounded-full bg-[#57906a]" /></div>}
      {message && <p role="status" className={`mt-3 flex items-start gap-2 border-t border-[#eff2ef] pt-3 text-xs leading-5 ${message.kind === "error" ? "text-rose-700" : "text-emerald-800"}`}>{message.kind === "success" ? <CheckCircle2 size={14} className="mt-0.5 shrink-0" /> : <FileText size={14} className="mt-0.5 shrink-0" />}{message.text}</p>}
      <p className="mt-3 text-[10px] leading-4 text-[#9aa29c]">PDF or DOCX · Up to 10 MB · Processed in memory and not stored</p>
    </section>
  );
}
