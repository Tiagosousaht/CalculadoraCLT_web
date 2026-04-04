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

  const isSmallMobile = width < 390;
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1200;
  const isDesktop = width >= 1200;

  const getCardWidth = () => {
    if (isDesktop) return "23.5%";
    if (isTablet) return "48.5%";
    return "100%";
  };

  const menuItems = [
    {
      title: "Salário Líquido",
      description: "Calcule descontos oficiais, extras, dependentes e adicionais.",
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
      description: "Simule férias com 1/3, abono pecuniário e descontos legais.",
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
      description: "Veja parcelas, descontos e valores proporcionais.",
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
      description: "Calcule aviso, FGTS, multa e principais verbas rescisórias.",
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
      q: "Quais são as faixas de desconto do INSS em 2026?",
      a: "As alíquotas do INSS são progressivas. A calculadora aplica automaticamente as faixas sobre o salário bruto para estimar o desconto previdenciário.",
    },
    {
      q: "Como funciona o IRRF no salário?",
      a: "O IRRF é calculado após descontos como INSS e dependentes. A ferramenta considera a base tributável e aplica a faixa correspondente.",
    },
    {
      q: "Como calcular a multa de 40% do FGTS?",
      a: "Na dispensa sem justa causa, a multa é de 40% sobre o total depositado no FGTS durante o contrato. A calculadora de rescisão ajuda a projetar esse valor.",
    },
    {
      q: "O que é abono pecuniário nas férias?",
      a: "É a possibilidade de vender até 10 dias de férias. A calculadora mostra a estimativa do valor adicional a receber.",
    },
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#081120" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          isMobile && styles.contentContainerMobile,
        ]}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={Platform.OS !== "web"}
        scrollEventThrottle={16}
        nestedScrollEnabled
        bounces={false}
        overScrollMode="never"
      >
        <View pointerEvents="none" style={styles.glowOne} />
        <View pointerEvents="none" style={styles.glowTwo} />

        <View
          style={[
            styles.pageWrap,
            isMobile && styles.pageWrapMobile,
            isTablet && styles.pageWrapTablet,
          ]}
        >
          {/* HERO */}
          <View
            style={[
              styles.hero,
              isDesktop && styles.heroDesktop,
              isTablet && styles.heroTablet,
              isMobile && styles.heroMobile,
            ]}
          >
            <View
              style={[
                styles.heroLeft,
                isMobile && styles.heroLeftMobile,
              ]}
            >
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>BRASIL • ATUALIZADO 2026</Text>
              </View>

              <Text
                style={[
                  styles.heroTitle,
                  isTablet && styles.heroTitleTablet,
                  isMobile && styles.heroTitleMobile,
                  isSmallMobile && styles.heroTitleSmallMobile,
                ]}
              >
                Calculadora CLT
              </Text>

              <Text
                style={[
                  styles.heroSubtitle,
                  isTablet && styles.heroSubtitleTablet,
                  isMobile && styles.heroSubtitleMobile,
                ]}
              >
                Calcule salário líquido, férias, 13º salário e rescisão em poucos
                segundos com uma interface rápida, moderna e fácil de usar.
              </Text>

              <Text style={[styles.socialProof, isMobile && styles.socialProofMobile]}>
                +10.000 simulações realizadas • 100% online
              </Text>

              <View
                style={[
                  styles.heroButtons,
                  isMobile && styles.heroButtonsMobile,
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.primaryCTA,
                    isMobile && styles.primaryCTAMobile,
                  ]}
                  activeOpacity={0.88}
                  onPress={() => navigation.navigate("Liquido")}
                >
                  <Text style={styles.primaryCTAText}>
                    Calcular Salário Agora
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.secondaryCTA,
                    isMobile && styles.secondaryCTAMobile,
                  ]}
                  activeOpacity={0.88}
                  onPress={() => navigation.navigate("Rescisao")}
                >
                  <Text style={styles.secondaryCTAText}>
                    Ver Rescisão
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={[
                styles.summaryCard,
                isTablet && styles.summaryCardTablet,
                isMobile && styles.summaryCardMobile,
              ]}
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
                <Text style={styles.summaryLabel}>Atualizado</Text>
              </View>
            </View>
          </View>

          {/* FERRAMENTAS */}
          <View style={[styles.sectionHeader, isMobile && styles.sectionHeaderMobile]}>
            <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>
              Ferramentas de Cálculo
            </Text>
            <Text
              style={[
                styles.sectionSubtitle,
                isMobile && styles.sectionSubtitleMobile,
              ]}
            >
              Escolha a calculadora ideal para sua necessidade trabalhista
            </Text>
          </View>

          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.cardWrapper,
                  { width: getCardWidth() },
                  isMobile && styles.cardWrapperMobile,
                ]}
                activeOpacity={0.92}
                onPress={() => navigation.navigate(item.screen)}
              >
                <Card
                  style={[
                    styles.card,
                    isMobile && styles.cardMobile,
                    {
                      backgroundColor: item.cardTop,
                      borderColor: item.color + "30",
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
                      isMobile && styles.cardContentMobile,
                      { backgroundColor: item.cardBottom },
                    ]}
                  >
                    <View style={styles.cardTop}>
                      <Avatar.Icon
                        size={isMobile ? 44 : 48}
                        icon={item.icon}
                        style={{ backgroundColor: item.color }}
                        color="#ffffff"
                      />

                      <View style={styles.tagBadge}>
                        <Text style={[styles.tagText, { color: item.darkText }]}>
                          {item.tag}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardTextArea}>
                      <Text
                        style={[
                          styles.cardTitle,
                          isMobile && styles.cardTitleMobile,
                          { color: item.darkText },
                        ]}
                      >
                        {item.title}
                      </Text>

                      <Text
                        style={[
                          styles.cardDescription,
                          isMobile && styles.cardDescriptionMobile,
                        ]}
                      >
                        {item.description}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.cardFooter,
                        { borderTopColor: item.color + "20" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.cardAction,
                          isMobile && styles.cardActionMobile,
                          { color: item.darkText },
                        ]}
                      >
                        Calcular Agora
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

          {/* BLOCO DE CONFIANÇA */}
          <View style={[styles.trustSection, isMobile && styles.trustSectionMobile]}>
            <View style={styles.trustCard}>
              <Text style={[styles.trustTitle, isMobile && styles.trustTitleMobile]}>
                Por que usar nossa Calculadora CLT?
              </Text>

              <Text
                style={[
                  styles.trustDescription,
                  isMobile && styles.trustDescriptionMobile,
                ]}
              >
                Nossa plataforma foi pensada para facilitar cálculos trabalhistas
                importantes do dia a dia. Faça estimativas de{" "}
                <Text style={styles.bold}>salário líquido</Text>,{" "}
                <Text style={styles.bold}>férias</Text>,{" "}
                <Text style={styles.bold}>13º salário</Text> e{" "}
                <Text style={styles.bold}>rescisão</Text> com uma experiência
                rápida, intuitiva e organizada.
              </Text>
            </View>
          </View>

          {/* FAQ */}
          <View style={[styles.sectionHeader, isMobile && styles.sectionHeaderMobile]}>
            <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>
              Perguntas Frequentes
            </Text>
            <Text
              style={[
                styles.sectionSubtitle,
                isMobile && styles.sectionSubtitleMobile,
              ]}
            >
              Tire dúvidas comuns sobre cálculos CLT
            </Text>
          </View>

          <View style={[styles.faqGrid, isDesktop && styles.faqGridDesktop]}>
            {faqItems.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.faqCard,
                  isDesktop && { width: "48.7%" },
                ]}
              >
                <List.Accordion
                  title={item.q}
                  titleStyle={[
                    styles.faqQuestion,
                    isMobile && styles.faqQuestionMobile,
                  ]}
                  style={styles.faqAccordion}
                  theme={{ colors: { primary: "#60a5fa" } }}
                >
                  <View style={styles.faqAnswerContainer}>
                    <Text
                      style={[
                        styles.faqAnswerText,
                        isMobile && styles.faqAnswerTextMobile,
                      ]}
                    >
                      {item.a}
                    </Text>
                  </View>
                </List.Accordion>
                <Divider style={styles.faqDivider} />
              </View>
            ))}
          </View>

          {/* CTA FINAL */}
          <View
            style={[
              styles.finalCTASection,
              isMobile && styles.finalCTASectionMobile,
            ]}
          >
            <Text
              style={[
                styles.finalCTATitle,
                isMobile && styles.finalCTATitleMobile,
              ]}
            >
              Faça sua simulação agora mesmo
            </Text>

            <Text
              style={[
                styles.finalCTADescription,
                isMobile && styles.finalCTADescriptionMobile,
              ]}
            >
              Descubra valores de salário, férias, 13º e rescisão em poucos toques.
            </Text>

            <TouchableOpacity
              style={[
                styles.finalCTAButton,
                isMobile && styles.finalCTAButtonMobile,
              ]}
              activeOpacity={0.9}
              onPress={() => navigation.navigate("Liquido")}
            >
              <Text style={styles.finalCTAButtonText}>Começar Gratuitamente</Text>
            </TouchableOpacity>
          </View>

          {/* FOOTER */}
          <View style={[styles.footer, isMobile && styles.footerMobile]}>
            <Divider style={styles.footerDivider} />

            <Text style={styles.footerText}>
              Calculadora CLT 2026 • Ferramenta educativa e informativa
            </Text>

            <Text style={styles.footerSubText}>
              Plataforma online para simulações e estimativas trabalhistas.
            </Text>

            <View
              style={[
                styles.footerBottomRow,
                isMobile && styles.footerBottomRowMobile,
              ]}
            >
              <Text style={styles.copyrightText}>© 2026 Calculadora CLT</Text>

              {!isMobile && <View style={styles.dotSeparator} />}

              <TouchableOpacity onPress={() => navigation.navigate("Privacidade")}>
                <Text style={styles.privacyLink}>Política de Privacidade</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: isMobile ? 30 : 60 }} />
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

  container: {
    flex: 1,
  },

  contentContainer: {
    paddingTop: Platform.OS === "web" ? 16 : 6,
    paddingBottom: 40,
  },

  contentContainerMobile: {
    paddingTop: 6,
    paddingBottom: 28,
  },

  pageWrap: {
    width: "100%",
    maxWidth: 1220,
    alignSelf: "center",
    paddingHorizontal: 20,
  },

  pageWrapTablet: {
    paddingHorizontal: 18,
  },

  pageWrapMobile: {
    paddingHorizontal: 14,
  },

  glowOne: {
    position: "absolute",
    top: -80,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(37,99,235,0.10)",
  },

  glowTwo: {
    position: "absolute",
    top: 500,
    left: -80,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(34,197,94,0.05)",
  },

  hero: {
    backgroundColor: "#111c34",
    borderRadius: 24,
    padding: 24,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  heroDesktop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 34,
  },

  heroTablet: {
    padding: 28,
  },

  heroMobile: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },

  heroLeft: {
    flex: 1,
    marginRight: 18,
  },

  heroLeftMobile: {
    marginRight: 0,
  },

  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(96,165,250,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 12,
  },

  heroBadgeText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#60a5fa",
    letterSpacing: 0.8,
  },

  heroTitle: {
    fontSize: 40,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 10,
  },

  heroTitleTablet: {
    fontSize: 36,
  },

  heroTitleMobile: {
    fontSize: 29,
    lineHeight: 33,
  },

  heroTitleSmallMobile: {
    fontSize: 26,
    lineHeight: 30,
  },

  heroSubtitle: {
    fontSize: 16,
    color: "#94a3b8",
    lineHeight: 25,
    maxWidth: 700,
  },

  heroSubtitleTablet: {
    fontSize: 15,
  },

  heroSubtitleMobile: {
    fontSize: 14,
    lineHeight: 22,
  },

  socialProof: {
    marginTop: 10,
    fontSize: 13,
    color: "#22c55e",
    fontWeight: "800",
  },

  socialProofMobile: {
    fontSize: 12,
    lineHeight: 18,
  },

  heroButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },

  heroButtonsMobile: {
    flexDirection: "column",
    alignItems: "stretch",
    marginTop: 16,
  },

  primaryCTA: {
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryCTAMobile: {
    marginRight: 0,
    marginBottom: 10,
  },

  primaryCTAText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 14,
  },

  secondaryCTA: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.04)",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryCTAMobile: {
    marginBottom: 0,
  },

  secondaryCTAText: {
    color: "#e2e8f0",
    fontWeight: "800",
    fontSize: 14,
  },

  summaryCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minWidth: 280,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  summaryCardTablet: {
    marginTop: 20,
  },

  summaryCardMobile: {
    marginTop: 18,
    minWidth: "100%",
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 16,
  },

  summaryItem: {
    alignItems: "center",
    flex: 1,
  },

  summaryNumber: {
    fontSize: 19,
    fontWeight: "900",
    color: "#ffffff",
  },

  summaryLabel: {
    fontSize: 10,
    color: "#64748b",
    textTransform: "uppercase",
    marginTop: 4,
    textAlign: "center",
  },

  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  sectionHeader: {
    marginBottom: 18,
    marginTop: 8,
  },

  sectionHeaderMobile: {
    marginBottom: 14,
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#f8fafc",
  },

  sectionTitleMobile: {
    fontSize: 21,
  },

  sectionSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },

  sectionSubtitleMobile: {
    fontSize: 13,
    lineHeight: 19,
  },

  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  cardWrapper: {
    borderRadius: 22,
    marginBottom: 16,
  },

  cardWrapperMobile: {
    marginBottom: 12,
  },

  card: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: "hidden",
  },

  cardMobile: {
    borderRadius: 18,
  },

  cardColorBand: {
    height: 5,
    width: "100%",
  },

  cardContent: {
    minHeight: 220,
    padding: 18,
    justifyContent: "space-between",
  },

  cardContentMobile: {
    minHeight: 195,
    padding: 15,
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  tagBadge: {
    backgroundColor: "rgba(255,255,255,0.55)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  tagText: {
    fontSize: 10,
    fontWeight: "800",
  },

  cardTextArea: {
    marginTop: 14,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 6,
  },

  cardTitleMobile: {
    fontSize: 17,
  },

  cardDescription: {
    fontSize: 13,
    color: "#334155",
    lineHeight: 18,
  },

  cardDescriptionMobile: {
    fontSize: 12.5,
    lineHeight: 17,
  },

  cardFooter: {
    marginTop: 14,
    paddingTop: 11,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardAction: {
    fontSize: 13,
    fontWeight: "900",
  },

  cardActionMobile: {
    fontSize: 12.5,
  },

  cardArrow: {
    fontSize: 17,
    fontWeight: "900",
  },

  trustSection: {
    marginTop: 22,
  },

  trustSectionMobile: {
    marginTop: 18,
  },

  trustCard: {
    padding: 22,
    backgroundColor: "#0f172a",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  trustTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 12,
  },

  trustTitleMobile: {
    fontSize: 19,
    lineHeight: 24,
  },

  trustDescription: {
    fontSize: 15,
    color: "#94a3b8",
    lineHeight: 25,
  },

  trustDescriptionMobile: {
    fontSize: 13.5,
    lineHeight: 21,
  },

  bold: {
    color: "#ffffff",
    fontWeight: "800",
  },

  faqGrid: {
    marginTop: 6,
  },

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

  faqAccordion: {
    backgroundColor: "#111c34",
  },

  faqQuestion: {
    fontSize: 15,
    fontWeight: "700",
    color: "#f8fafc",
  },

  faqQuestionMobile: {
    fontSize: 14,
    lineHeight: 20,
  },

  faqAnswerContainer: {
    padding: 18,
    paddingTop: 0,
    backgroundColor: "#111c34",
  },

  faqAnswerText: {
    fontSize: 14,
    color: "#94a3b8",
    lineHeight: 21,
  },

  faqAnswerTextMobile: {
    fontSize: 13,
    lineHeight: 19,
  },

  faqDivider: {
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  finalCTASection: {
    marginTop: 30,
    padding: 24,
    borderRadius: 22,
    backgroundColor: "#101a30",
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.14)",
    alignItems: "center",
  },

  finalCTASectionMobile: {
    marginTop: 22,
    padding: 18,
    borderRadius: 18,
  },

  finalCTATitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },

  finalCTATitleMobile: {
    fontSize: 20,
    lineHeight: 25,
  },

  finalCTADescription: {
    color: "#94a3b8",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    maxWidth: 600,
    lineHeight: 21,
  },

  finalCTADescriptionMobile: {
    fontSize: 13,
    lineHeight: 19,
  },

  finalCTAButton: {
    marginTop: 16,
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  finalCTAButtonMobile: {
    width: "100%",
  },

  finalCTAButtonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 14,
  },

  footer: {
    marginTop: 46,
    alignItems: "center",
    paddingHorizontal: 12,
  },

  footerMobile: {
    marginTop: 30,
  },

  footerDivider: {
    width: "100%",
    maxWidth: 600,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginBottom: 22,
  },

  footerText: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "700",
    textAlign: "center",
  },

  footerSubText: {
    fontSize: 11,
    color: "#475569",
    marginTop: 6,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 16,
  },

  footerBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  footerBottomRowMobile: {
    flexDirection: "column",
  },

  copyrightText: {
    fontSize: 12,
    color: "#334155",
    fontWeight: "600",
  },

  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#334155",
    marginHorizontal: 10,
  },

  privacyLink: {
    color: "#60a5fa",
    fontSize: 12,
    fontWeight: "600",
    textDecorationLine: "underline",
    marginTop: Platform.OS === "web" ? 0 : 6,
  },
});

export default HomeScreen;