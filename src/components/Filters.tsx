import React, { useState } from 'react';
import { FilterState } from '../types';
import {
  Filter,
  RotateCcw,
  Search,
  ChevronDown,
  ChevronUp,
  MapPin,
  ShieldAlert,
  Users,
  Calendar,
  Cigarette,
  Wine,
  Dumbbell,
} from 'lucide-react';

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  filteredCount: number;
  totalCount: number;
  availableAreas: string[];
  availableMonths: string[];
}

export const Filters: React.FC<FiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  filteredCount,
  totalCount,
  availableAreas,
  availableMonths,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleChange = (field: keyof FilterState, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const hasActiveFilters =
    filters.area !== 'ทั้งหมด' ||
    filters.riskLevel !== 'ทั้งหมด' ||
    filters.gender !== 'ทั้งหมด' ||
    filters.ageGroup !== 'all' ||
    filters.smoking !== 'ทั้งหมด' ||
    filters.alcohol !== 'ทั้งหมด' ||
    filters.exercise !== 'ทั้งหมด' ||
    filters.month !== 'ทั้งหมด' ||
    filters.search.trim() !== '';

  return (
    <div className="bg-slate-900/90 border border-teal-900/50 rounded-2xl p-4 md:p-5 mb-6 backdrop-blur-md shadow-lg shadow-slate-950/40">
      {/* Top row: Title, Result Counter, Search, and Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span>ตัวกรองและสืบค้นข้อมูลสุขภาพ</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-700/50 font-medium">
                พบ {filteredCount} จาก {totalCount} ราย
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              เลือกเงื่อนไขคัดกรองเพื่อเจาะจงกลุ่มประชากรเป้าหมาย
            </p>
          </div>
        </div>

        {/* Search input + Controls */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="filter-search-input"
              type="text"
              placeholder="ค้นหารหัสบุคคล, พื้นที่, เพศ..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition"
            />
          </div>

          <button
            id="btn-toggle-advanced-filters"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700/80 text-teal-300 border border-slate-700 transition cursor-pointer"
          >
            <span>{isExpanded ? 'ย่อตัวกรอง' : 'ตัวกรองเพิ่มเติม'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {hasActiveFilters && (
            <button
              id="btn-reset-filters"
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition cursor-pointer"
              title="ล้างค่าตัวกรองทั้งหมด"
            >
              <RotateCcw className="w-3 h-3" />
              <span>รีเซ็ต</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 4 Primary Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4 pt-4 border-t border-slate-800/80">
        {/* 1. Area Filter */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>พื้นที่สำรวจ</span>
          </label>
          <select
            id="filter-area"
            value={filters.area}
            onChange={(e) => handleChange('area', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-teal-400 cursor-pointer"
          >
            <option value="ทั้งหมด">ทุกพื้นที่ ({totalCount})</option>
            {availableAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Risk Level Filter */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300 mb-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>ระดับความเสี่ยงรวม</span>
          </label>
          <select
            id="filter-risk-level"
            value={filters.riskLevel}
            onChange={(e) => handleChange('riskLevel', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-teal-400 cursor-pointer"
          >
            <option value="ทั้งหมด">ทุกระดับความเสี่ยง</option>
            <option value="สูง">ความเสี่ยงสูง (High Risk)</option>
            <option value="ปานกลาง">ความเสี่ยงปานกลาง (Medium)</option>
            <option value="ต่ำ">ความเสี่ยงต่ำ (Low Risk)</option>
          </select>
        </div>

        {/* 3. Gender Filter */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300 mb-1.5">
            <Users className="w-3.5 h-3.5 text-teal-400" />
            <span>เพศ</span>
          </label>
          <select
            id="filter-gender"
            value={filters.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-teal-400 cursor-pointer"
          >
            <option value="ทั้งหมด">ทุกเพศ (ชาย/หญิง)</option>
            <option value="ชาย">ชาย</option>
            <option value="หญิง">หญิง</option>
          </select>
        </div>

        {/* 4. Age Group Filter */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300 mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>กลุ่มช่วงอายุ</span>
          </label>
          <select
            id="filter-age-group"
            value={filters.ageGroup}
            onChange={(e) => handleChange('ageGroup', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-teal-400 cursor-pointer"
          >
            <option value="all">ทุกช่วงอายุ</option>
            <option value="<35">ต่ำกว่า 35 ปี (วัยหนุ่มสาว)</option>
            <option value="35-50">35 - 50 ปี (วัยทำงานตอนกลาง)</option>
            <option value="51-60">51 - 60 ปี (วัยก่อนเกษียณ)</option>
            <option value=">60">มากกว่า 60 ปี (ผู้สูงอายุ)</option>
          </select>
        </div>
      </div>

      {/* Expandable Secondary Filters (Lifestyle Behaviors & Month) */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-3 pt-3 border-t border-slate-800/60 animate-fadeIn">
          {/* Smoking */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300 mb-1.5">
              <Cigarette className="w-3.5 h-3.5 text-orange-400" />
              <span>พฤติกรรมการสูบบุหรี่</span>
            </label>
            <select
              id="filter-smoking"
              value={filters.smoking}
              onChange={(e) => handleChange('smoking', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-teal-400 cursor-pointer"
            >
              <option value="ทั้งหมด">สูบและไม่สูบ</option>
              <option value="สูบ">สูบบุหรี่</option>
              <option value="ไม่สูบ">ไม่สูบบุหรี่</option>
            </select>
          </div>

          {/* Alcohol */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300 mb-1.5">
              <Wine className="w-3.5 h-3.5 text-purple-400" />
              <span>การดื่มแอลกอฮอล์</span>
            </label>
            <select
              id="filter-alcohol"
              value={filters.alcohol}
              onChange={(e) => handleChange('alcohol', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-teal-400 cursor-pointer"
            >
              <option value="ทั้งหมด">ดื่มและไม่ดื่ม</option>
              <option value="ดื่ม">ดื่มแอลกอฮอล์</option>
              <option value="ไม่ดื่ม">ไม่ดื่มแอลกอฮอล์</option>
            </select>
          </div>

          {/* Exercise */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300 mb-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
              <span>การออกกำลังกาย</span>
            </label>
            <select
              id="filter-exercise"
              value={filters.exercise}
              onChange={(e) => handleChange('exercise', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-teal-400 cursor-pointer"
            >
              <option value="ทั้งหมด">ทุกระดับการออกกำลังกาย</option>
              <option value="สม่ำเสมอ">สม่ำเสมอ</option>
              <option value="บางครั้ง">บางครั้ง</option>
              <option value="ไม่ออกกำลังกาย">ไม่ออกกำลังกาย</option>
            </select>
          </div>

          {/* Month */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300 mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>เดือนที่คัดกรอง</span>
            </label>
            <select
              id="filter-month"
              value={filters.month}
              onChange={(e) => handleChange('month', e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-teal-400 cursor-pointer"
            >
              <option value="ทั้งหมด">ทุกเดือนที่สำรวจ</option>
              {availableMonths.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
