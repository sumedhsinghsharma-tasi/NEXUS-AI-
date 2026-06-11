import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ONBOARDING } from "@/constants/testIds";

export function BrandHeader() {
  const location = useLocation();
  const isFounders = location.pathname.startsWith("/founders");

  return (
    <header className="border-b border-neutral-200">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="ticker-dot pulse-dot" aria-hidden />
          <span
            data-testid={ONBOARDING.brand}
            className="font-display font-black tracking-tighter text-[15px] leading-none"
          >
            NEXUS<span className="text-neutral-400 mx-1.5">/</span>AI COMMUNITY HUB
          </span>
        </Link>

        <nav className="flex items-center gap-8">
          <span className="overline hidden md:inline text-neutral-500">
            UAE · EST. 2026
          </span>
          {isFounders ? (
            <Link
              to="/"
              data-testid="nav-onboarding-link"
              className="overline text-neutral-900 underline-offset-8 hover:underline"
            >
              ← Onboarding
            </Link>
          ) : (
            <Link
              to="/founders"
              data-testid={ONBOARDING.navFoundersLink}
              className="overline text-neutral-900 underline-offset-8 hover:underline"
            >
              Founders Index →
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
