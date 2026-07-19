export interface MonthHolidaySummary {
  month: number;
  monthName: string;
  count: number;
  holidays: Array<{
    name: string;
    date: string;
    national: boolean;
    types: string[];
  }>;
}

export interface YearHolidayStats {
  countryCode: string;
  year: number;
  selectedMonth: number;
  selectedMonthName: string;
  yearTotal: number;
  months: MonthHolidaySummary[];
}
