import React from 'react';
import { TabType } from '../types';
import {
  LayoutDashboard,
  ShieldAlert,
  TrendingUp,
  Activity,
  Table,
  Lightbulb,
} from 'lucide-react';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  highRiskCount: number;
  totalCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  highRiskCount,
  totalCount,
}) => {
  const tabs = [
    {
      id: 'overview' as TabType,
      label: 'ภาพรวมสุขภาพ & KPIs',
      icon: LayoutDashboard,
      badge: `${totalCount} คน`,
    },
    {
      id: 'risk' as TabType,
      label: 'การวิเคราะห์ความเสี่ยง',
      icon: ShieldAlert,
      badge: highRiskCount > 0 ? `เสี่ยงสูง ${highRiskCount}` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    },
    {
      id: 'trend' as TabType,
      label: 'แนวโน้มและช่วงเวลา',
      icon: TrendingUp,
    },
    {
      id: 'behavior' as TabType,
      label: 'พฤติกรรม & ความสัมพันธ์',
      icon: Activity,
    },
    {
      id: 'table' as TabType,
      label: 'ข้อมูลเชิงลึกรายบุคคล',
      icon: Table,
      badge: 'Conditional Color',
    },
    {
      id: 'recommendations' as TabType,
      label: 'สรุปข้อเสนอแนะเชิงรุก',
      icon: Lightbulb,
    },
  ];

  return (
    <nav className="mb-6 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-teal-700/50">
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-teal-900/40 backdrop-blur-md shadow-lg min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md shadow-teal-900/50 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-teal-100' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${
                    isActive
                      ? 'bg-teal-900/60 text-teal-100 border-teal-400/40'
                      : tab.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
