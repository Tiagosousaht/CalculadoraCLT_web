import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
  Platform,
} from "react-native";
import { Text, Card, Avatar, List, Divider } from "react-native-paper";

const HomeScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();

  const isMobile = width < 700;
  const isTablet = width >= 700 && width < 1100;
  const isDesktop = width >= 1100;

  const getCardWidth = () => {
    if (isDesktop) return "23.8%";
    if (isTablet) return "48.8%";
    return "100%";
  };

  const menuItems = [
    {
      title: "Salário Líquido",
      description: "Cálculo de descontos oficiais, extras e dependentes",
      icon: "cash-multiple",
      color: "#16a34a",
      cardTop: "#dcfce7",
      cardBottom: "#bbf7d0",
      darkText: "#14532d",
      screen: "Liquido",
      tag: "Mais Usado",
    },
    {
      title: "Férias",
      description: "Simule férias com 1/3, abono e descontos de lei",
      icon: "umbrella-beach",
      color: "#2563eb",
      cardTop: "#dbeafe",
      cardBottom: "#bfdbfe",
      darkText: "#1e3a8a",
      screen: "Ferias",
      tag: "Rápido",
    },
    {
      title: "13º Salário",
      description: "Cálculo das parcelas e valores proporcionais",
      icon: "gift",
      color: "#f59e0b",
      cardTop: "#fef3c7",
      cardBottom: "#fde68a",
      darkText: "#92400e",
      screen: "Decimo",
      tag: "Previsão",
    },
    {
      title: "Rescisão / Acerto",
      description: "Simule sua saída: aviso, multa FGTS e verbas",
      icon: "file-document-outline",
      color: "#ef4444",
      cardTop: "#fee2e2",
      cardBottom: "#fecaca",
      darkText: "#991b1b",
      screen: "Rescisao",
      tag: "Completo",
    },
  ];

  const faqItems = [
    {
      q: "Quais as faixas de desconto do INSS em 2026?",
      a: "As alíquotas do INSS 2026 são progressivas (7,5% a 14%). Nossa calculadora aplica automaticamente o cálculo por faixas, garantindo o valor exato do desconto previdenciário sobre o salário bruto.",
    },
    {
      q: "O que é o desconto de IRRF no salário?",
      a: "O Imposto de Renda Retido na Fonte (IRRF) é calculado após a dedução do INSS e de dependentes. Utilizamos a tabela oficial de 2026 para calcular sua base de cálculo e parcela a deduzir.",
    },
    {
      q: "Como calcular a multa de 40% do FGTS na rescisão?",
      a: "Na dispensa sem justa causa, o empregador paga 40% sobre o saldo total depositado na conta do FGTS durante o contrato. Nossa ferramenta de rescisão ajuda a projetar esse valor.",
    },
    {
      q: "O que é o Abono Pecuniário nas férias?",
      a: "É a 'venda' de 10 dias de férias. Nossa calculadora de férias permite simular o valor a receber caso você opte por converter parte do seu descanso em dinheiro.",
    },
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#081120" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* ELEMENTOS VISUAIS DE FUNDO */}
        <View pointerEvents="none" style={styles.glowOne} />
        <View pointerEvents="none" style={styles.glowTwo} />
        <View pointerEvents="none" style={styles.glowThree} />

        <View style={styles.pageWrap}>
          {/* HEADER / HERO SECTION */}
          <View style={[styles.hero, isDesktop && styles.heroDesktop]}>
            <View style={styles.heroLeft}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>
                  BRASIL • ATUALIZADO 2026
                </Text>
              </View>
              <Text
                style={[
                  styles.heroTitle,
                  isMobile && styles.heroTitleMobile,
                  isDesktop && styles.heroTitleDesktop,
                ]}
              >
                Calculadora CLT
              </Text>
              <Text
                style={[
                  styles.heroSubtitle,
                  isDesktop && styles.heroSubtitleDesktop,
                ]}
              >
                A ferramenta definitiva para trabalhadores e profissionais de
                RH. Simule Salário Líquido, Rescisão, Férias e Décimo Terceiro
                com as tabelas de impostos de 2026.
              </Text>
            </View>

            <View
              style={[styles.summaryCard, isMobile && styles.summaryCardMobile]}
            >
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>100%</Text>
                <Text style={styles.summaryLabel}>Gratuito</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>100%</Text>
                <Text style={styles.summaryLabel}>Privacidade</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>2026</Text>
                <Text style={styles.summaryLabel}>Tabelas</Text>
              </View>
            </View>
          </View>

          {/* GRID DE CALCULADORAS */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ferramentas de Cálculo</Text>
            <Text style={styles.sectionSubtitle}>
              Cálculos trabalhistas precisos conforme as leis vigentes
            </Text>
          </View>

          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.cardWrapper, { width: getCardWidth() }]}
                activeOpacity={0.9}
                onPress={() => navigation.navigate(item.screen)}
              >
                <Card
                  style={[
                    styles.card,
                    {
                      backgroundColor: item.cardTop,
                      borderColor: item.color + "40",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.cardColorBand,
                      { backgroundColor: item.color },
                    ]}
                  />
                  <Card.Content
                    style={[
                      styles.cardContent,
                      { backgroundColor: item.cardBottom },
                    ]}
                  >
                    <View style={styles.cardTop}>
                      <Avatar.Icon
                        size={48}
                        icon={item.icon}
                        style={{ backgroundColor: item.color }}
                        color="#ffffff"
                      />
                      <View style={styles.tagBadge}>
                        <Text
                          style={[styles.tagText, { color: item.darkText }]}
                        >
                          {item.tag}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.cardTextArea}>
                      <Text
                        style={[styles.cardTitle, { color: item.darkText }]}
                      >
                        {item.title}
                      </Text>
                      <Text style={styles.cardDescription}>
                        {item.description}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.cardFooter,
                        { borderTopColor: item.color + "30" },
                      ]}
                    >
                      <Text
                        style={[styles.cardAction, { color: item.darkText }]}
                      >
                        Simular Agora
                      </Text>
                      <Text style={[styles.cardArrow, { color: item.color }]}>
                        →
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          {/* TEXTO DE AUTORIDADE PARA SEO */}
          <View style={styles.seoSection}>
            <Text style={styles.seoTitle}>
              Por que usar nossa Calculadora Trabalhista?
            </Text>
            <Text style={styles.seoDescription}>
              Entender seus{" "}
              <Text style={styles.boldBlue}>Direitos Trabalhistas</Text> em 2026
              não precisa ser difícil. Nosso sistema foi projetado para calcular
              com precisão o <Text style={styles.bold}>Salário Líquido</Text>,
              levando em conta a tabela progressiva do{" "}
              <Text style={styles.bold}>INSS</Text> e as faixas de{" "}
              <Text style={styles.bold}>IRRF</Text>. Seja para conferir o
              holerite ou planejar uma{" "}
              <Text style={styles.bold}>Rescisão de Contrato</Text>, oferecemos
              uma simulação completa baseada nas regras da CLT.
            </Text>
          </View>

          {/* SEÇÃO DE FAQ (ESTRUTURA DE DADOS PARA O GOOGLE) */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Perguntas Frequentes</Text>
          </View>

          <View style={[styles.faqGrid, isDesktop && styles.faqGridDesktop]}>
            {faqItems.map((item, index) => (
              <View
                key={index}
                style={[styles.faqCard, isDesktop && { width: "48.5%" }]}
              >
                <List.Accordion
                  title={item.q}
                  titleStyle={styles.faqQuestion}
                  style={styles.faqAccordion}
                  theme={{ colors: { primary: "#60a5fa" } }}
                >
                  <View style={styles.faqAnswerContainer}>
                    <Text style={styles.faqAnswerText}>{item.a}</Text>
                  </View>
                </List.Accordion>
                <Divider
                  style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                />
              </View>
            ))}
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Calculadora CLT 2026 • Ferramenta Educativa e Informativa
            </Text>
            <Text style={styles.footerSubText}>
              Dados baseados na legislação brasileira vigente para 2026.
            </Text>
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#081120" },
  container: { flex: 1 },
  contentContainer: {
    paddingTop: Platform.OS === "web" ? 20 : 0,
    paddingBottom: 60,
  },
  pageWrap: {
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",
    paddingHorizontal: 16,
  },

  // EFEITOS DE FUNDO
  glowOne: {
    position: "absolute",
    top: -100,
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(37,99,235,0.15)",
  },
  glowTwo: {
    position: "absolute",
    top: 400,
    left: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(34,197,94,0.08)",
  },
  glowThree: {
    position: "absolute",
    bottom: -50,
    right: 0,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(239,68,68,0.08)",
  },

  // HERO SECTION
  hero: {
    backgroundColor: "#111c34",
    borderRadius: 24,
    padding: 24,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    elevation: 8,
  },
  heroDesktop: {
    padding: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroLeft: { flex: 1, marginRight: 20 },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(96,165,250,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#60a5fa",
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 12,
  },
  heroTitleMobile: { fontSize: 28 },
  heroTitleDesktop: { fontSize: 42 },
  heroSubtitle: { fontSize: 15, color: "#94a3b8", lineHeight: 24 },
  heroSubtitleDesktop: { fontSize: 17 },

  // SUMMARY CARD
  summaryCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minWidth: 280,
  },
  summaryCardMobile: { marginTop: 20 },
  summaryItem: { alignItems: "center", paddingHorizontal: 10 },
  summaryNumber: { fontSize: 18, fontWeight: "900", color: "#ffffff" },
  summaryLabel: {
    fontSize: 11,
    color: "#64748b",
    textTransform: "uppercase",
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  // GRID
  sectionHeader: { marginBottom: 20, marginTop: 10 },
  sectionTitle: { fontSize: 22, fontWeight: "900", color: "#f8fafc" },
  sectionSubtitle: { fontSize: 14, color: "#64748b" },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 20,
  },
  cardWrapper: { borderRadius: 24 },
  card: { borderRadius: 24, borderWidth: 1, overflow: "hidden" },
  cardColorBand: { height: 6, width: "100%" },
  cardContent: { minHeight: 230, padding: 20, justifyContent: "space-between" },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  tagBadge: {
    backgroundColor: "rgba(255,255,255,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: { fontSize: 10, fontWeight: "800" },
  cardTextArea: { marginTop: 15 },
  cardTitle: { fontSize: 19, fontWeight: "900", marginBottom: 6 },
  cardDescription: { fontSize: 13, color: "#334155", lineHeight: 18 },
  cardFooter: {
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardAction: { fontSize: 13, fontWeight: "800" },
  cardArrow: { fontSize: 16, fontWeight: "900" },

  // SEO SECTION
  seoSection: {
    padding: 24,
    marginTop: 40,
    backgroundColor: "#0f172a",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  seoTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 12,
  },
  seoDescription: { fontSize: 15, color: "#94a3b8", lineHeight: 26 },
  bold: { color: "#ffffff", fontWeight: "700" },
  boldBlue: { color: "#60a5fa", fontWeight: "800" },

  // FAQ
  faqGrid: { marginTop: 10 },
  faqGridDesktop: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  faqCard: {
    backgroundColor: "#111c34",
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  faqAccordion: { backgroundColor: "#111c34" },
  faqQuestion: { fontSize: 15, fontWeight: "700", color: "#f8fafc" },
  faqAnswerContainer: {
    padding: 20,
    paddingTop: 0,
    backgroundColor: "#111c34",
  },
  faqAnswerText: { fontSize: 14, color: "#94a3b8", lineHeight: 22 },

  // FOOTER
  footer: {
    marginTop: 50,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    paddingTop: 30,
  },
  footerText: { fontSize: 13, color: "#475569", fontWeight: "700" },
  footerSubText: { fontSize: 11, color: "#334155", marginTop: 4 },
});

export default HomeScreen;
