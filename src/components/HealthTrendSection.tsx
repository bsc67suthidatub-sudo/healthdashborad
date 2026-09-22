import React from 'react';
import { HealthRecord } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';
import { TrendingUp, Calendar, Activity, AlertCircle } from 'lucide-react';

interface HealthTrendSectionProps {
  records: HealthRecord[];
}

export const HealthTrendSection: React.FC<HealthTrendSectionProps> = ({ records }) => {
  // Sort distinct months in chronological order
  const distinctMonths = Array.from(new Set(records.map((r) => r.month))).sort();

  // Monthly aggregated statistics
  const monthlyStats = distinctMonths.map((m) => {
    const sub = records.filter((r) => r.month === m);
    const n = sub.length;
    if (n === 0) {
      return {
        month: m,
        count: 0,
        avgRiskScore: 0,
        avgBloodSugar: 0,
        avgSBP: 0,
        avgDBP: 0,
        avgBMI: 0,
        highRiskCount: 0,
        highRiskRate: 0,
        hypertensionRiskCount: 0,
        diabetesRiskCount: 0,
      };
    }
    const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
    const highRisk = sub.filter((r) => r.riskLevel === 'สูง').length;
    const htRisk = sub.filter((r) => r.hypertensionScreening === 'มีแนวโน้ม/เสี่ยง' || r.sbp >= 140).length;
    const dmRisk = sub.filter((r) => r.diabetesScreening === 'มีแนวโน้ม/เสี่ยง' || r.bloodSugar >= 126).length;

    return {
      month: m,
      monthLabel: m === '2026-01' ? 'มกราคม 2026' : m === '2026-02' ? 'กุมภาพันธ์ 2026' : 'มีนาคม 2026',
      count: n,
      avgRiskScore: Number((sum(sub.map((r) => r.riskScore)) / n).toFixed(2)),
      avgBloodSugar: Number((sum(sub.map((r) => r.bloodSugar)) / n).toFixed(1)),
      avgSBP: Number((sum(sub.map((r) => r.sbp)) / n).toFixed(1)),
      avgDBP: Number((sum(sub.map((r) => r.dbp)) / n).toFixed(1)),
      avgBMI: Number((sum(sub.map((r) => r.bmi)) / n).toFixed(1)),
      highRiskCount: highRisk,
      highRiskRate: Number(((highRisk / n) * 100).toFixed(1)),
      hypertensionRiskCount: htRisk,
      diabetesRiskCount: dmRisk,
    };
  });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">การวิเคราะห์แนวโน้มสุขภาพ (Health Trend Analysis)</h2>
            <p className="text-xs text-slate-400">
              ติดตามทิศทางและแนวโน้มการเปลี่ยนแปลงของตัวชี้วัดสุขภาพสำคัญตามรอบการคัดกรอง (มกราคม - มีนาคม 2026)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-cyan-300 bg-cyan-950/60 px-3 py-1.5 rounded-xl border border-cyan-800/40">
          <Calendar className="w-3.5 h-3.5" />
          <span>รอบการสำรวจ: ไตรมาส 1 ปี 2026</span>
        </div>
      </div>

      {/* Grid: 2 Core Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Trend Field 1: แนวโน้มค่าน้ำตาลในเลือดเฉลี่ยและความดันโลหิตเฉลี่ย (SBP) */}
        <div className="rounded-2xl bg-slate-900/90 border border-teal-900/40 p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-semibold text-white">
                Trend 1: แนวโน้มระดับน้ำตาลและความดันโลหิตเฉลี่ย
              </h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
              รายเดือน
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            เปรียบเทียบค่าน้ำตาลในเลือดเฉลี่ย (mg/dL) และความดัน SBP เฉลี่ย (mmHg)
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyStats} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                <XAxis dataKey="monthLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#06b6d4',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="avgSBP"
                  name="ความดัน SBP เฉลี่ย (mmHg)"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#38bdf8' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="avgBloodSugar"
                  name="น้ำตาลในเลือดเฉลี่ย (mg/dL)"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#f43f5e' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            {monthlyStats.map((s) => (
              <div key={s.month} className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-[10px]">{s.monthLabel}</div>
                <div className="text-cyan-300 font-bold mt-0.5">SBP {s.avgSBP}</div>
                <div className="text-rose-300 text-[11px]">FBS {s.avgBloodSugar}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trend Field 2: แนวโน้มคะแนนความเสี่ยงเฉลี่ยและร้อยละกลุ่มเสี่ยงสูง */}
        <div className="rounded-2xl bg-slate-900/90 border border-teal-900/40 p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">
                Trend 2: แนวโน้มคะแนนความเสี่ยง & สัดส่วนกลุ่มเสี่ยงสูง
              </h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/40">
              Risk Progression
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            ติดตามการเปลี่ยนแปลงคะแนนความเสี่ยงสะสมเฉลี่ย และอัตราส่วนผู้ที่มีความเสี่ยงสูง (%)
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyStats} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                <defs>
                  <linearGradient id="riskRateGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="monthLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#f43f5e',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="highRiskRate"
                  name="ร้อยละกลุ่มเสี่ยงสูง (%)"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#riskRateGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="avgRiskScore"
                  name="คะแนนความเสี่ยงเฉลี่ย (คะแนน)"
                  stroke="#fbbf24"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              ในช่วงมีนาคม 2026 พบว่าสัดส่วนกลุ่มเสี่ยงสูงและคะแนนความเสี่ยงเฉลี่ยยังคงอยู่ในระดับที่ต้องเฝ้าระวังอย่างต่อเนื่อง
            </span>
          </div>
        </div>
      </div>

      {/* Monthly Comparative Breakdown Bar */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-teal-900/40 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">
            การตรวจพบคัดกรองความดันโลหิตและเบาหวานในแต่ละเดือน (Screening Trends)
          </h3>
          <span className="text-xs text-slate-400">เปรียบเทียบจำนวนผู้มีแนวโน้มเสี่ยง</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyStats} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
              <XAxis dataKey="monthLabel" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#06b6d4',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="hypertensionRiskCount" name="พบเสี่ยงความดันโลหิตสูง (คน)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="diabetesRiskCount" name="พบเสี่ยงเบาหวาน (คน)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="highRiskCount" name="ระดับความเสี่ยงสูงรวม (คน)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
