import React from "react";
import { View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Provider as PaperProvider,
  MD3DarkTheme,
} from "react-native-paper";

// Importação das Telas
import HomeScreen from "./src/screens/HomeScreen";
import LiquidoScreen from "./src/screens/LiquidoScreen";
import FeriasScreen from "./src/screens/FeriasScreen";
import DecimoScreen from "./src/screens/DecimoScreen";
import RescisaoScreen from "./src/screens/RescisaoScreen";
import PrivacidadeScreen from "./src/screens/Privacidade";

const Stack = createStackNavigator();

// Tema
const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#60a5fa",
    background: "#081120",
    surface: "#111c34",
  },
};

// 🌐 Linking (URLs bonitas para web)
const linking = {
  prefixes: ["/"],
  config: {
    screens: {
      Home: "calculadora-clt",
      Liquido: "salario-liquido",
      Ferias: "ferias",
      Decimo: "decimo-terceiro",
      Rescisao: "rescisao",
      Privacidade: "politica-de-privacidade",
    },
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <View style={styles.root}>
        <NavigationContainer linking={linking}>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: "#081120" },
            }}
          >
            {/* HOME */}
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: "Calculadora CLT" }}
            />

            {/* SALÁRIO LÍQUIDO */}
            <Stack.Screen
              name="Liquido"
              component={LiquidoScreen}
              options={{ title: "Salário Líquido" }}
            />

            {/* FÉRIAS */}
            <Stack.Screen
              name="Ferias"
              component={FeriasScreen}
              options={{ title: "Férias" }}
            />

            {/* 13º */}
            <Stack.Screen
              name="Decimo"
              component={DecimoScreen}
              options={{ title: "13º Salário" }}
            />

            {/* RESCISÃO */}
            <Stack.Screen
              name="Rescisao"
              component={RescisaoScreen}
              options={{ title: "Rescisão Trabalhista" }}
            />

            {/* PRIVACIDADE */}
            <Stack.Screen
              name="Privacidade"
              component={PrivacidadeScreen}
              options={{ title: "Política de Privacidade" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#081120",
  },
});