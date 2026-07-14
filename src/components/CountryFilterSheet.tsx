import getCountryFlag from "country-flag-icons/unicode";
import { useCallback, useMemo, useState, type RefObject } from "react";
import { Pressable, Text, View } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import type { Country } from "../interface/country";
import type { getHolidaysScreenCopy } from "../utils/getHolidaysScreenCopy";

type CountryFilterSheetProps = {
  sheetRef: RefObject<BottomSheetModal | null>;
  visible: boolean;
  countries: Country[];
  selectedCountryCode: string;
  loading: boolean;
  copy: ReturnType<typeof getHolidaysScreenCopy>;
  onDismiss: () => void;
  onSelect: (countryCode: string) => void;
};

const SHEET_STYLE = { backgroundColor: "#F7F5F1" } as const;
const HANDLE_STYLE = { backgroundColor: "#C4B8A8" } as const;
const SEARCH_STYLE = {
  marginHorizontal: 24,
  marginBottom: 14,
  borderRadius: 14,
  backgroundColor: "#EFEBE4",
  color: "#2B2622",
  fontSize: 15,
  paddingHorizontal: 16,
  paddingVertical: 12,
} as const;

export function CountryFilterSheet({
  sheetRef,
  visible,
  countries,
  selectedCountryCode,
  loading,
  copy,
  onDismiss,
  onSelect,
}: CountryFilterSheetProps) {
  const [query, setQuery] = useState("");
  const snapPoints = useMemo(() => ["75%"], []);

  const filteredCountries = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    if (!normalizedQuery) {
      return countries;
    }

    return countries.filter(
      (country) =>
        country.name.toLocaleLowerCase().includes(normalizedQuery) ||
        country.countryCode.toLocaleLowerCase().includes(normalizedQuery)
    );
  }, [countries, query]);

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
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      onDismiss={onDismiss}
    >
      <Text className="px-6 pb-4 text-xs font-medium uppercase tracking-[2px] text-brand-muted">
        {copy.selectCountry}
      </Text>

      <BottomSheetTextInput
        value={query}
        onChangeText={setQuery}
        placeholder={copy.searchCountry}
        placeholderTextColor="#7A7269"
        autoCapitalize="none"
        autoCorrect={false}
        style={SEARCH_STYLE}
      />

      <BottomSheetFlatList
        data={filteredCountries}
        keyExtractor={(item) => item.countryCode}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        ListEmptyComponent={
          <View className="items-center px-6 py-10">
            <Text className="text-center text-sm text-brand-muted">
              {loading ? copy.loadingCountries : copy.noCountries}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isSelected = item.countryCode === selectedCountryCode;

          return (
            <Pressable
              onPress={() => onSelect(item.countryCode)}
              className={`mb-1 flex-row items-center rounded-xl px-4 py-3 active:opacity-75 ${
                isSelected ? "bg-brand-accent-soft/50" : "bg-transparent"
              }`}
            >
              <Text
                className="mr-3 text-2xl"
                accessibilityLabel={`Bandera de ${item.name}`}
              >
                {getCountryFlag(item.countryCode)}
              </Text>
              <Text
                className={`min-w-0 flex-1 text-base ${
                  isSelected
                    ? "font-medium text-brand-ink"
                    : "text-brand-muted"
                }`}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text className="ml-3 text-xs font-medium text-brand-muted">
                {item.countryCode}
              </Text>
            </Pressable>
          );
        }}
      />
    </BottomSheetModal>
  );
}
