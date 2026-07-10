import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { HolidaysScreen } from "./src/components/HolidaysScreen";
import "./global.css";

export default function App() {
  return (
    <View style={styles.container}>
      <Text className="text-red-500">OffDay</Text>
      <StatusBar style="auto" hidden={true} />
      <HolidaysScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
});
