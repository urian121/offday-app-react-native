import { useCallback, useEffect, useRef, useState } from "react";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";

/** Monta un bottom sheet solo cuando se solicita y expone controles estables. */
export function useLazyBottomSheet() {
  const ref = useRef<BottomSheetModal>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) {
      ref.current?.present();
    }
  }, [mounted]);

  /** Monta el modal; el efecto se encarga de presentarlo. */
  const open = useCallback(() => setMounted(true), []);

  /** Solicita el cierre del modal actualmente montado. */
  const dismiss = useCallback(() => ref.current?.dismiss(), []);

  return { ref, mounted, setMounted, open, dismiss };
}
