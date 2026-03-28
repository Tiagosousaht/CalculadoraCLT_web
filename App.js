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
            <Stack.Screen name="Calculadora CLT" component={HomeScreen} />
            <Stack.Screen name="Salário Líquido" component={LiquidoScreen} />
            <Stack.Screen name="Cálculo de Férias" component={FeriasScreen} />
            <Stack.Screen name="13º Salário" component={DecimoScreen} />
            <Stack.Screen name="Rescisão / Acerto" component={RescisaoScreen} />
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