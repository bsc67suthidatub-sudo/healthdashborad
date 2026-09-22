import { DEFAULT_HEALTH_DATA } from '../data/defaultHealthData';
import { HealthRecord, KPIStats, FilterState } from '../types';

const SHEET_ID = '1ZioAfvvpJHn7re52iXvVvXgyalsHQR7S5zRg0VLHlmI';
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

function parseCSVLine(text: string): string[] {
  const parts: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      parts.push(cur.trim().replace(/^"|"$/g, ''));
      cur = '';
    } else {
      cur += char;
    }
  }
  parts.push(cur.trim().replace(/^"|"$/g, ''));
  return parts;
}

export async function fetchHealthRecords(): Promise<{ records: HealthRecord[]; isLive: boolean; error?: string }> {
  try {
    const res = await fetch(SHEET_CSV_URL, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const csvText = await res.text();
    const lines = csvText.trim().split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length <= 1) {
      return { records: DEFAULT_HEALTH_DATA, isLive: false };
    }

    const headers = parseCSVLine(lines[0]);
    const records: HealthRecord[] = lines.slice(1).map((line, idx) => {
      const vals = parseCSVLine(line);
      const rowMap: Record<string, string> = {};
      headers.forEach((h, hIdx) => {
        if (h) rowMap[h] = vals[hIdx] || '';
      });

      return {
        id: rowMap['รหัสบุคคล'] || `H${String(idx + 1).padStart(4, '0')}`,
        date: rowMap['วันที่คัดกรอง'] || '',
        area: rowMap['พื้นที่'] || 'เมือง',
        gender: (rowMap['เพศ'] || 'หญิง') as 'ชาย' | 'หญิง',
        age: Number(rowMap['อายุ']) || 0,
        height: Number(rowMap['ส่วนสูง_cm']) || 0,
        weight: Number(rowMap['น้ำหนัก_kg']) || 0,
        bmi: Number(rowMap['BMI']) || 0,
        sbp: Number(rowMap['SBP_mmHg']) || 0,
        dbp: Number(rowMap['DBP_mmHg']) || 0,
        pulse: Number(rowMap['ชีพจร_bpm']) || 0,
        bloodSugar: Number(rowMap['น้ำตาล_mg_dL']) || 0,
        smoking: rowMap['สูบบุหรี่'] || 'ไม่สูบ',
        alcohol: rowMap['ดื่มแอลกอฮอล์'] || 'ไม่ดื่ม',
        exercise: rowMap['การออกกำลังกาย'] || 'ไม่ออกกำลังกาย',
        diabetesScreening: rowMap['เบาหวาน_คัดกรอง'] || 'ไม่มี',
        hypertensionScreening: rowMap['ความดันโลหิตสูง_คัดกรอง'] || 'ไม่มี',
        riskScore: Number(rowMap['คะแนนความเสี่ยง']) || 0,
        riskLevel: (rowMap['ระดับความเสี่ยง'] || 'ต่ำ') as 'ต่ำ' | 'ปานกลาง' | 'สูง',
        month: rowMap['เดือน'] || '2026-01'
      };
    });

    return { records, isLive: true };
  } catch (err: unknown) {
    console.warn('Live fetch error, falling back to cached default records:', err);
    return { records: DEFAULT_HEALTH_DATA, isLive: false, error: String(err) };
  }
}

export function filterHealthRecords(records: HealthRecord[], filters: FilterState): HealthRecord[] {
  return records.filter(item => {
    // Area filter
    if (filters.area !== 'ทั้งหมด' && item.area !== filters.area) {
      return false;
    }
    // Risk level filter
    if (filters.riskLevel !== 'ทั้งหมด' && item.riskLevel !== filters.riskLevel) {
      return false;
    }
    // Gender filter
    if (filters.gender !== 'ทั้งหมด' && item.gender !== filters.gender) {
      return false;
    }
    // Age Group filter
    if (filters.ageGroup !== 'all' && filters.ageGroup !== 'ทั้งหมด') {
      if (filters.ageGroup === '<35' && item.age >= 35) return false;
      if (filters.ageGroup === '35-50' && (item.age < 35 || item.age > 50)) return false;
      if (filters.ageGroup === '51-60' && (item.age < 51 || item.age > 60)) return false;
      if (filters.ageGroup === '>60' && item.age <= 60) return false;
    }
    // Smoking filter
    if (filters.smoking !== 'ทั้งหมด' && item.smoking !== filters.smoking) {
      return false;
    }
    // Alcohol filter
    if (filters.alcohol !== 'ทั้งหมด' && item.alcohol !== filters.alcohol) {
      return false;
    }
    // Exercise filter
    if (filters.exercise !== 'ทั้งหมด' && item.exercise !== filters.exercise) {
      return false;
    }
    // Month filter
    if (filters.month !== 'ทั้งหมด' && item.month !== filters.month) {
      return false;
    }
    // Search query
    if (filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      const match =
        item.id.toLowerCase().includes(q) ||
        item.area.toLowerCase().includes(q) ||
        item.gender.toLowerCase().includes(q) ||
        item.riskLevel.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}

export function calculateKPIStats(records: HealthRecord[]): KPIStats {
  const n = records.length;
  if (n === 0) {
    return {
      totalScreened: 0,
      avgBMI: 0,
      avgBloodSugar: 0,
      avgSBP: 0,
      avgDBP: 0,
      avgAge: 0,
      avgRiskScore: 0,
      minBMI: 0,
      minBloodSugar: 0,
      minSBP: 0,
      minAge: 0,
      maxBMI: 0,
      maxBloodSugar: 0,
      maxSBP: 0,
      maxAge: 0,
      highRiskCount: 0,
      mediumRiskCount: 0,
      lowRiskCount: 0,
      hypertensionRiskCount: 0,
      diabetesRiskCount: 0,
      highRiskRate: 0,
      hypertensionRiskRate: 0,
      diabetesRiskRate: 0,
      obesityRate: 0,
    };
  }

  const bmis = records.map(r => r.bmi);
  const bloodSugars = records.map(r => r.bloodSugar);
  const sbps = records.map(r => r.sbp);
  const dbps = records.map(r => r.dbp);
  const ages = records.map(r => r.age);
  const riskScores = records.map(r => r.riskScore);

  const highRiskCount = records.filter(r => r.riskLevel === 'สูง').length;
  const mediumRiskCount = records.filter(r => r.riskLevel === 'ปานกลาง').length;
  const lowRiskCount = records.filter(r => r.riskLevel === 'ต่ำ').length;

  const hypertensionRiskCount = records.filter(r => r.hypertensionScreening === 'มีแนวโน้ม/เสี่ยง' || r.sbp >= 140).length;
  const diabetesRiskCount = records.filter(r => r.diabetesScreening === 'มีแนวโน้ม/เสี่ยง' || r.bloodSugar >= 126).length;
  const obesityCount = records.filter(r => r.bmi >= 25).length;

  const sum = (arr: number[]) => arr.reduce((acc, v) => acc + v, 0);

  return {
    totalScreened: n,
    avgBMI: Number((sum(bmis) / n).toFixed(1)),
    avgBloodSugar: Number((sum(bloodSugars) / n).toFixed(1)),
    avgSBP: Number((sum(sbps) / n).toFixed(1)),
    avgDBP: Number((sum(dbps) / n).toFixed(1)),
    avgAge: Number((sum(ages) / n).toFixed(1)),
    avgRiskScore: Number((sum(riskScores) / n).toFixed(1)),
    minBMI: Math.min(...bmis),
    minBloodSugar: Math.min(...bloodSugars),
    minSBP: Math.min(...sbps),
    minAge: Math.min(...ages),
    maxBMI: Math.max(...bmis),
    maxBloodSugar: Math.max(...bloodSugars),
    maxSBP: Math.max(...sbps),
    maxAge: Math.max(...ages),
    highRiskCount,
    mediumRiskCount,
    lowRiskCount,
    hypertensionRiskCount,
    diabetesRiskCount,
    highRiskRate: Number(((highRiskCount / n) * 100).toFixed(1)),
    hypertensionRiskRate: Number(((hypertensionRiskCount / n) * 100).toFixed(1)),
    diabetesRiskRate: Number(((diabetesRiskCount / n) * 100).toFixed(1)),
    obesityRate: Number(((obesityCount / n) * 100).toFixed(1)),
  };
}
