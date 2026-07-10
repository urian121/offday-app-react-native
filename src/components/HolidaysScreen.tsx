import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { Holiday } from "../interface/holiday";
import { getHolidays } from "../services/holidaysService";
import { getDefaultHolidayQueryParams } from "../utils/getDefaultHolidayQueryParams";
import { formatMonthYear } from "../utils/formatMonthYear";
import { getHolidaysScreenCopy } from "../utils/getHolidaysScreenCopy";

const { month, year } = getDefaultHolidayQueryParams();
const copy = getHolidaysScreenCopy();

function formatDay(date: string): string {
  const [, , day] = date.split("-");
  return String(Number(day));
}

export function HolidaysScreen() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHolidays()
      .then(setHolidays)
      .catch((err) =>
        setError(err instanceof Error ? err.message : copy.unknownError)
      )
      .finally(() => setLoading(false));
  }, []);

  const monthLabel = formatMonthYear(month, year);

  return (
    <View className="w-full px-5 pt-2">
      <Text className="text-2xl font-semibold text-stone-800">{monthLabel}</Text>
      <Text className="mt-1 text-sm text-stone-500">
        {copy.holidaysThisMonth(holidays.length)}
      </Text>

      {loading && (
        <ActivityIndicator className="mt-8" color="#7A7269" />
      )}

      {error && (
        <Text className="mt-6 text-sm text-red-700">{error}</Text>
      )}

      {!loading && !error && holidays.length === 0 && (
        <Text className="mt-6 text-sm text-stone-500">{copy.noHolidays}</Text>
      )}

      {!loading && !error && holidays.length > 0 && (
        <FlatList
          className="mt-5"
          data={holidays}
          keyExtractor={(item) => item.date + item.name}
          ItemSeparatorComponent={() => (
            <View className="h-px bg-stone-800/10" />
          )}
          renderItem={({ item }) => (
            <View className="flex-row items-baseline gap-3 py-3">
              <Text className="w-8 text-right text-lg font-medium text-stone-800">
                {formatDay(item.date)}
              </Text>
              <View className="flex-1">
                <Text className="text-base text-stone-800">{item.name}</Text>
                {item.nationalHoliday && (
                  <Text className="mt-0.5 text-xs text-stone-500">
                    {copy.national}
                  </Text>
                )}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
