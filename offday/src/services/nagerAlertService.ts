import { getApiBaseUrl } from "../utils/apiConfig";
import { isAbsoluteHttpUrl } from "../utils/resolveHttpUrl";

export type NagerFailureSource = "v3" | "v4" | "countries";

export type NagerFailureReport = {
  source: NagerFailureSource;
  countryCode?: string;
  year?: number;
  status?: number;
  message?: string;
};

/**
 * Avisa al backend de un fallo de Nager.Date (fire-and-forget).
 * No usa el AbortSignal de la pantalla: el correo debe enviarse igual.
 */
export function reportNagerFailure(report: NagerFailureReport): void {
  const apiBaseUrl = getApiBaseUrl();

  if (!apiBaseUrl || !isAbsoluteHttpUrl(apiBaseUrl)) {
    return;
  }

  void fetch(`${apiBaseUrl}/api/alert/nager-failure`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(report),
  }).catch(() => {
    // Silencioso: el alerta no debe afectar la UI.
  });
}
