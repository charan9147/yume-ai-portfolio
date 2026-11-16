/**
 * Budget model — deliberately illustrative.
 *
 * These numbers exist so a conversation can start with a range instead of a
 * guess. They are NOT quotations, NOT offers and NOT benchmarks. Every figure
 * is expressed in Indian rupees (lakh) and assumes a student-scale build with
 * existing open-source tooling.
 */

export type ProjectKey = 'tutor' | 'companion' | 'bridge' | 'research';
export type ScopeKey = 'demo' | 'prototype' | 'pilot';
export type TimelineKey = 'm3' | 'm6' | 'm12';

/** Base range in lakh INR for a working prototype at six months. */
const BASE: Record<ProjectKey, [number, number]> = {
  tutor: [4, 9],
  companion: [9, 22],
  bridge: [3, 7],
  research: [6, 18],
};

const SCOPE: Record<ScopeKey, number> = {
  demo: 0.45,
  prototype: 1,
  pilot: 1.85,
};

const TIMELINE: Record<TimelineKey, { factor: number; months: number }> = {
  m3: { factor: 0.92, months: 3 },
  m6: { factor: 1, months: 6 },
  m12: { factor: 1.12, months: 12 },
};

const roundLakh = (v: number) => Math.round(v * 2) / 2;
/** Monthly figures need finer steps than the half-lakh headline range. */
const roundMonthly = (v: number) => Math.round(v * 20) / 20;

export type Estimate = {
  minLakh: number;
  maxLakh: number;
  monthlyMinLakh: number;
  monthlyMaxLakh: number;
  months: number;
};

export function estimate(project: ProjectKey, scope: ScopeKey, timeline: TimelineKey): Estimate {
  const [baseMin, baseMax] = BASE[project];
  const s = SCOPE[scope];
  const { factor, months } = TIMELINE[timeline];

  const minLakh = roundLakh(baseMin * s * factor);
  const maxLakh = roundLakh(baseMax * s * factor);

  return {
    minLakh,
    maxLakh,
    monthlyMinLakh: roundMonthly(minLakh / months),
    monthlyMaxLakh: roundMonthly(maxLakh / months),
    months,
  };
}

export function formatLakh(value: number) {
  if (value < 1) return `₹${Math.round(value * 100)},000`;
  const text = value.toFixed(2).replace(/\.?0+$/, '');
  return `₹${text} L`;
}
