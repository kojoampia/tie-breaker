/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Factor {
  id: string;
  text: string;
  weight: number; // -10 to 10
  category: 'pro' | 'con';
  sentiment?: number; // -1.0 to 1.0
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface ComparisonTable {
  headers: string[];
  rows: {
    label: string;
    values: string[];
  }[];
}

export interface DecisionAnalysis {
  options: string[];
  factors: Factor[];
  swot: SWOT;
  comparisonTable: ComparisonTable;
  summary: string;
}

export interface HistoryEntry {
  id: string;
  query: string;
  analysis: DecisionAnalysis;
  timestamp: number;
}

export type AnalysisMode = 'list' | 'table' | 'swot' | 'pairwise' | 'history';
