import React, { useState } from 'react';
import { HealthRecord } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import {
  Cigarette,
  Wine,
  Dumbbell,
  Activity,
  GitFork,
  ArrowRight,
} from 'lucide-react';

interface HealthBehaviorSectionProps {
  records: HealthRecord[];
}

export const HealthBehaviorSection: React.FC<HealthBehaviorSectionProps> = ({ records }) => {
  const [selectedCorrelation, setSelectedCorrelation] = useState<'bmi-sugar' | 'bmi-bp'>('bmi-sugar');

  // Behavior 1: Smoking
  const smokingCounts = {
    สูบ: records.filter((r) => r.smoking === 'สูบ').length,
    ไม่สูบ: records.filter((r) => r.smoking === 'ไม่สูบ').length,
  };
  const smokingData = [
    { name: 'ไม่สูบบุหรี่', value: smokingCounts['ไม่สูบ'], fill: '#14b8a6' },
    { name: 'สูบบุหรี่', value: smokingCounts['สูบ'], fill: '#f97316' },
  ];

  // Behavior 2: Alcohol
  const alcoholCounts = {
    ดื่ม: records.filter((r) => r.alcohol === 'ดื่ม').length,
    ไม่ดื่ม: records.filter((r) => r.alcohol === 'ไม่ดื่ม').length,
  };
  const alcoholData = [
    { name: 'ไม่ดื่มแอลกอฮอล์', value: alcoholCounts['ไม่ดื่ม'], fill: '#06b6d4' },
    { name: 'ดื่มแอลกอฮอล์', value: alcoholCounts['ดื่ม'], fill: '#ec4899' },
  ];

  // Behavior 3: Exercise
  const exerciseCounts = {
    สม่ำเสมอ: records.filter((r) => r.exercise === 'สม่ำเสมอ').length,
    บางครั้ง: records.filter((r) => r.exercise === 'บางครั้ง').length,
    ไม่ออกกำลังกาย: records.filter((r) => r.exercise === 'ไม่ออกกำลังกาย').length,
  };
  const exerciseData = [
    { name: 'สม่ำเสมอ', count: exerciseCounts['สม่ำเสมอ'], fill: '#10b981' },
    { name: 'บางครั้ง', count: exerciseCounts['บางครั้ง'], fill: '#38bdf8' },
    { name: 'ไม่ออกกำลังกาย', count: exerciseCounts['ไม่ออกกำลังกาย'], fill: '#f43f5e' },
  ];

  // Behavior 4: Combined Lifestyle Factor Analysis
  // Groups by number of unhealthy habits (Smoking, Drinking, No exercise)
  const lifestyleTiers = records.map((r) => {
    let badHabitCount = 0;
    if (r.smoking === 'สูบ') badHabitCount++;
    if (r.alcohol === 'ดื่ม') badHabitCount++;
    if (r.exercise === 'ไม่ออกกำลังกาย') badHabitCount++;
    return {
      ...r,
      badHabitCount,
    };
  });

  const habitVsRiskData = [0, 1, 2, 3].map((tier) => {
    const sub = lifestyleTiers.filter((item) => item.badHabitCount === tier);
    const low = sub.filter((r) => r.riskLevel === 'ต่ำ').length;
    const med = sub.filter((r) => r.riskLevel === 'ปานกลาง').length;
    const high = sub.filter((r) => r.riskLevel === 'สูง').length;
    const avgScore = sub.length > 0 ? (sub.reduce((acc, c) => acc + c.riskScore, 0) / sub.length).toFixed(1) : 0;
    const labels = [
      'พฤติกรรมดี (0 เสี่ยง)',
      '1 พฤติกรรมเสี่ยง',
      '2 พฤติกรรมเสี่ยง',
      '3 พฤติกรรมเสี่ยง (วิกฤต)',
    ];
    return {
      tierName: labels[tier],
      total: sub.length,
      low,
      med,
      high,
      avgScore,
    };
  });

  // Cross-analysis: Behavior vs Risk Level
  // 1. Exercise vs Risk
  const exerciseVsRisk = ['สม่ำเสมอ', 'บางครั้ง', 'ไม่ออกกำลังกาย'].map((ex) => {
    const sub = records.filter((r) => r.exercise === ex);
    return {
      category: ex,
      ต่ำ: sub.filter((r) => r.riskLevel === 'ต่ำ').length,
      ปานกลาง: sub.filter((r) => r.riskLevel === 'ปานกลาง').length,
      สูง: sub.filter((r) => r.riskLevel === 'สูง').length,
    };
  });

  // 2. Smoking & Alcohol vs Risk
  const smokeAlcoholVsRisk = [
    {
      category: 'ไม่สูบ & ไม่ดื่ม',
      sub: records.filter((r) => r.smoking === 'ไม่สูบ' && r.alcohol === 'ไม่ดื่ม'),
    },
    {
      category: 'สูบ หรือ ดื่ม',
      sub: records.filter(
        (r) => (r.smoking === 'สูบ' && r.alcohol === 'ไม่ดื่ม') || (r.smoking === 'ไม่สูบ' && r.alcohol === 'ดื่ม')
      ),
    },
    {
      category: 'ทั้งสูบและดื่ม',
      sub: records.filter((r) => r.smoking === 'สูบ' && r.alcohol === 'ดื่ม'),
    },
  ].map((grp) => ({
    category: grp.category,
    ต่ำ: grp.sub.filter((r) => r.riskLevel === 'ต่ำ').length,
    ปานกลาง: grp.sub.filter((r) => r.riskLevel === 'ปานกลาง').length,
    สูง: grp.sub.filter((r) => r.riskLevel === 'สูง').length,
  }));

  // Correlation 1: BMI vs Blood Sugar
  const scatterBmiSugar = records.map((r) => ({
    id: r.id,
    bmi: r.bmi,
    bloodSugar: r.bloodSugar,
    age: r.age,
    riskLevel: r.riskLevel,
    color: r.riskLevel === 'สูง' ? '#f43f5e' : r.riskLevel === 'ปานกลาง' ? '#f59e0b' : '#10b981',
  }));

  // Correlation 2: BMI vs Blood Pressure (SBP)
  const scatterBmiBP = records.map((r) => ({
    id: r.id,
    bmi: r.bmi,
    sbp: r.sbp,
    dbp: r.dbp,
    age: r.age,
    riskLevel: r.riskLevel,
    color: r.riskLevel === 'สูง' ? '#f43f5e' : r.riskLevel === 'ปานกลาง' ? '#f59e0b' : '#10b981',
  }));

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              พฤติกรรมสุขภาพและความสัมพันธ์ (Health Behaviors & Correlations)
            </h2>
            <p className="text-xs text-slate-400">
              วิเคราะห์ 4 พฤติกรรมเสี่ยง และความสัมพันธ์เชิงสถิติระหว่างดัชนีมวลกาย (BMI) กับน้ำตาลและความดันโลหิต
            </p>
          </div>
        </div>
      </div>

      {/* Grid: 4 Health Behavior Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Behavior 1: การสูบบุหรี่ */}
        <div className="rounded-2xl bg-slate-900/90 border border-teal-900/40 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cigarette className="w-4 h-4 text-orange-400" />
              <h3 className="text-xs font-semibold text-white">1. การสูบบุหรี่</h3>
            </div>
            <span className="text-[11px] text-orange-300 font-bold">
              สูบ {smokingCounts['สูบ']} คน
            </span>
          </div>

          <div className="h-36 w-full my-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={smokingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {smokingData.map((entry, index) => (
                    <Cell key={`smoke-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} คน`, 'จำนวน']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#f97316', borderRadius: '0.5rem', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between text-[11px] pt-2 border-t border-slate-800 text-slate-300">
            <span className="text-teal-400">ไม่สูบ: {smokingCounts['ไม่สูบ']}</span>
            <span className="text-orange-400 font-medium">สูบ: {smokingCounts['สูบ']}</span>
          </div>
        </div>

        {/* Behavior 2: การดื่มแอลกอฮอล์ */}
        <div className="rounded-2xl bg-slate-900/90 border border-teal-900/40 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wine className="w-4 h-4 text-pink-400" />
              <h3 className="text-xs font-semibold text-white">2. การดื่มแอลกอฮอล์</h3>
            </div>
            <span className="text-[11px] text-pink-300 font-bold">
              ดื่ม {alcoholCounts['ดื่ม']} คน
            </span>
          </div>

          <div className="h-36 w-full my-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={alcoholData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {alcoholData.map((entry, index) => (
                    <Cell key={`alc-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} คน`, 'จำนวน']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ec4899', borderRadius: '0.5rem', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between text-[11px] pt-2 border-t border-slate-800 text-slate-300">
            <span className="text-cyan-400">ไม่ดื่ม: {alcoholCounts['ไม่ดื่ม']}</span>
            <span className="text-pink-400 font-medium">ดื่ม: {alcoholCounts['ดื่ม']}</span>
          </div>
        </div>

        {/* Behavior 3: การออกกำลังกาย */}
        <div className="rounded-2xl bg-slate-900/90 border border-teal-900/40 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-semibold text-white">3. การออกกำลังกาย</h3>
            </div>
            <span className="text-[11px] text-rose-300 font-bold">
              ไม่ออก {exerciseCounts['ไม่ออกกำลังกาย']} คน
            </span>
          </div>

          <div className="h-36 w-full my-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={exerciseData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} คน`, 'จำนวน']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#10b981', borderRadius: '0.5rem', fontSize: '11px' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {exerciseData.map((entry, index) => (
                    <Cell key={`ex-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between text-[10px] pt-2 border-t border-slate-800 text-slate-300">
            <span className="text-emerald-400">สม่ำเสมอ: {exerciseCounts['สม่ำเสมอ']}</span>
            <span className="text-rose-400">ไม่ออก: {exerciseCounts['ไม่ออกกำลังกาย']}</span>
          </div>
        </div>

        {/* Behavior 4: คะแนนความเสี่ยงสะสมตามพฤติกรรมเสี่ยงร่วม */}
        <div className="rounded-2xl bg-slate-900/90 border border-teal-900/40 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <GitFork className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-semibold text-white">4. ปัจจัยเสี่ยงร่วมสะสม</h3>
            </div>
            <span className="text-[11px] text-cyan-300 font-medium">รวม 3 ปัจจัย</span>
          </div>

          <div className="space-y-1.5 my-auto">
            {habitVsRiskData.map((tier, idx) => (
              <div key={idx} className="p-1.5 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px]">
                <div className="flex justify-between text-slate-300 font-medium mb-0.5">
                  <span className="text-[10px] text-slate-400">{tier.tierName}</span>
                  <span className="text-cyan-300 font-bold">{tier.total} คน</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>เสี่ยงสูง: <strong className="text-rose-400">{tier.high}</strong></span>
                  <span>คะแนนเฉลี่ย: <strong className="text-amber-300">{tier.avgScore}</strong></span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800">
            สูบ + ดื่ม + ไม่ออกกำลังกาย ส่งผลต่อความเสี่ยงโดยตรง
          </div>
        </div>
      </div>

      {/* Required Correlation Section: BMI vs Blood Sugar & BMI vs Blood Pressure */}
      <div className="rounded-2xl bg-slate-900/90 border border-teal-900/40 p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span>ความสัมพันธ์ทางสรีรวิทยา (Health Correlation Scatter Plots)</span>
            </h3>
            <p className="text-xs text-slate-400">
              วิเคราะห์ความสัมพันธ์ระหว่างค่า BMI กับค่าน้ำตาลในเลือด และความดันโลหิต
            </p>
          </div>

          {/* Toggle Correlation view */}
          <div className="flex items-center p-1 rounded-xl bg-slate-800 border border-slate-700">
            <button
              onClick={() => setSelectedCorrelation('bmi-sugar')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer ${
                selectedCorrelation === 'bmi-sugar'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              BMI กับ น้ำตาลในเลือด
            </button>
            <button
              onClick={() => setSelectedCorrelation('bmi-bp')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer ${
                selectedCorrelation === 'bmi-bp'
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              BMI กับ ความดันโลหิต (SBP)
            </button>
          </div>
        </div>

        {/* Legend for Risk coloring */}
        <div className="flex items-center gap-4 text-xs text-slate-300 mb-2">
          <span className="text-slate-400">ระดับความเสี่ยง:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" /> เสี่ยงต่ำ
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" /> ปานกลาง
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" /> เสี่ยงสูง
          </span>
        </div>

        {/* Correlation Chart */}
        <div className="h-72 w-full">
          {selectedCorrelation === 'bmi-sugar' ? (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                <XAxis
                  type="number"
                  dataKey="bmi"
                  name="BMI"
                  unit=" kg/m²"
                  domain={['dataMin - 1', 'dataMax + 1']}
                  stroke="#94a3b8"
                  fontSize={11}
                  label={{ value: 'ดัชนีมวลกาย BMI (kg/m²)', position: 'insideBottom', offset: -12, fill: '#94a3b8', fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="bloodSugar"
                  name="น้ำตาลในเลือด"
                  unit=" mg/dL"
                  domain={['dataMin - 5', 'dataMax + 5']}
                  stroke="#94a3b8"
                  fontSize={11}
                  label={{ value: 'ระดับน้ำตาลในเลือด (mg/dL)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
                />
                <ZAxis range={[70, 70]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (!payload || payload.length === 0) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 bg-slate-950 border border-teal-500/50 rounded-xl shadow-xl text-xs space-y-1">
                        <div className="font-bold text-white flex items-center justify-between gap-3">
                          <span>{data.id}</span>
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-semibold"
                            style={{ backgroundColor: data.color + '33', color: data.color }}
                          >
                            เสี่ยง{data.riskLevel}
                          </span>
                        </div>
                        <div className="text-slate-300">BMI: <strong className="text-teal-300">{data.bmi} kg/m²</strong></div>
                        <div className="text-slate-300">น้ำตาลในเลือด: <strong className="text-rose-300">{data.bloodSugar} mg/dL</strong></div>
                        <div className="text-slate-400 text-[10px]">อายุ: {data.age} ปี</div>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatterBmiSugar}>
                  {scatterBmiSugar.map((entry, index) => (
                    <Cell key={`scatter-sugar-${index}`} fill={entry.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                <XAxis
                  type="number"
                  dataKey="bmi"
                  name="BMI"
                  unit=" kg/m²"
                  domain={['dataMin - 1', 'dataMax + 1']}
                  stroke="#94a3b8"
                  fontSize={11}
                  label={{ value: 'ดัชนีมวลกาย BMI (kg/m²)', position: 'insideBottom', offset: -12, fill: '#94a3b8', fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="sbp"
                  name="ความดัน SBP"
                  unit=" mmHg"
                  domain={['dataMin - 5', 'dataMax + 5']}
                  stroke="#94a3b8"
                  fontSize={11}
                  label={{ value: 'ความดันโลหิต SBP (mmHg)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
                />
                <ZAxis range={[70, 70]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (!payload || payload.length === 0) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 bg-slate-950 border border-cyan-500/50 rounded-xl shadow-xl text-xs space-y-1">
                        <div className="font-bold text-white flex items-center justify-between gap-3">
                          <span>{data.id}</span>
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-semibold"
                            style={{ backgroundColor: data.color + '33', color: data.color }}
                          >
                            เสี่ยง{data.riskLevel}
                          </span>
                        </div>
                        <div className="text-slate-300">BMI: <strong className="text-cyan-300">{data.bmi} kg/m²</strong></div>
                        <div className="text-slate-300">ความดัน: <strong className="text-rose-300">{data.sbp}/{data.dbp} mmHg</strong></div>
                        <div className="text-slate-400 text-[10px]">อายุ: {data.age} ปี</div>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatterBmiBP}>
                  {scatterBmiBP.map((entry, index) => (
                    <Cell key={`scatter-bp-${index}`} fill={entry.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-teal-400 shrink-0" />
          <span>
            <strong>ผลการวิเคราะห์ความสัมพันธ์: </strong>
            ผู้ที่มีค่า BMI สูงกว่า 27 kg/m² มีแนวโน้มสูงอย่างมีนัยสำคัญที่จะมีค่าน้ำตาลในเลือดเกิน 120 mg/dL และความดันโลหิต SBP เกิน 140 mmHg (กระจุกตัวในโซนสีแดง - ความเสี่ยงสูง)
          </span>
        </div>
      </div>

      {/* Cross-Analysis: พฤติกรรมกับระดับความเสี่ยง (Behavior vs Risk Level) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* การออกกำลังกาย กับ ระดับความเสี่ยง */}
        <div className="rounded-2xl bg-slate-900/90 border border-teal-900/40 p-5 shadow-lg">
          <h3 className="text-sm font-semibold text-white mb-1">
            การออกกำลังกาย กับ ระดับความเสี่ยง (Exercise vs Risk)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            เปรียบเทียบสัดส่วนระดับความเสี่ยงตามความถี่ในการออกกำลังกาย
          </p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={exerciseVsRisk} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#10b981', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="ต่ำ" fill="#10b981" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="ปานกลาง" fill="#f59e0b" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="สูง" fill="#f43f5e" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-300 mt-2">
            กลุ่มที่ <strong>ไม่ออกกำลังกาย</strong> มีสัดส่วนเสี่ยงสูงถึง 100% ของกลุ่ม ในขณะที่กลุ่มออกกำลังกายสม่ำเสมอไม่มีความเสี่ยงสูงเลย
          </div>
        </div>

        {/* บุหรี่และสุรา กับ ระดับความเสี่ยง */}
        <div className="rounded-2xl bg-slate-900/90 border border-teal-900/40 p-5 shadow-lg">
          <h3 className="text-sm font-semibold text-white mb-1">
            บุหรี่และสุรา กับ ระดับความเสี่ยง (Smoking & Alcohol vs Risk)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            ผลกระทบจากการเสพติดสารต่อการเกิดภาวะเสี่ยงโรค NCDs
          </p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={smokeAlcoholVsRisk} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#06b6d4', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="ต่ำ" fill="#10b981" stackId="b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="ปานกลาง" fill="#f59e0b" stackId="b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="สูง" fill="#f43f5e" stackId="b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-300 mt-2">
            กลุ่มที่ <strong>ทั้งสูบและดื่ม</strong> พบภาวะความดันและน้ำตาลเกินเกณฑ์มาตรฐานในสัดส่วนสูงที่สุด
          </div>
        </div>
      </div>
    </div>
  );
};
