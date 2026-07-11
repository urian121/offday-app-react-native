import "react-native-gesture-handler";
import "react-native-reanimated";
import { registerRootComponent } from "expo";

import "./src/nativewind-interop";
import App from "./App";

registerRootComponent(App);
