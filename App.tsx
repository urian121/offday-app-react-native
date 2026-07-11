import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { HolidaysScreen } from "./src/components/HolidaysScreen";
import "./global.css";

export default function App() {
  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <View className="flex-1 bg-brand-cream">
            <View className="absolute inset-x-0 top-0 h-[55%]">
              <LinearGradient
                colors={["#DAA428", "#E9C980", "#F3DEB1", "#FFFFFF"]}
                locations={[0, 0.15, 0.45, 1]}
                className="size-full"
              />
            </View>
            <SafeAreaView className="flex-1 w-full">
              <StatusBar style="dark" hidden={true} />
              <HolidaysScreen />
            </SafeAreaView>
          </View>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
