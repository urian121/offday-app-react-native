export type HolidayType =
  | "Public"
  | "Bank"
  | "School"
  | "Authorities"
  | "Optional"
  | "Observance";

export interface Holiday {
  date: string;
  name: string;
  localName?: string | null;
  countryCode: string;
  nationalHoliday: boolean;
  subdivisionCodes: string[] | null;
  holidayTypes: HolidayType[];
}

export interface HolidayQueryParams {
  countryCode: string;
  year: number;
  month: number;
}
