import { useEffect, useRef, useState } from "react";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";

export function useLazyBottomSheet() {
  const ref = useRef<BottomSheetModal>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) {
      ref.current?.present();
    }
  }, [mounted]);

  const open = () => setMounted(true);
  const dismiss = () => ref.current?.dismiss();

  return { ref, mounted, setMounted, open, dismiss };
}
