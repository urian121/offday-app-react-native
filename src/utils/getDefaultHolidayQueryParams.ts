import { HolidayQueryParams } from "../interface/holiday";
import { getDeviceCountryCode } from "./getDeviceCountryCode";

export function getDefaultHolidayQueryParams(): HolidayQueryParams {
  return {
    countryCode: getDeviceCountryCode(),
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  };
}
