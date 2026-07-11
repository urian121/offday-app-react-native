import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { HolidaysScreen } from "./src/components/HolidaysScreen";
import "./global.css";

export default function App() {
  return (
    <LinearGradient
      colors={["#EBB02D", "#F7F5F1", "#FFFFFF"]}
      locations={[0, 0.4, 0.7]}
      style={styles.container}
    >
      <Text className="text-red-500">OffDay</Text>
      <StatusBar style="auto" hidden={true} />
      <HolidaysScreen />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
