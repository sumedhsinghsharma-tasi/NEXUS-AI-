import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FOUNDERS, ONBOARDING } from "@/constants/testIds";
import { Markdown } from "@/components/Markdown";
import { Loader2, ArrowUpRight } from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Founders() {
  const [founders, setFounders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await axios.get(`${API}/founders`);
        if (active) setFounders(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main data-testid={FOUNDERS.page} className="min-h-screen bg-[#F2E8D5]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-16 lg:pt-24 pb-24">
        {/* Header */}
        <div className="grid grid-cols-12 gap-8 mb-16 lg:mb-24">
          <div className="col-span-12 lg:col-span-8">
            <div className="overline text-[#8A7660] mb-6">
              Index · 02 / Founders Routed by AI Engine
            </div>
            <h1 className="font-display font-black tracking-tighter text-5xl sm:text-6xl lg:text-[5rem] leading-[0.92] text-[#1A140E]">
              The Founders<br />
              <span className="italic font-light text-[#7E3F22]">Index.</span>
            </h1>
          </div>
          <div className="col-span-12 lg:col-span-4 flex lg:justify-end items-end">
            <Link
              to="/"
              data-testid={FOUNDERS.backLink}
              className="border border-[#1A140E] px-6 py-4 hover:bg-[#1A140E] hover:text-[#FBF5E8] transition-colors overline"
            >
              + Add Founder
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-b border-[#1A140E] py-5 mb-0 grid grid-cols-3 gap-4 bg-[#EADFC8]">
          <Stat label="Total founders" value={String(founders.length).padStart(3, "0")} />
          <Stat label="AI engine" value="Claude Sonnet 4.5" />
          <Stat label="Jurisdiction" value="UAE · PDPL Compliant" />
        </div>

        {/* List */}
        <div data-testid={FOUNDERS.list} className="border-b border-[#1A140E] bg-[#FAF3E2]">
          {loading ? (
            <div className="py-24 flex items-center justify-center text-[#8A7660] gap-3">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="overline">Loading index…</span>
            </div>
          ) : founders.length === 0 ? (
            <div
              data-testid={FOUNDERS.empty}
              className="py-24 text-center"
            >
              <p className="font-display text-2xl tracking-tight text-[#1A140E] mb-3">
                No founders routed yet.
              </p>
              <p className="text-sm text-[#8A7660] mb-8">
                Be the first signal through the engine.
              </p>
              <Link
                to="/"
                data-testid={ONBOARDING.submitBtn + "-empty"}
                className="inline-block bg-[#1A140E] text-[#FBF5E8] px-8 py-4 hover:bg-[#7E3F22] transition-colors overline"
              >
                Start Onboarding →
              </Link>
            </div>
          ) : (
            founders.map((f, i) => (
              <FounderRow
                key={f.id}
                founder={f}
                index={i + 1}
                open={openId === f.id}
                onToggle={() => setOpenId(openId === f.id ? null : f.id)}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div className="px-4">
      <div className="overline text-[#8A7660] mb-1.5">{label}</div>
      <div className="font-mono-grid text-sm sm:text-base text-[#1A140E]">
        {value}
      </div>
    </div>
  );
}

function FounderRow({ founder, index, open, onToggle }) {
  const created = new Date(founder.created_at);
  const dateStr = created.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article data-testid={FOUNDERS.card} className="border-t border-[#D9C5A0]">
      <button
        onClick={onToggle}
        className="w-full grid grid-cols-12 gap-4 py-8 px-2 sm:px-4 text-left hover:bg-[#F4EAD3] transition-colors items-baseline"
      >
        <div className="col-span-2 sm:col-span-1 font-mono-grid text-xs text-[#B96A47]">
          {String(index).padStart(3, "0")}
        </div>
        <div className="col-span-10 sm:col-span-4">
          <div className="font-display font-black tracking-tighter text-2xl sm:text-3xl text-[#1A140E]">
            {founder.name}
          </div>
        </div>
        <div className="col-span-8 sm:col-span-5 text-sm text-[#5C4A36] line-clamp-2">
          {founder.skills}
        </div>
        <div className="col-span-4 sm:col-span-2 flex items-center justify-end gap-2 font-mono-grid text-xs text-[#8A7660]">
          {dateStr}
          <ArrowUpRight
            className={`h-4 w-4 transition-transform ${
              open ? "rotate-45 text-[#7E3F22]" : ""
            }`}
          />
        </div>
      </button>

      {open && (
        <div className="grid grid-cols-12 gap-4 px-2 sm:px-4 pb-12">
          <div className="col-span-12 sm:col-span-5 sm:col-start-2 space-y-6">
            <Block label="Skills" body={founder.skills} />
            <Block label="Wants to learn" body={founder.learning_goals} />
          </div>
          <div className="col-span-12 sm:col-span-6 border-l border-[#D9C5A0] sm:pl-8">
            <div className="overline text-[#8A7660] mb-4">
              AI Engine Briefing
            </div>
            <Markdown text={founder.ai_insight} />
          </div>
        </div>
      )}
    </article>
  );
}

function Block({ label, body }) {
  return (
    <div>
      <div className="overline text-[#8A7660] mb-2">{label}</div>
      <p className="text-[15px] leading-relaxed text-[#3A2F22]">{body}</p>
    </div>
  );
}
