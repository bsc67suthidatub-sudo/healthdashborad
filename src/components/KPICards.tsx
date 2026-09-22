import React from 'react';
import { KPIStats } from '../types';
import {
  Users,
  HeartPulse,
  ArrowUpDown,
  PieChart,
  Percent,
  AlertTriangle,
  Scale,
  Droplets,
  Activity,
} from 'lucide-react';

interface KPICardsProps {
  kpi: KPIStats;
  totalDatasetCount: number;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpi, totalDatasetCount }) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Top Section Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h2 className="text-base font-semibold text-white tracking-wide">
            การสรุปข้อมูลสำคัญด้านสุขภาพ (Health Overview KPIs)
          </h2>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          คำนวณตามข้อมูลที่ผ่านการคัดกรอง ({kpi.totalScreened} คน)
        </span>
      </div>

      {/* 4 Core Essential Category KPI Cards satisfying prompt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: จำนวน (Total Count) */}
        <div
          id="kpi-card-count"
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-teal-950/50 border border-teal-500/30 p-5 shadow-lg shadow-teal-950/20 group hover:border-teal-400/50 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-teal-300 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20">
              จำนวน (Count)
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 group-hover:scale-105 transition-transform">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400">ผู้รับการคัดกรองสุขภาพ</div>
            <div className="text-3xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
              <span>{kpi.totalScreened}</span>
              <span className="text-sm font-medium text-teal-300">คน</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>ฐานข้อมูลสำรวจ</span>
            <span className="text-teal-300 font-medium">
              {((kpi.totalScreened / Math.max(totalDatasetCount, 1)) * 100).toFixed(0)}% ของกลุ่มตัวอย่าง
            </span>
          </div>
        </div>

        {/* KPI 2: ค่าเฉลี่ย (Average) */}
        <div
          id="kpi-card-average"
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-cyan-950/50 border border-cyan-500/30 p-5 shadow-lg shadow-cyan-950/20 group hover:border-cyan-400/50 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-cyan-300 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              ค่าเฉลี่ย (Average)
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 group-hover:scale-105 transition-transform">
              <Scale className="w-4.5 h-4.5" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400">BMI เฉลี่ย & น้ำตาลในเลือด</div>
            <div className="text-3xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
              <span>{kpi.avgBMI}</span>
              <span className="text-xs font-medium text-cyan-300">kg/m² (BMI)</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1 text-slate-400">
              <Droplets className="w-3 h-3 text-cyan-400" />
              น้ำตาลเฉลี่ย:
            </span>
            <span className="font-semibold text-cyan-200">
              {kpi.avgBloodSugar} <span className="text-[10px] text-slate-400 font-normal">mg/dL</span>
            </span>
          </div>
        </div>

        {/* KPI 3: ค่าต่ำสุด - สูงสุด (Min - Max) */}
        <div
          id="kpi-card-minmax"
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-blue-950/50 border border-blue-500/30 p-5 shadow-lg shadow-blue-950/20 group hover:border-blue-400/50 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-blue-300 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              ค่าต่ำสุด - สูงสุด (Min-Max)
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300 group-hover:scale-105 transition-transform">
              <ArrowUpDown className="w-4.5 h-4.5" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400">ช่วงระดับน้ำตาล (Blood Sugar)</div>
            <div className="text-2xl font-extrabold text-white tracking-tight flex items-baseline gap-1.5">
              <span>{kpi.minBloodSugar}</span>
              <span className="text-slate-500 text-lg font-light">-</span>
              <span className="text-rose-300">{kpi.maxBloodSugar}</span>
              <span className="text-xs font-medium text-blue-300 ml-1">mg/dL</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
            <span className="text-slate-400">ช่วงความดัน SBP:</span>
            <span className="font-medium text-blue-200">
              {kpi.minSBP} - {kpi.maxSBP} <span className="text-[10px] text-slate-400">mmHg</span>
            </span>
          </div>
        </div>

        {/* KPI 4: สัดส่วน & ร้อยละ (Proportion & Percentage) */}
        <div
          id="kpi-card-proportion-percent"
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-rose-950/40 border border-rose-500/30 p-5 shadow-lg shadow-rose-950/20 group hover:border-rose-400/50 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-rose-300 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
              สัดส่วน & ร้อยละ
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-4.5 h-4.5" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400">กลุ่มเสี่ยงสูง (High Risk)</div>
            <div className="text-3xl font-extrabold text-rose-200 tracking-tight flex items-baseline gap-2">
              <span>{kpi.highRiskRate}%</span>
              <span className="text-xs font-medium text-slate-400">
                ({kpi.highRiskCount}/{kpi.totalScreened} คน)
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
            <span className="text-slate-400">เสี่ยงความดันสูง:</span>
            <span className="font-semibold text-amber-300">
              {kpi.hypertensionRiskRate}% ({kpi.hypertensionRiskCount} คน)
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Quick Metrics Row (Blood Pressure, Diabetes, Obesity, Pulse) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-300 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">ความดันเฉลี่ย (SBP/DBP)</div>
            <div className="text-sm font-bold text-white">
              {kpi.avgSBP} / {kpi.avgDBP} <span className="text-[10px] text-slate-400 font-normal">mmHg</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-300 flex items-center justify-center shrink-0">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">ร้อยละเสี่ยงเบาหวาน</div>
            <div className="text-sm font-bold text-amber-300">
              {kpi.diabetesRiskRate}% <span className="text-[10px] text-slate-400 font-normal">({kpi.diabetesRiskCount} คน)</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-300 flex items-center justify-center shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">ร้อยละภาวะอ้วน (BMI ≥25)</div>
            <div className="text-sm font-bold text-cyan-300">
              {kpi.obesityRate}%
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-300 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400">อายุเฉลี่ย (ช่วง {kpi.minAge}-{kpi.maxAge})</div>
            <div className="text-sm font-bold text-white">
              {kpi.avgAge} <span className="text-[10px] text-slate-400 font-normal">ปี</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
