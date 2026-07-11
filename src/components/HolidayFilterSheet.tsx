import { useCallback, useMemo, type RefObject } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";

type FilterOption<T> = {
  value: T;
  label: string;
};

type HolidayFilterSheetProps<T> = {
  sheetRef: RefObject<BottomSheetModal | null>;
  visible: boolean;
  title: string;
  options: FilterOption<T>[];
  selected: T;
  loading?: boolean;
  loadingLabel?: string;
  capitalizeLabels?: boolean;
  onDismiss: () => void;
  onSelect: (value: T) => void;
};

const SHEET_STYLE = {
  backgroundColor: "#F7F5F1",
} as const;

const HANDLE_STYLE = {
  backgroundColor: "#C4B8A8",
} as const;

export function HolidayFilterSheet<T extends string | number>({
  sheetRef,
  visible,
  title,
  options,
  selected,
  loading = false,
  loadingLabel,
  capitalizeLabels = false,
  onDismiss,
  onSelect,
}: HolidayFilterSheetProps<T>) {
  const snapPoints = useMemo(() => ["45%"], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.3}
      />
    ),
    []
  );

  if (!visible) {
    return null;
  }

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={SHEET_STYLE}
      handleIndicatorStyle={HANDLE_STYLE}
      onDismiss={onDismiss}
    >
      <BottomSheetView>
        <Text className="px-6 pb-4 text-xs font-medium uppercase tracking-[2px] text-brand-muted">
          {title}
        </Text>

        {loading ? (
          <View className="items-center py-10">
            <ActivityIndicator color="#7A7269" />
            {loadingLabel ? (
              <Text className="mt-3 text-sm text-brand-muted">{loadingLabel}</Text>
            ) : null}
          </View>
        ) : (
          options.map((option) => {
            const isSelected = option.value === selected;

            return (
              <Pressable
                key={String(option.value)}
                onPress={() => onSelect(option.value)}
                className={`mx-4 mb-1 rounded-xl px-4 py-3.5 active:opacity-75 ${
                  isSelected ? "bg-brand-accent-soft/50" : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-base ${capitalizeLabels ? "capitalize " : ""}${
                    isSelected
                      ? "font-medium text-brand-ink"
                      : "text-brand-muted"
                  }`}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
}
