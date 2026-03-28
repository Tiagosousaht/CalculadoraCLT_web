import React from "react";
import { View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Provider as PaperProvider,
  DefaultTheme,
} from "react-native-paper";

import HomeScreen from "./src/screens/HomeScreen";
import LiquidoScreen from "./src/screens/LiquidoScreen";
import FeriasScreen from "./src/screens/FeriasScreen";
import DecimoScreen from "./src/screens/DecimoScreen";
import RescisaoScreen from "./src/screens/RescisaoScreen";

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "rgb(17, 28, 52)",
  },
};



export default function App() {
  return (
    <PaperProvider theme={theme}>
      <View style={styles.root}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Liquido" component={LiquidoScreen} />
            <Stack.Screen name="Ferias" component={FeriasScreen} />
            <Stack.Screen name="Decimo" component={DecimoScreen} />
            <Stack.Screen name="Rescisao" component={RescisaoScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f5f7fb",
  },
});