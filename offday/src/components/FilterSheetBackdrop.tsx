import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";

export const FILTER_SHEET_BACKGROUND_STYLE = {
  backgroundColor: "#F7F5F1",
} as const;

export const FILTER_SHEET_HANDLE_STYLE = {
  backgroundColor: "#C4B8A8",
} as const;

/** Renderiza el fondo atenuado compartido por todos los selectores. */
export function FilterSheetBackdrop(props: BottomSheetBackdropProps) {
  return (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.3}
    />
  );
}
