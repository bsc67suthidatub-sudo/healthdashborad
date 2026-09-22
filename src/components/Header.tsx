import React from 'react';
import { Waves, Activity, RefreshCw, CheckCircle2, UserCheck, Calendar } from 'lucide-react';

interface HeaderProps {
  lastUpdated: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  isLive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  isRefreshing,
  onRefresh,
  isLive,
}) => {
  return (
    <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-teal-950/80 to-cyan-950 border border-teal-500/20 shadow-xl shadow-cyan-950/30 p-6 md:p-8 mb-6">
      {/* Background glowing ocean water effect */}
      <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 -top-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Title and descriptions */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-400/30">
              <Waves className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
              Marine Health Intelligence
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              ระบบสารสนเทศสุขภาพและการเฝ้าระวัง NCDs
            </span>
            {isLive ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ซิงค์ข้อมูลเรียบร้อย
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                ฐานข้อมูลพร้อมใช้งาน
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-200 via-cyan-100 to-sky-300">
              Dashboard เฝ้าระวังความเสี่ยงสุขภาพชุมชน
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed font-light">
            ระบบติดตามผลการคัดกรองภาวะสุขภาพ วิเคราะห์แนวโน้มความเสี่ยงโรคไม่ติดต่อเรื้อรัง (NCDs: เบาหวานและความดันโลหิตสูง)
            ประเมินพฤติกรรมสุขภาพ และวิเคราะห์ความสัมพันธ์ทางสรีรวิทยาเพื่อการวางแผนสุขภาพเชิงรุก
          </p>
        </div>

        {/* Meta Info: Creator & Updated time */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
          {/* Creator Badge */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900/90 border border-teal-500/30 shadow-inner">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-teal-400 font-medium">ผู้จัดทำ Dashboard</div>
              <div className="text-sm font-semibold text-white tracking-wide">สุธิดา ทับเงาะ</div>
            </div>
          </div>

          {/* Date & Refresh */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>อัปเดตข้อมูล: <strong className="text-white font-medium">{lastUpdated}</strong></span>
            </div>

            <button
              id="btn-refresh-data"
              onClick={onRefresh}
              disabled={isRefreshing}
              title="รีเฟรชข้อมูลล่าสุด"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 active:bg-teal-700 disabled:opacity-50 text-white text-xs font-medium transition shadow-lg shadow-teal-900/40 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'กำลังโหลด...' : 'รีเฟรช'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
