import React from 'react';
import { KPIStats } from '../types';
import {
  Lightbulb,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Building2,
  Sparkles,
} from 'lucide-react';

interface RecommendationsSectionProps {
  kpi: KPIStats;
}

export const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ kpi }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">
            สรุปผลการวิเคราะห์และข้อเสนอแนะเชิงนโยบายสุขภาพ (Policy & Health Recommendations)
          </h2>
          <p className="text-xs text-slate-400">
            มาตรการเชิงรุกด้านสาธารณสุขเพื่อลดความเสี่ยงโรค NCDs และพัฒนาคุณภาพชีวิตประชากร
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-teal-900/40 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-teal-300 font-semibold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>1. มาตรการควบคุมความดันและน้ำตาล</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            จากข้อมูลพบผู้มีแนวโน้มความดันโลหิตสูงถึง <strong className="text-rose-400">{kpi.hypertensionRiskRate}%</strong> และเสี่ยงเบาหวาน{' '}
            <strong className="text-amber-300">{kpi.diabetesRiskRate}%</strong> จึงควรจัดตั้ง “คลินิกชะลอไตและปรับเปลี่ยนพฤติกรรม NCDs” ประจำรพ.สต. เพื่อตรวจยืนยันและควบคุมค่าน้ำตาลสะสม (HbA1c) ให้อยู่ในเกณฑ์ปลอดภัย
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-teal-900/40 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm">
            <Building2 className="w-5 h-5" />
            <span>2. การเจาะจงเชิงพื้นที่เสี่ยงสูง</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            พื้นที่ที่มีผู้เสี่ยงสูงหนาแน่น (โดยเฉพาะพื้นที่ตะวันออกและใต้) ควรมี อสม. ประจำครอบครัวเข้าตรวจเยี่ยมบ้าน สัปดาห์ละ 1 ครั้ง เพื่อวัดความดันโลหิตซ้ำ แนะนำการจำกัดโซเดียม และแจกเครื่องวัดความดันประจำชุมชน
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-teal-900/40 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-rose-300 font-semibold text-sm">
            <Sparkles className="w-5 h-5" />
            <span>3. ปรับเปลี่ยนพฤติกรรม 3อ. 2ส.</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            พบความสัมพันธ์ชัดเจนว่าประชากรที่ไม่ออกกำลังกายและมีพฤติกรรมสูบบุหรี่หรือดื่มแอลกอฮอล์มีความเสี่ยงสูงถึง 100% จึงต้องส่งเสริมพื้นที่ออกกำลังกายสาธารณะ กิจกรรมแอโรบิกชุมชน และคลินิกเลิกบุหรี่/สุราเชิงรุก
          </p>
        </div>
      </div>

      {/* Action Plan Timeline */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950/40 border border-teal-900/50 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <FileText className="w-4 h-4 text-teal-400" />
            <span>แผนปฏิบัติการสาธารณสุขชุมชน (Surveillance Action Timeline)</span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
            ไตรมาสที่ 2 ปี 2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-teal-400 uppercase tracking-wider">ระยะเร่งด่วน (1 - 2 สัปดาห์)</div>
            <h4 className="text-sm font-semibold text-white">ติดตามกลุ่มเสี่ยงสูง ({kpi.highRiskCount} คน)</h4>
            <p className="text-xs text-slate-400">
              ติดต่อและส่งต่อผู้มีค่าความดัน SBP &gt;150 หรือน้ำตาล &gt;130 mg/dL เข้าสู่ระบบการรักษาของโรงพยาบาลแม่ข่ายทันที
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">ระยะกลาง (1 - 3 เดือน)</div>
            <h4 className="text-sm font-semibold text-white">จัดตั้งชมรมสร้างเสริมสุขภาพ</h4>
            <p className="text-xs text-slate-400">
              จัดโปรแกรม “ลดเค็ม ลดหวาน ลดโรค” ประจำหมู่บ้าน และติดตามน้ำหนักตัวของผู้มีภาวะ BMI &gt;25 เพื่อลดความเสี่ยงแทรกซ้อน
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">ระยะต่อเนื่อง (6 เดือน)</div>
            <h4 className="text-sm font-semibold text-white">ประเมินผลรอบคัดกรองซ้ำ</h4>
            <p className="text-xs text-slate-400">
              คัดกรองสุขภาพซ้ำในไตรมาสที่ 3 และ 4 เพื่อวัดอัตราการลดลงของคะแนนความเสี่ยงสะสมในระดับประชากร
            </p>
          </div>
        </div>

        {/* Creator signature block */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-teal-400" />
            <span>จัดทำและรายงานโดย: <strong className="text-white">สุธิดา ทับเงาะ</strong></span>
          </div>
          <div>
            <span>ระบบสารสนเทศสุขภาพชุมชน • ปรับปรุงข้อมูลล่าสุดเมื่อ {new Date().toLocaleDateString('th-TH')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
