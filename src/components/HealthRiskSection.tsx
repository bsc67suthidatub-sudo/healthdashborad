import React from 'react';
import { HealthRecord } from '../types';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  ShieldAlert,
  MapPin,
  Calendar,
  Heart,
  Droplets,
  Scale,
  AlertCircle,
} from 'lucide-react';

interface HealthRiskSectionProps {
  records: HealthRecord[];
}

const RISK_COLORS = {
  ต่ำ: '#10b981', // emerald
  ปานกลาง: '#f59e0b', // amber
  สูง: '#f43f5e', // rose
};

export const HealthRiskSection: React.FC<HealthRiskSectionProps> = ({ records }) => {
  const total = records.length;

  // 1. Field 1: Overall Risk Level Distribution (ระดับความเสี่ยง)
  const riskCounts = {
    ต่ำ: records.filter((r) => r.riskLevel === 'ต่ำ').length,
    ปานกลาง: records.filter((r) => r.riskLevel === 'ปานกลาง').length,
    สูง: records.filter((r) => r.riskLevel === 'สูง').length,
  };

  const riskPieData = [
    { name: 'ความเสี่ยงต่ำ', value: riskCounts['ต่ำ'], color: RISK_COLORS['ต่ำ'] },
    { name: 'ความเสี่ยงปานกลาง', value: riskCounts['ปานกลาง'], color: RISK_COLORS['ปานกลาง'] },
    { name: 'ความเสี่ยงสูง', value: riskCounts['สูง'], color: RISK_COLORS['สูง'] },
  ].filter((d) => d.value > 0);

  // 2. Field 2: Blood Pressure Classification (SBP / DBP)
  const bpClassification = {
    normal: records.filter((r) => r.sbp < 120 && r.dbp < 80).length,
    elevated: records.filter((r) => r.sbp >= 120 && r.sbp < 140 && r.dbp < 90).length,
    stage1or2: records.filter((r) => r.sbp >= 140 || r.dbp >= 90).length,
  };
  const bpChartData = [
    { name: 'ปกติ (<120/<80)', count: bpClassification.normal, fill: '#14b8a6' },
    { name: 'เริ่มเสี่ยง (120-139)', count: bpClassification.elevated, fill: '#f59e0b' },
    { name: 'ความดันสูง (≥140)', count: bpClassification.stage1or2, fill: '#f43f5e' },
  ];

  // 3. Field 3: Fasting Blood Sugar Classification (น้ำตาล_mg_dL)
  const fbsClassification = {
    normal: records.filter((r) => r.bloodSugar < 100).length,
    preDiabetes: records.filter((r) => r.bloodSugar >= 100 && r.bloodSugar < 126).length,
    diabetic: records.filter((r) => r.bloodSugar >= 126).length,
  };
  const fbsChartData = [
    { name: 'ปกติ (<100 mg/dL)', count: fbsClassification.normal, fill: '#06b6d4' },
    { name: 'ภาวะเสี่ยง (100-125)', count: fbsClassification.preDiabetes, fill: '#fbbf24' },
    { name: 'สงสัยเบาหวาน (≥126)', count: fbsClassification.diabetic, fill: '#f43f5e' },
  ];

  // 4. Field 4: BMI Categorization (เกณฑ์เอเชีย: <18.5 ผอม, 18.5-22.9 สมส่วน, 23-24.9 ท้วม, ≥25 อ้วน)
  const bmiClassification = {
    underweight: records.filter((r) => r.bmi < 18.5).length,
    normal: records.filter((r) => r.bmi >= 18.5 && r.bmi < 23).length,
    overweight: records.filter((r) => r.bmi >= 23 && r.bmi < 25).length,
    obese: records.filter((r) => r.bmi >= 25).length,
  };
  const bmiChartData = [
    { name: 'ผอม (<18.5)', count: bmiClassification.underweight, fill: '#94a3b8' },
    { name: 'สมส่วน (18.5-22.9)', count: bmiClassification.normal, fill: '#10b981' },
    { name: 'น้ำหนักเกิน (23-24.9)', count: bmiClassification.overweight, fill: '#38bdf8' },
    { name: 'โรคอ้วน (≥25)', count: bmiClassification.obese, fill: '#f43f5e' },
  ];

  // 5. Special Insight: กลุ่มอายุที่มีความเสี่ยงสูง (Age groups vs High Risk)
  const ageGroups = ['ต่ำกว่า 35 ปี', '35-50 ปี', '51-60 ปี', 'มากกว่า 60 ปี'];
  const ageRiskData = ageGroups.map((group) => {
    let sub = records;
    if (group === 'ต่ำกว่า 35 ปี') sub = records.filter((r) => r.age < 35);
    else if (group === '35-50 ปี') sub = records.filter((r) => r.age >= 35 && r.age <= 50);
    else if (group === '51-60 ปี') sub = records.filter((r) => r.age >= 51 && r.age <= 60);
    else sub = records.filter((r) => r.age > 60);

    const high = sub.filter((r) => r.riskLevel === 'สูง').length;
    const med = sub.filter((r) => r.riskLevel === 'ปานกลาง').length;
    const low = sub.filter((r) => r.riskLevel === 'ต่ำ').length;
    return {
      group,
      total: sub.length,
      high,
      medium: med,
      low,
      highRate: sub.length > 0 ? Number(((high / sub.length) * 100).toFixed(0)) : 0,
    };
  });

  // 6. Special Insight: พื้นที่ที่มีผู้เสี่ยงสูง (Area ranking of high risk)
  const areas = Array.from(new Set(records.map((r) => r.area)));
  const areaRiskData = areas
    .map((area) => {
      const sub = records.filter((r) => r.area === area);
      const high = sub.filter((r) => r.riskLevel === 'สูง').length;
      const medium = sub.filter((r) => r.riskLevel === 'ปานกลาง').length;
      const low = sub.filter((r) => r.riskLevel === 'ต่ำ').length;
      return {
        area,
        total: sub.length,
        high,
        medium,
        low,
        highRiskPct: sub.length > 0 ? Number(((high / sub.length) * 100).toFixed(1)) : 0,
      };
    })
    .sort((a, b) => b.high - a.high || b.highRiskPct - a.highRiskPct);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">การวิเคราะห์ความเสี่ยงสุขภาพ (Health Risk Analysis)</h2>
            <p className="text-xs text-slate-400">
              ประเมินความเสี่ยงโรค NCDs และจัดกลุ่มสถิติตาม 4 มิติทางสุขภาพ พร้อมพื้นที่และกลุ่มอายุเป้าหมาย
            </p>
          </div>
        </div>
      </div>

      {/* Grid 1: The 4 Core Health Risk Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Field 1: ระดับความเสี่ยงรวม (Overall Risk Level) */}
        <div className="rounded-2xl bg-slate-900/90 border border-teal-900/40 p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <h3 className="text-sm font-semibold text-white">
                1. การกระจายตัวของระดับความเสี่ยงรวม (Risk Level)
              </h3>
            </div>
            <span className="text-xs text-slate-400">N = {total} ราย</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            สัดส่วนการจำแนกตามคะแนนความเสี่ยงสะสม (0-7 คะแนน)
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value} คน`, 'จำนวน']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#14b8a6',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-center text-xs">
            <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/40">
              <div className="text-emerald-400 font-bold text-sm">{riskCounts['ต่ำ']} คน</div>
              <div className="text-[11px] text-slate-300">เสี่ยงต่ำ ({total > 0 ? ((riskCounts['ต่ำ'] / total) * 100).toFixed(0) : 0}%)</div>
            </div>
            <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-800/40">
              <div className="text-amber-400 font-bold text-sm">{riskCounts['ปานกลาง']} คน</div>
              <div className="text-[11px] text-slate-300">ปานกลาง ({total > 0 ? ((riskCounts['ปานกลาง'] / total) * 100).toFixed(0) : 0}%)</div>
            </div>
            <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-800/40">
              <div className="text-rose-400 font-bold text-sm">{riskCounts['สูง']} คน</div>
              <div className="text-[11px] text-slate-300">เสี่ยงสูง ({total > 0 ? ((riskCounts['สูง'] / total) * 100).toFixed(0) : 0}%)</div>
            </div>
          </div>
        </div>

        {/* Field 2: ความดันโลหิต (Blood Pressure SBP/DBP) */}
        <div className="rounded-2xl bg-slate-900/90 border border-teal-900/40 p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-semibold text-white">
                2. การคัดกรองความดันโลหิตสูง (Blood Pressure)
              </h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/40">
              เสี่ยงสูง {bpClassification.stage1or2} คน
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            จำแนกตามค่าความดันซิสโตลิก (SBP) และไดแอสโตลิก (DBP)
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bpChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  interval={0}
                />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} คน`, 'จำนวน']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#06b6d4',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {bpChartData.map((entry, index) => (
                    <Cell key={`bp-cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-xs text-slate-400 mt-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              กลุ่มผู้มีความดัน ≥140 mmHg คิดเป็น{' '}
              <strong className="text-rose-300">
                {total > 0 ? ((bpClassification.stage1or2 / total) * 100).toFixed(1) : 0}%
              </strong>{' '}
              ต้องได้รับการติดตามวัดความดันซ้ำและปรับพฤติกรรม
            </span>
          </div>
        </div>

        {/* Field 3: ระดับน้ำตาลในเลือด (Blood Sugar mg/dL) */}
        <div className="rounded-2xl bg-slate-900/90 border border-teal-900/40 p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">
                3. คัดกรองระดับน้ำตาลในเลือด (Fasting Blood Sugar)
              </h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              mg/dL
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            แบ่งตามเกณฑ์การคัดกรองเบาหวานชุมชน (ปกติ / ภาวะเสี่ยง / สงสัยเบาหวาน)
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fbsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} คน`, 'จำนวน']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#14b8a6',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {fbsChartData.map((entry, index) => (
                    <Cell key={`fbs-cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-cyan-400 font-bold">{fbsClassification.normal} คน</div>
              <div className="text-[11px] text-slate-400">ปกติ (&lt;100)</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-amber-400 font-bold">{fbsClassification.preDiabetes} คน</div>
              <div className="text-[11px] text-slate-400">เสี่ยง (100-125)</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-rose-400 font-bold">{fbsClassification.diabetic} คน</div>
              <div className="text-[11px] text-slate-400">สงสัยเบาหวาน (≥126)</div>
            </div>
          </div>
        </div>

        {/* Field 4: ดัชนีมวลกาย (BMI Categorization) */}
        <div className="rounded-2xl bg-slate-900/90 border border-teal-900/40 p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-semibold text-white">
                4. ดัชนีมวลกายและภาวะโภชนาการ (Body Mass Index - BMI)
              </h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
              เกณฑ์เอเชีย
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            สัดส่วนประชากรตามเกณฑ์ดัชนีมวลกายมาตรฐานสาธารณสุข
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bmiChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} คน`, 'จำนวน']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#06b6d4',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {bmiChartData.map((entry, index) => (
                    <Cell key={`bmi-cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-xs text-slate-400 mt-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <span>ผู้ที่มีน้ำหนักเกินและอ้วน (BMI ≥23):</span>
            <span className="text-teal-300 font-bold">
              {bmiClassification.overweight + bmiClassification.obese} คน ({total > 0 ? (((bmiClassification.overweight + bmiClassification.obese) / total) * 100).toFixed(1) : 0}%)
            </span>
          </div>
        </div>
      </div>

      {/* Grid 2: Special Insight Requirements */}
      {/* 1) กลุ่มอายุที่มีความเสี่ยงสูง & 2) พื้นที่ที่มีผู้เสี่ยงสูง */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
        {/* กลุ่มอายุที่มีความเสี่ยงสูง */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-teal-900/40 p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">
                กลุ่มอายุที่มีความเสี่ยงสูง (High Risk by Age Group)
              </h3>
            </div>
            <span className="text-xs font-medium text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              Insight สำคัญ
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            วิเคราะห์ระดับความเสี่ยงจำแนกตามช่วงอายุ เพื่อชี้เป้าหมายการเฝ้าระวังกลุ่มสูงอายุ
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageRiskData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="group" stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                <Bar dataKey="low" name="ความเสี่ยงต่ำ" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="medium" name="ความเสี่ยงปานกลาง" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="high" name="ความเสี่ยงสูง" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <strong className="text-rose-300 font-semibold">ข้อค้นพบ: </strong>
            กลุ่มอายุมากกว่า 50 ปี และวัย 60 ปีขึ้นไป มีสัดส่วนความเสี่ยงสูงหนาแน่นที่สุด (อัตราความดันโลหิตและน้ำตาลสะสมสูง)
          </div>
        </div>

        {/* พื้นที่ที่มีผู้เสี่ยงสูง */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-teal-900/40 p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-semibold text-white">
                พื้นที่ที่มีผู้เสี่ยงสูง (High Risk by Geographic Area)
              </h3>
            </div>
            <span className="text-xs font-medium text-teal-300 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/40">
              การกระจายเชิงพื้นที่
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            การจัดอันดับพื้นที่ตามจำนวนและร้อยละของผู้ที่มีความเสี่ยงสูง
          </p>

          <div className="space-y-3">
            {areaRiskData.map((item, idx) => (
              <div
                key={item.area}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-teal-700/50 transition"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-teal-300 flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-white text-sm">พื้นที่: {item.area}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-rose-400 font-bold">{item.high} คน</span>
                    <span className="text-slate-400 text-[11px] ml-1">
                      (คิดเป็น {item.highRiskPct}% ของพื้นที่)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
                  <div
                    className="bg-rose-500 h-full transition-all duration-500"
                    style={{ width: `${item.total > 0 ? (item.high / item.total) * 100 : 0}%` }}
                    title={`เสี่ยงสูง ${item.high} คน`}
                  />
                  <div
                    className="bg-amber-400 h-full transition-all duration-500"
                    style={{ width: `${item.total > 0 ? (item.medium / item.total) * 100 : 0}%` }}
                    title={`ปานกลาง ${item.medium} คน`}
                  />
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${item.total > 0 ? (item.low / item.total) * 100 : 0}%` }}
                    title={`เสี่ยงต่ำ ${item.low} คน`}
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5">
                  <span>สำรวจทั้งหมด {item.total} คน</span>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400">ต่ำ: {item.low}</span>
                    <span className="text-amber-400">กลาง: {item.medium}</span>
                    <span className="text-rose-400 font-medium">สูง: {item.high}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
