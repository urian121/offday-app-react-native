import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
import { GestureHandlerRootView } from "react-native-gesture-handler";

cssInterop(LinearGradient, { className: "style" });
cssInterop(GestureHandlerRootView, { className: "style" });
