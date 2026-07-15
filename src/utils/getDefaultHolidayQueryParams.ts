import { HolidayQueryParams } from "../interface/holiday";
import { getDeviceCountryCode } from "./getDeviceCountryCode";

/** Construye los filtros iniciales a partir de la fecha y región del dispositivo. */
export function getDefaultHolidayQueryParams(): HolidayQueryParams {
  return {
    countryCode: getDeviceCountryCode(),
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  };
}
