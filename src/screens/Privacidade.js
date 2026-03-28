import React from "react";
import { View, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from "react-native";
import { Text, Divider, Surface } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

const Privacidade = ({ navigation }) => {
  const sections = [
    {
      number: "1",
      title: "Coleta de Dados",
      content:
        "A Calculadora CLT Pro foi desenvolvida com foco total na privacidade do usuário. Não coletamos, não armazenamos e não compartilhamos dados pessoais, financeiros ou informações de navegação.",
    },
    {
      number: "2",
      title: "Cálculos e Processamento",
      content:
        "Todos os cálculos de Salário Líquido, Férias, 13º Salário e Rescisão são processados localmente no seu dispositivo. Os valores informados não são enviados para servidores externos.",
    },
    {
      number: "3",
      title: "Cookies e Rastreamento",
      content:
        "Este aplicativo/site não utiliza cookies de rastreamento de terceiros, nem ferramentas de análise que identifiquem o usuário individualmente.",
    },
    {
      number: "4",
      title: "Contato",
      content:
        "Em caso de dúvidas sobre o funcionamento técnico da ferramenta ou sobre esta Política de Privacidade, entre em contato pelos canais oficiais de suporte do aplicativo.",
    },
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#081120" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Home")}
            activeOpacity={0.8}
          >
            <MaterialIcons name="arrow-back-ios-new" size={18} color="#fff" />
            <Text style={styles.backButtonText}>Voltar para Home</Text>
          </TouchableOpacity>

          <Surface style={styles.hero} elevation={2}>
            <Text style={styles.badge}>SEGURANÇA E PRIVACIDADE</Text>
            <Text style={styles.title}>Política de Privacidade</Text>
            <Text style={styles.subtitle}>
              Sua privacidade é importante. Esta política explica de forma clara
              como suas informações são tratadas dentro da Calculadora CLT Pro.
            </Text>

            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>Última atualização</Text>
              <Text style={styles.date}>28 de março de 2026</Text>
            </View>
          </Surface>

          <Divider style={styles.divider} />

          <Surface style={styles.highlightBox} elevation={1}>
            <Text style={styles.highlightTitle}>Resumo rápido</Text>
            <Text style={styles.highlightText}>
              Não coletamos seus dados pessoais, não armazenamos valores dos
              cálculos e não compartilhamos informações com terceiros.
            </Text>
          </Surface>

          <View style={styles.sectionsWrapper}>
            {sections.map((section) => (
              <Surface key={section.number} style={styles.card} elevation={1}>
                <View style={styles.cardHeader}>
                  <View style={styles.numberCircle}>
                    <Text style={styles.numberText}>{section.number}</Text>
                  </View>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                </View>

                <Text style={styles.text}>{section.content}</Text>
              </Surface>
            ))}
          </View>

          <Surface style={styles.footerCard} elevation={1}>
            <Text style={styles.footerTitle}>Compromisso com o usuário</Text>
            <Text style={styles.footerText}>
              A Calculadora CLT Pro foi criada para oferecer praticidade e
              confiança, priorizando sempre a proteção das informações do
              usuário.
            </Text>
          </Surface>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#081120",
  },

  scrollContent: {
    paddingVertical: 24,
  },

  container: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    paddingHorizontal: 20,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#0a66c2",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 18,
  },

  backButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    marginLeft: 6,
  },

  hero: {
    backgroundColor: "#0f1b31",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.15)",
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(96,165,250,0.12)",
    color: "#93c5fd",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 16,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 24,
    color: "#cbd5e1",
    marginBottom: 20,
  },

  dateBox: {
    marginTop: 4,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },

  dateLabel: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontWeight: "700",
  },

  date: {
    fontSize: 14,
    color: "#e2e8f0",
    fontWeight: "700",
  },

  divider: {
    backgroundColor: "rgba(255,255,255,0.08)",
    marginVertical: 22,
  },

  highlightBox: {
    backgroundColor: "#0b1629",
    borderRadius: 20,
    padding: 20,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.12)",
  },

  highlightTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#60a5fa",
    marginBottom: 8,
  },

  highlightText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#dbeafe",
  },

  sectionsWrapper: {
    gap: 16,
  },

  card: {
    backgroundColor: "#0f172a",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  numberCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#0a66c2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  numberText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },

  sectionTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
  },

  text: {
    fontSize: 15,
    lineHeight: 25,
    color: "#cbd5e1",
  },

  footerCard: {
    marginTop: 24,
    backgroundColor: "#0b1629",
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.12)",
  },

  footerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#93c5fd",
    marginBottom: 8,
  },

  footerText: {
    fontSize: 14,
    lineHeight: 23,
    color: "#cbd5e1",
  },
});

export default Privacidade; 