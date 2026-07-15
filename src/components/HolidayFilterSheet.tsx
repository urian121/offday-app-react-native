import type { RefObject } from "react";
import { Pressable, Text } from "react-native";
import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  FILTER_SHEET_BACKGROUND_STYLE,
  FILTER_SHEET_HANDLE_STYLE,
  FilterSheetBackdrop,
} from "./FilterSheetBackdrop";

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
  capitalizeLabels?: boolean;
  onDismiss: () => void;
  onSelect: (value: T) => void;
};

const FILTER_SHEET_SNAP_POINTS = ["45%"];

/** Renderiza un selector desplazable reutilizable para meses y años. */
export function HolidayFilterSheet<T extends string | number>({
  sheetRef,
  visible,
  title,
  options,
  selected,
  capitalizeLabels = false,
  onDismiss,
  onSelect,
}: HolidayFilterSheetProps<T>) {
  if (!visible) {
    return null;
  }

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={FILTER_SHEET_SNAP_POINTS}
      backdropComponent={FilterSheetBackdrop}
      backgroundStyle={FILTER_SHEET_BACKGROUND_STYLE}
      handleIndicatorStyle={FILTER_SHEET_HANDLE_STYLE}
      onDismiss={onDismiss}
    >
      <BottomSheetFlatList
        data={options}
        keyExtractor={(option) => String(option.value)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ListHeaderComponent={
          <Text className="px-2 pb-4 text-xs font-medium uppercase tracking-[2px] text-brand-muted">
            {title}
          </Text>
        }
        renderItem={({ item: option }) => {
          const isSelected = option.value === selected;

          return (
            <Pressable
              onPress={() => onSelect(option.value)}
              className={`mb-1 rounded-xl px-4 py-3.5 active:opacity-75 ${
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
        }}
      />
    </BottomSheetModal>
  );
}
