import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { ONBOARDING } from "@/constants/testIds";
import { Markdown } from "@/components/Markdown";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Onboarding() {
  const [form, setForm] = useState({ name: "", skills: "", learning_goals: "" });
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const canSubmit =
    form.name.trim() &&
    form.skills.trim() &&
    form.learning_goals.trim() &&
    consent &&
    !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!consent) {
      setError("UAE data privacy consent is required to submit.");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${API}/founders`, { ...form, consent });
      setResult(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "AI engine could not process your submission. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setForm({ name: "", skills: "", learning_goals: "" });
    setConsent(false);
    setResult(null);
    setError("");
  };

  return (
    <main data-testid={ONBOARDING.page} className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-16 lg:pt-24 pb-24">
        <div className="grid grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT — Editorial intro (Swiss column) */}
          <aside className="col-span-12 lg:col-span-5 xl:col-span-4">
            <div className="sticky top-12 space-y-10">
              <div>
                <div className="overline text-neutral-500 mb-6">
                  Cohort · 026 / Intake Open
                </div>
                <h1 className="font-display font-black tracking-tighter text-5xl sm:text-6xl lg:text-[5.5rem] leading-[0.92] text-neutral-950">
                  Submit
                  <br />
                  to the
                  <br />
                  <span className="italic font-light">AI Engine.</span>
                </h1>
              </div>

              <p className="text-[15px] leading-relaxed text-neutral-600 max-w-sm">
                NEXUS reads founder signal — your name, your edge, and the
                vector you want to grow in — then routes you into the right
                rooms, peers, and resources across the UAE network.
              </p>

              <div className="border-t border-neutral-200 pt-6 space-y-3 max-w-xs">
                <Row label="Founders matched" value="1,284" />
                <Row label="Avg. match latency" value="2.4s" />
                <Row label="Operating from" value="Dubai · Abu Dhabi" />
              </div>
            </div>
          </aside>

          {/* RIGHT — Form / Result */}
          <section className="col-span-12 lg:col-span-7 xl:col-span-8">
            {!result ? (
              <form
                data-testid={ONBOARDING.form}
                onSubmit={handleSubmit}
                className="border border-neutral-200"
              >
                <div className="border-b border-neutral-200 px-8 lg:px-12 py-6 flex items-center justify-between">
                  <span className="overline text-neutral-500">
                    Founder Profile · Form 01
                  </span>
                  <span className="overline text-neutral-500 hidden sm:inline">
                    All fields required
                  </span>
                </div>

                <div className="px-8 lg:px-12 py-10 lg:py-14 space-y-12">
                  <Field
                    index="01"
                    label="Your name"
                    hint="The name your peers will see across NEXUS."
                  >
                    <Input
                      data-testid={ONBOARDING.nameInput}
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="e.g. Layla Al-Mansoori"
                      className="h-14 rounded-none border-0 border-b border-neutral-300 px-0 text-lg focus-visible:ring-0 focus-visible:border-neutral-950 transition-colors"
                      required
                    />
                  </Field>

                  <Field
                    index="02"
                    label="Skills you bring"
                    hint="Comma-separate or write naturally. Be specific."
                  >
                    <Textarea
                      data-testid={ONBOARDING.skillsInput}
                      value={form.skills}
                      onChange={(e) =>
                        setForm({ ...form, skills: e.target.value })
                      }
                      placeholder="e.g. Product strategy, Arabic UX writing, fundraising in MENA, Solidity, growth loops…"
                      rows={4}
                      className="rounded-none border border-neutral-300 px-4 py-3 text-[15px] focus-visible:ring-0 focus-visible:border-neutral-950 resize-none transition-colors"
                      required
                    />
                  </Field>

                  <Field
                    index="03"
                    label="What you want to learn"
                    hint="Be honest — this routes your matches."
                  >
                    <Textarea
                      data-testid={ONBOARDING.learnInput}
                      value={form.learning_goals}
                      onChange={(e) =>
                        setForm({ ...form, learning_goals: e.target.value })
                      }
                      placeholder="e.g. How to price a B2B SaaS in the GCC, hiring an early CTO, navigating ADGM…"
                      rows={4}
                      className="rounded-none border border-neutral-300 px-4 py-3 text-[15px] focus-visible:ring-0 focus-visible:border-neutral-950 resize-none transition-colors"
                      required
                    />
                  </Field>

                  {/* Consent */}
                  <div className="border border-neutral-300 p-6">
                    <label className="flex items-start gap-4 cursor-pointer">
                      <Checkbox
                        data-testid={ONBOARDING.consentCheckbox}
                        checked={consent}
                        onCheckedChange={(v) => setConsent(Boolean(v))}
                        className="mt-1 h-5 w-5 rounded-none border-neutral-900 data-[state=checked]:bg-neutral-950 data-[state=checked]:border-neutral-950"
                      />
                      <span className="text-[14px] leading-relaxed text-neutral-800">
                        <span className="overline block mb-2 text-neutral-900">
                          UAE Data Privacy Consent · Required
                        </span>
                        I consent to NEXUS AI COMMUNITY HUB processing the
                        information above in line with{" "}
                        <span className="font-medium text-neutral-950">
                          UAE Federal Decree-Law No. 45 of 2021
                        </span>{" "}
                        on the Protection of Personal Data. I understand my
                        profile will be reviewed by NEXUS&apos; AI engine to match me
                        with relevant founders, events and resources.
                      </span>
                    </label>
                  </div>

                  {error && (
                    <Alert
                      data-testid={ONBOARDING.errorAlert}
                      variant="destructive"
                      className="rounded-none border-neutral-950 bg-neutral-950 text-white"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-white">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  type="submit"
                  data-testid={ONBOARDING.submitBtn}
                  disabled={!canSubmit}
                  className="group w-full bg-neutral-950 text-white px-8 lg:px-12 py-8 flex items-center justify-between hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <span className="overline">
                    {submitting ? "Processing signal…" : "Action · 01"}
                  </span>
                  <span className="font-display font-black tracking-tighter text-2xl sm:text-3xl lg:text-4xl">
                    {submitting ? "Routing to AI Engine" : "Submit to AI Engine"}
                  </span>
                  <span className="flex items-center gap-3">
                    {submitting ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                    )}
                  </span>
                </button>
              </form>
            ) : (
              <ResultCard result={result} onReset={reset} />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({ index, label, hint, children }) {
  return (
    <div className="grid grid-cols-12 gap-6 items-start">
      <div className="col-span-12 sm:col-span-3">
        <div className="overline text-neutral-400 mb-2">{index}</div>
        <Label className="font-display text-lg font-medium tracking-tight text-neutral-950 block">
          {label}
        </Label>
        <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
          {hint}
        </p>
      </div>
      <div className="col-span-12 sm:col-span-9">{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="overline text-neutral-500">{label}</span>
      <span className="font-mono-grid text-sm text-neutral-950">{value}</span>
    </div>
  );
}

function ResultCard({ result, onReset }) {
  return (
    <div
      data-testid={ONBOARDING.successCard}
      className="border border-neutral-950"
    >
      <div className="bg-neutral-950 text-white px-8 lg:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="h-4 w-4" />
          <span className="overline">AI Engine · Response Received</span>
        </div>
        <span className="font-mono-grid text-xs">
          ID · {result.id.slice(0, 8).toUpperCase()}
        </span>
      </div>

      <div className="px-8 lg:px-12 py-10 lg:py-14 space-y-8">
        <div>
          <div className="overline text-neutral-500 mb-3">Welcome</div>
          <h2 className="font-display font-black tracking-tighter text-4xl sm:text-5xl text-neutral-950">
            {result.name}.
          </h2>
        </div>

        <div className="border-t border-neutral-200 pt-8">
          <div className="overline text-neutral-500 mb-4">
            Personal Briefing · Generated by Claude Sonnet 4.5
          </div>
          <div data-testid={ONBOARDING.insightContent}>
            <Markdown text={result.ai_insight} />
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-8 flex flex-col sm:flex-row gap-4">
          <button
            data-testid={ONBOARDING.resetBtn}
            onClick={onReset}
            className="flex-1 border border-neutral-950 px-6 py-4 text-neutral-950 hover:bg-neutral-950 hover:text-white transition-colors overline"
          >
            ← Submit Another Founder
          </button>
          <Link
            to="/founders"
            data-testid={ONBOARDING.viewFoundersBtn}
            className="flex-1 bg-neutral-950 text-white px-6 py-4 hover:bg-neutral-800 transition-colors overline text-center"
          >
            View Founders Index →
          </Link>
        </div>
      </div>
    </div>
  );
}
