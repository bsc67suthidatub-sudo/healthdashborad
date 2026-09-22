import React, { useState, useMemo } from 'react';
import { HealthRecord } from '../types';
import {
  Table,
  Search,
  Download,
  AlertTriangle,
  User,
  Heart,
  Droplets,
  Scale,
  Activity,
  X,
  Eye,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface DataTableSectionProps {
  records: HealthRecord[];
}

export const DataTableSection: React.FC<DataTableSectionProps> = ({ records }) => {
  const [activeCohortFilter, setActiveCohortFilter] = useState<'all' | 'high-risk' | 'diabetes' | 'hypertension'>('high-risk');
  const [searchLocal, setSearchLocal] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<HealthRecord | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Deep Dive Focus: Filtering by targeted clinical cohort
  const cohortFilteredRecords = useMemo(() => {
    let list = records;
    if (activeCohortFilter === 'high-risk') {
      list = list.filter((r) => r.riskLevel === 'สูง');
    } else if (activeCohortFilter === 'diabetes') {
      list = list.filter((r) => r.diabetesScreening === 'มีแนวโน้ม/เสี่ยง' || r.bloodSugar >= 126);
    } else if (activeCohortFilter === 'hypertension') {
      list = list.filter((r) => r.hypertensionScreening === 'มีแนวโน้ม/เสี่ยง' || r.sbp >= 140);
    }

    if (searchLocal.trim() !== '') {
      const q = searchLocal.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.area.toLowerCase().includes(q) ||
          r.gender.toLowerCase().includes(q) ||
          r.riskLevel.toLowerCase().includes(q)
      );
    }

    return list;
  }, [records, activeCohortFilter, searchLocal]);

  // Pagination
  const totalPages = Math.ceil(cohortFilteredRecords.length / pageSize) || 1;
  const paginatedRecords = cohortFilteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'รหัสบุคคล',
      'วันที่คัดกรอง',
      'พื้นที่',
      'เพศ',
      'อายุ',
      'ส่วนสูง_cm',
      'น้ำหนัก_kg',
      'BMI',
      'SBP_mmHg',
      'DBP_mmHg',
      'ชีพจร_bpm',
      'น้ำตาล_mg_dL',
      'สูบบุหรี่',
      'ดื่มแอลกอฮอล์',
      'การออกกำลังกาย',
      'เบาหวาน_คัดกรอง',
      'ความดันโลหิตสูง_คัดกรอง',
      'คะแนนความเสี่ยง',
      'ระดับความเสี่ยง',
      'เดือน',
    ];

    const rows = cohortFilteredRecords.map((r) => [
      r.id,
      r.date,
      r.area,
      r.gender,
      r.age,
      r.height,
      r.weight,
      r.bmi,
      r.sbp,
      r.dbp,
      r.pulse,
      r.bloodSugar,
      r.smoking,
      r.alcohol,
      r.exercise,
      r.diabetesScreening,
      r.hypertensionScreening,
      r.riskScore,
      r.riskLevel,
      r.month,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `รายงานคัดกรองสุขภาพ_${activeCohortFilter}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Section Header & Deep Dive Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border border-rose-500/30 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>ประเด็นเชิงลึกด้านสุขภาพ (Clinical Deep-Dive Surveillance)</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              กลุ่มเฝ้าระวังผู้มีความเสี่ยงสูงต่อภาวะแทรกซ้อน NCDs เร่งด่วน
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              ระบบแสดงข้อมูลเชิงลึกรายบุคคล พร้อมระบบ <strong>Conditional Formatting (แถบสีเตือนภัย)</strong>{' '}
              เพื่อช่วยให้บุคลากรสาธารณสุขมองเห็นค่าวิกฤต (ความดัน &gt;140, น้ำตาล &gt;125, BMI &gt;25) ได้อย่างทันท่วงที
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-lg shadow-teal-950/40 transition cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>ส่งออกข้อมูล (CSV)</span>
          </button>
        </div>

        {/* Cohort selector pills */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800/80 overflow-x-auto pb-1">
          <span className="text-xs text-slate-400 font-medium shrink-0">เลือกกลุ่มข้อมูลเชิงลึก:</span>
          <button
            onClick={() => {
              setActiveCohortFilter('high-risk');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer shrink-0 ${
              activeCohortFilter === 'high-risk'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 font-semibold'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            🚨 เฉพาะกลุ่มเสี่ยงสูงเร่งด่วน ({records.filter((r) => r.riskLevel === 'สูง').length} ราย)
          </button>
          <button
            onClick={() => {
              setActiveCohortFilter('diabetes');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer shrink-0 ${
              activeCohortFilter === 'diabetes'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-semibold'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            🩸 กลุ่มเสี่ยงเบาหวาน (FBS ≥126)
          </button>
          <button
            onClick={() => {
              setActiveCohortFilter('hypertension');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer shrink-0 ${
              activeCohortFilter === 'hypertension'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-semibold'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            💓 กลุ่มเสี่ยงความดันโลหิตสูง (SBP ≥140)
          </button>
          <button
            onClick={() => {
              setActiveCohortFilter('all');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer shrink-0 ${
              activeCohortFilter === 'all'
                ? 'bg-teal-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            แสดงผลรวมทั้งหมด ({records.length} ราย)
          </button>
        </div>
      </div>

      {/* Conditional Formatting Guide Banner */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-slate-400 font-medium">คำอธิบายแถบสีข้อมูล (Conditional Formatting Legend):</span>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-rose-300 font-medium">เสี่ยงสูง / ผิดปกติรุนแรง</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-amber-300 font-medium">เริ่มมีแนวโน้มเสี่ยง / เฝ้าระวัง</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
            <span className="text-teal-300 font-medium">เกณฑ์ปกติ / สุขภาพดี</span>
          </div>
        </div>
      </div>

      {/* Table search & count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาในตารางเชิงลึก..."
            value={searchLocal}
            onChange={(e) => {
              setSearchLocal(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
          />
        </div>

        <div className="text-xs text-slate-400">
          แสดง <strong className="text-teal-300">{cohortFilteredRecords.length}</strong> รายการ (หน้า {currentPage}/{totalPages})
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">รหัสบุคคล</th>
                <th className="py-3.5 px-3 font-semibold">วันที่</th>
                <th className="py-3.5 px-3 font-semibold">พื้นที่</th>
                <th className="py-3.5 px-3 font-semibold">เพศ / อายุ</th>
                <th className="py-3.5 px-3 font-semibold text-center">BMI (kg/m²)</th>
                <th className="py-3.5 px-3 font-semibold text-center">ความดัน (SBP/DBP)</th>
                <th className="py-3.5 px-3 font-semibold text-center">น้ำตาล (mg/dL)</th>
                <th className="py-3.5 px-3 font-semibold text-center">พฤติกรรม (บุหรี่/สุรา/ออกกำลัง)</th>
                <th className="py-3.5 px-3 font-semibold text-center">คะแนน</th>
                <th className="py-3.5 px-3 font-semibold text-center">ระดับความเสี่ยง</th>
                <th className="py-3.5 px-4 font-semibold text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 text-sm">
                    ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((item) => {
                  const isHighRisk = item.riskLevel === 'สูง';
                  const isMediumRisk = item.riskLevel === 'ปานกลาง';
                  const isHighBP = item.sbp >= 140 || item.dbp >= 90;
                  const isWarningBP = (item.sbp >= 120 && item.sbp < 140) || (item.dbp >= 80 && item.dbp < 90);
                  const isHighSugar = item.bloodSugar >= 126;
                  const isWarningSugar = item.bloodSugar >= 100 && item.bloodSugar < 126;
                  const isObese = item.bmi >= 25;
                  const isOverweight = item.bmi >= 23 && item.bmi < 25;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedPatient(item)}
                      className={`hover:bg-slate-800/60 transition cursor-pointer ${
                        isHighRisk ? 'bg-rose-950/15' : ''
                      }`}
                    >
                      {/* รหัสบุคคล */}
                      <td className="py-3 px-4 font-bold text-teal-300">
                        <div className="flex items-center gap-1.5">
                          {isHighRisk && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                          )}
                          <span>{item.id}</span>
                        </div>
                      </td>

                      {/* วันที่ */}
                      <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                        {item.date}
                      </td>

                      {/* พื้นที่ */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                          {item.area}
                        </span>
                      </td>

                      {/* เพศ / อายุ */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-medium text-white">{item.gender}</span>
                        <span className="text-slate-400 ml-1">({item.age} ปี)</span>
                      </td>

                      {/* BMI (Conditional Formatting) */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md font-semibold text-xs ${
                            isObese
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : isOverweight
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {item.bmi}
                        </span>
                      </td>

                      {/* ความดัน SBP/DBP (Conditional Formatting) */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md font-semibold text-xs ${
                            isHighBP
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                              : isWarningBP
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                          }`}
                        >
                          {item.sbp}/{item.dbp}
                        </span>
                      </td>

                      {/* น้ำตาลในเลือด (Conditional Formatting) */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md font-semibold text-xs ${
                            isHighSugar
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                              : isWarningSugar
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}
                        >
                          {item.bloodSugar}
                        </span>
                      </td>

                      {/* พฤติกรรม */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1 text-[10px]">
                          <span
                            className={`px-1.5 py-0.5 rounded ${
                              item.smoking === 'สูบ'
                                ? 'bg-orange-500/20 text-orange-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {item.smoking === 'สูบ' ? 'สูบ' : 'ไม่สูบ'}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded ${
                              item.alcohol === 'ดื่ม'
                                ? 'bg-pink-500/20 text-pink-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {item.alcohol === 'ดื่ม' ? 'ดื่ม' : 'ไม่ดื่ม'}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded ${
                              item.exercise === 'ไม่ออกกำลังกาย'
                                ? 'bg-rose-500/20 text-rose-300'
                                : item.exercise === 'สม่ำเสมอ'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {item.exercise}
                          </span>
                        </div>
                      </td>

                      {/* คะแนนความเสี่ยง */}
                      <td className="py-3 px-3 text-center font-bold text-slate-200">
                        {item.riskScore}
                      </td>

                      {/* ระดับความเสี่ยง (Conditional Badges) */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isHighRisk
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                              : isMediumRisk
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {item.riskLevel}
                        </span>
                      </td>

                      {/* รายละเอียด */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPatient(item);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-teal-600 text-slate-300 hover:text-white transition cursor-pointer"
                          title="ดูการวินิจฉัยเชิงลึก"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="py-3 px-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            แสดงรายการที่ {(currentPage - 1) * pageSize + 1} ถึง{' '}
            {Math.min(currentPage * pageSize, cohortFilteredRecords.length)} จากทั้งหมด{' '}
            {cohortFilteredRecords.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-white font-medium px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-teal-500/40 p-6 shadow-2xl shadow-cyan-950/60 text-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">บัตรประวัติสุขภาพรายบุคคล</div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>รหัสบุคคล: {selectedPatient.id}</span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        selectedPatient.riskLevel === 'สูง'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                          : selectedPatient.riskLevel === 'ปานกลาง'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                      }`}
                    >
                      ความเสี่ยง{selectedPatient.riskLevel}
                    </span>
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Physiological Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400">พื้นที่ / วันที่คัดกรอง</div>
                <div className="text-sm font-semibold text-white mt-0.5">{selectedPatient.area}</div>
                <div className="text-[10px] text-slate-500">{selectedPatient.date}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400">เพศ / อายุ</div>
                <div className="text-sm font-semibold text-white mt-0.5">
                  {selectedPatient.gender}, {selectedPatient.age} ปี
                </div>
                <div className="text-[10px] text-slate-500">
                  {selectedPatient.height} ซม. / {selectedPatient.weight} กก.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400">ดัชนีมวลกาย (BMI)</div>
                <div className="text-base font-bold text-cyan-300 mt-0.5">
                  {selectedPatient.bmi} <span className="text-xs font-normal">kg/m²</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {selectedPatient.bmi >= 25 ? 'ภาวะโรคอ้วน' : selectedPatient.bmi >= 23 ? 'น้ำหนักเกิน' : 'สมส่วน'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400">ความดันโลหิต (SBP/DBP)</div>
                <div className="text-base font-bold text-rose-300 mt-0.5">
                  {selectedPatient.sbp}/{selectedPatient.dbp} <span className="text-xs font-normal">mmHg</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {selectedPatient.sbp >= 140 ? 'เสี่ยงความดันโลหิตสูง' : 'ระดับปกติ'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400">ระดับน้ำตาลในเลือด</div>
                <div className="text-base font-bold text-amber-300 mt-0.5">
                  {selectedPatient.bloodSugar} <span className="text-xs font-normal">mg/dL</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {selectedPatient.bloodSugar >= 126 ? 'สงสัยเบาหวาน' : selectedPatient.bloodSugar >= 100 ? 'เสี่ยงเบาหวาน' : 'ปกติ'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400">อัตราชีพจร / คะแนนเสี่ยง</div>
                <div className="text-base font-bold text-teal-300 mt-0.5">
                  {selectedPatient.pulse} <span className="text-xs font-normal">bpm</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  คะแนนเสี่ยงสะสม: <strong>{selectedPatient.riskScore}</strong> / 7
                </div>
              </div>
            </div>

            {/* Lifestyle Summary */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 mb-4">
              <h4 className="text-xs font-semibold text-teal-300">พฤติกรรมและการใช้ชีวิต</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-slate-400">สูบบุหรี่: </span>
                  <span className={selectedPatient.smoking === 'สูบ' ? 'text-rose-400 font-semibold' : 'text-slate-200'}>
                    {selectedPatient.smoking}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">ดื่มแอลกอฮอล์: </span>
                  <span className={selectedPatient.alcohol === 'ดื่ม' ? 'text-rose-400 font-semibold' : 'text-slate-200'}>
                    {selectedPatient.alcohol}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">การออกกำลังกาย: </span>
                  <span className={selectedPatient.exercise === 'ไม่ออกกำลังกาย' ? 'text-rose-400 font-semibold' : 'text-emerald-400'}>
                    {selectedPatient.exercise}
                  </span>
                </div>
              </div>
            </div>

            {/* Clinical Recommendation Advice */}
            <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-800/60 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-teal-300 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>คำแนะนำการดูแลสุขภาพเฉพาะบุคคล:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {selectedPatient.riskLevel === 'สูง'
                  ? 'แนะนำส่งต่อพบแพทย์เพื่อตรวจยืนยันโรคความดันโลหิตสูง/เบาหวาน นัดติดตามผลค่าน้ำตาลสะสม (HbA1c) ปรับลดอาหารเค็มและหวาน และเข้าโปรแกรมปรับเปลี่ยนพฤติกรรมเร่งด่วน'
                  : selectedPatient.riskLevel === 'ปานกลาง'
                  ? 'แนะนำให้เพิ่มการออกกำลังกายแบบแอโรบิกอย่างน้อย 150 นาทีต่อสัปดาห์ ลดการดื่มเครื่องดื่มแอลกอฮอล์ และตรวจวัดความดันโลหิตซ้ำใน 3 เดือน'
                  : 'สุขภาพโดยรวมอยู่ในเกณฑ์ดี แนะนำรักษาน้ำหนักตัวตามเกณฑ์มาตรฐาน และเข้ารับการตรวจคัดกรองสุขภาพประจำปีอย่างสม่ำเสมอ'}
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
