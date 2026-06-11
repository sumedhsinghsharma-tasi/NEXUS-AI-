import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ONBOARDING } from "@/constants/testIds";

export function BrandHeader() {
  const location = useLocation();
  const isFounders = location.pathname.startsWith("/founders");

  return (
    <header className="border-b border-[#D9C5A0]/70 bg-[#EADFC8]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="ticker-dot pulse-dot" aria-hidden />
          <span
            data-testid={ONBOARDING.brand}
            className="font-display font-black tracking-tighter text-[15px] leading-none text-[#1A140E]"
          >
            NEXUS<span className="text-[#B96A47] mx-1.5">/</span>AI COMMUNITY HUB
          </span>
        </Link>

        <nav className="flex items-center gap-8">
          <span className="overline hidden md:inline text-[#7A6A55]">
            UAE · EST. 2026
          </span>
          {isFounders ? (
            <Link
              to="/"
              data-testid="nav-onboarding-link"
              className="overline text-[#1A140E] underline-offset-8 hover:underline"
            >
              ← Onboarding
            </Link>
          ) : (
            <Link
              to="/founders"
              data-testid={ONBOARDING.navFoundersLink}
              className="overline text-[#1A140E] underline-offset-8 hover:underline"
            >
              Founders Index →
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
