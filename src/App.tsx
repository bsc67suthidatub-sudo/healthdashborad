import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HealthRecord, FilterState, TabType } from './types';
import { DEFAULT_HEALTH_DATA } from './data/defaultHealthData';
import {
  fetchHealthRecords,
  filterHealthRecords,
  calculateKPIStats,
} from './services/healthService';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Filters } from './components/Filters';
import { KPICards } from './components/KPICards';
import { HealthRiskSection } from './components/HealthRiskSection';
import { HealthTrendSection } from './components/HealthTrendSection';
import { HealthBehaviorSection } from './components/HealthBehaviorSection';
import { DataTableSection } from './components/DataTableSection';
import { RecommendationsSection } from './components/RecommendationsSection';
import { Waves, Shield, HeartPulse, Sparkles } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  area: 'ทั้งหมด',
  riskLevel: 'ทั้งหมด',
  gender: 'ทั้งหมด',
  ageGroup: 'all',
  smoking: 'ทั้งหมด',
  alcohol: 'ทั้งหมด',
  exercise: 'ทั้งหมด',
  month: 'ทั้งหมด',
  search: '',
};

export default function App() {
  const [allRecords, setAllRecords] = useState<HealthRecord[]>(DEFAULT_HEALTH_DATA);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('22 ก.ย. 2026 11:15 น.');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Synchronize data on mount
  const loadData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    try {
      const res = await fetchHealthRecords();
      if (res.records && res.records.length > 0) {
        setAllRecords(res.records);
        setIsLive(res.isLive);
      }
      const now = new Date();
      const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      setLastUpdated(`${dateStr} ${timeStr} น.`);
    } catch (err) {
      console.warn('Failed to refresh data:', err);
    } finally {
      if (isManualRefresh) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  }, []);

  useEffect(() => {
    loadData(false);
  }, [loadData]);

  // Derived filter options
  const availableAreas = useMemo(() => {
    return Array.from(new Set(allRecords.map((r) => r.area))).filter(Boolean);
  }, [allRecords]);

  const availableMonths = useMemo(() => {
    return Array.from(new Set(allRecords.map((r) => r.month))).filter(Boolean).sort();
  }, [allRecords]);

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return filterHealthRecords(allRecords, filters);
  }, [allRecords, filters]);

  // KPI calculations
  const kpiStats = useMemo(() => {
    return calculateKPIStats(filteredRecords);
  }, [filteredRecords]);

  // Reset Filters Handler
  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-teal-950/40 text-slate-100 selection:bg-teal-500 selection:text-white pb-16">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-10 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-8">
        {/* 1. Header and Controls */}
        <Header
          lastUpdated={lastUpdated}
          isRefreshing={isRefreshing}
          onRefresh={() => loadData(true)}
          isLive={isLive}
        />

        {/* 2. Navigation System */}
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          highRiskCount={kpiStats.highRiskCount}
          totalCount={filteredRecords.length}
        />

        {/* 3. Advanced Filtering Component */}
        <Filters
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
          filteredCount={filteredRecords.length}
          totalCount={allRecords.length}
          availableAreas={availableAreas}
          availableMonths={availableMonths}
        />

        {/* 4. Active Tab Content Rendering */}
        <main className="transition-all duration-300">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Summary KPIs */}
              <KPICards kpi={kpiStats} totalDatasetCount={allRecords.length} />

              {/* Combined Executive Highlights: Risk & Behaviors */}
              <div className="space-y-6">
                <HealthRiskSection records={filteredRecords} />
                <HealthBehaviorSection records={filteredRecords} />
              </div>
            </div>
          )}

          {activeTab === 'risk' && (
            <div className="space-y-6 animate-fadeIn">
              <KPICards kpi={kpiStats} totalDatasetCount={allRecords.length} />
              <HealthRiskSection records={filteredRecords} />
            </div>
          )}

          {activeTab === 'trend' && (
            <div className="space-y-6 animate-fadeIn">
              <KPICards kpi={kpiStats} totalDatasetCount={allRecords.length} />
              <HealthTrendSection records={filteredRecords} />
            </div>
          )}

          {activeTab === 'behavior' && (
            <div className="space-y-6 animate-fadeIn">
              <KPICards kpi={kpiStats} totalDatasetCount={allRecords.length} />
              <HealthBehaviorSection records={filteredRecords} />
            </div>
          )}

          {activeTab === 'table' && (
            <div className="space-y-6 animate-fadeIn">
              <DataTableSection records={filteredRecords} />
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-6 animate-fadeIn">
              <KPICards kpi={kpiStats} totalDatasetCount={allRecords.length} />
              <RecommendationsSection kpi={kpiStats} />
            </div>
          )}
        </main>

        {/* Modern Footer (Without any raw links or external spreadsheet exposure) */}
        <footer className="mt-14 pt-6 border-t border-slate-800/80 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-teal-400" />
            <span className="font-medium text-slate-300">
              ระบบสารสนเทศเฝ้าระวังความเสี่ยงสุขภาพชุมชน (Community Health Intelligence Dashboard)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-teal-900/60 text-slate-300">
              ผู้จัดทำ: <strong className="text-teal-300">สุธิดา ทับเงาะ</strong>
            </span>
            <span className="text-slate-500">•</span>
            <span>สถานะระบบ: ปกติ</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
