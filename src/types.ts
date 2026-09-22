export type RiskLevel = 'ต่ำ' | 'ปานกลาง' | 'สูง';
export type Area = 'เมือง' | 'เหนือ' | 'ตะวันออก' | 'ตะวันตก' | 'ใต้';
export type Gender = 'ชาย' | 'หญิง';
export type ExerciseStatus = 'สม่ำเสมอ' | 'บางครั้ง' | 'ไม่ออกกำลังกาย';
export type SmokingStatus = 'ไม่สูบ' | 'สูบ';
export type AlcoholStatus = 'ไม่ดื่ม' | 'ดื่ม';
export type ScreeningResult = 'ไม่มี' | 'มีแนวโน้ม/เสี่ยง';

export interface HealthRecord {
  id: string; // e.g. "H0001"
  date: string; // e.g. "3/1/2026"
  area: Area | string;
  gender: Gender | string;
  age: number;
  height: number; // cm
  weight: number; // kg
  bmi: number;
  sbp: number; // mmHg Systolic Blood Pressure
  dbp: number; // mmHg Diastolic Blood Pressure
  pulse: number; // bpm
  bloodSugar: number; // mg/dL Fasting Blood Sugar
  smoking: SmokingStatus | string;
  alcohol: AlcoholStatus | string;
  exercise: ExerciseStatus | string;
  diabetesScreening: ScreeningResult | string;
  hypertensionScreening: ScreeningResult | string;
  riskScore: number; // 0 - 7
  riskLevel: RiskLevel | string;
  month: string; // e.g. "2026-01"
}

export interface FilterState {
  area: string;
  riskLevel: string;
  gender: string;
  ageGroup: string; // 'all' | '<35' | '35-50' | '51-60' | '>60'
  smoking: string;
  alcohol: string;
  exercise: string;
  month: string;
  search: string;
}

export type TabType = 'overview' | 'risk' | 'trend' | 'behavior' | 'table' | 'recommendations';

export interface KPIStats {
  totalScreened: number;
  // ค่าเฉลี่ย (Average)
  avgBMI: number;
  avgBloodSugar: number;
  avgSBP: number;
  avgDBP: number;
  avgAge: number;
  avgRiskScore: number;
  // ค่าต่ำสุด (Minimum)
  minBMI: number;
  minBloodSugar: number;
  minSBP: number;
  minAge: number;
  // ค่าสูงสุด (Maximum)
  maxBMI: number;
  maxBloodSugar: number;
  maxSBP: number;
  maxAge: number;
  // สัดส่วน (Proportion)
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  hypertensionRiskCount: number;
  diabetesRiskCount: number;
  // ร้อยละ (Percentage)
  highRiskRate: number;
  hypertensionRiskRate: number;
  diabetesRiskRate: number;
  obesityRate: number;
}
