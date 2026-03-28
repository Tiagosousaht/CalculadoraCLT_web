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
import { Text, Card, Avatar } from "react-native-paper";

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
      description: "Descontos, adicionais e horas extras",
      icon: "cash-multiple",
      color: "#16a34a",
      cardTop: "#dcfce7",
      cardBottom: "#bbf7d0",
      darkText: "#14532d",
      screen: "Liquido",
      tag: "Mais usado",
    },
    {
      title: "Férias",
      description: "Cálculo de férias, proporcionais e 1/3",
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
      description: "Parcelas, descontos e proporcional",
      icon: "gift",
      color: "#f59e0b",
      cardTop: "#fef3c7",
      cardBottom: "#fde68a",
      darkText: "#92400e",
      screen: "Decimo",
      tag: "Essencial",
    },
    {
      title: "Rescisão / Acerto",
      description: "Aviso, multa FGTS, férias e 13º",
      icon: "file-document-outline",
      color: "#ef4444",
      cardTop: "#fee2e2",
      cardBottom: "#fecaca",
      darkText: "#991b1b",
      screen: "Rescisao",
      tag: "Completo",
    },
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#081120" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >
        <View pointerEvents="none" style={styles.glowOne} />
        <View pointerEvents="none" style={styles.glowTwo} />
        <View pointerEvents="none" style={styles.glowThree} />

        <View pointerEvents="box-none" style={styles.pageWrap}>
          <View style={[styles.hero, isDesktop && styles.heroDesktop]}>
            <View style={styles.heroLeft}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>Calculadora Trabalhista</Text>
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
                Simule salário líquido, férias, 13º e rescisão com uma interface
                mais moderna, organizada e pronta para celular e web.
              </Text>
            </View>

            <View
              style={[
                styles.summaryCard,
                isMobile && styles.summaryCardMobile,
              ]}
            >
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>4</Text>
                <Text style={styles.summaryLabel}>Cálculos</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>2026</Text>
                <Text style={styles.summaryLabel}>Atualizado</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>CLT</Text>
                <Text style={styles.summaryLabel}>Brasil</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ferramentas</Text>
            <Text style={styles.sectionSubtitle}>
              Escolha o cálculo que você deseja fazer
            </Text>
          </View>

          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.cardWrapper, { width: getCardWidth() }]}
                activeOpacity={0.92}
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
                    style={[styles.cardColorBand, { backgroundColor: item.color }]}
                  />

                  <Card.Content
                    style={[
                      styles.cardContent,
                      { backgroundColor: item.cardBottom },
                    ]}
                  >
                    <View style={styles.cardTop}>
                      <View
                        style={[
                          styles.iconWrapper,
                          { backgroundColor: item.color + "18" },
                        ]}
                      >
                        <Avatar.Icon
                          size={52}
                          icon={item.icon}
                          style={[styles.avatarIcon, { backgroundColor: item.color }]}
                          color="#ffffff"
                        />
                      </View>

                      <View style={styles.tagBadge}>
                        <Text style={[styles.tagText, { color: item.darkText }]}>
                          {item.tag}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardTextArea}>
                      <Text style={[styles.cardTitle, { color: item.darkText }]}>
                        {item.title}
                      </Text>
                      <Text style={styles.cardDescription}>
                        {item.description}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.cardFooter,
                        { borderTopColor: item.color + "35" },
                      ]}
                    >
                      <Text style={[styles.cardAction, { color: item.darkText }]}>
                        Abrir cálculo
                      </Text>

                      <View
                        style={[
                          styles.arrowCircle,
                          { backgroundColor: item.color },
                        ]}
                      >
                        <Text style={styles.cardArrow}>→</Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          <View
            style={[
              styles.bottomGrid,
              isMobile && styles.bottomGridMobile,
            ]}
          >
            <View style={styles.tipCard}>
              <View style={styles.tipBadge}>
                <Text style={styles.tipBadgeText}>Dica</Text>
              </View>

              <Text style={styles.tipTitle}>Comece pelo salário líquido</Text>
              <Text style={styles.tipText}>
                Essa é a tela mais completa para visualizar descontos,
                adicionais, horas extras, IRRF e INSS de forma resumida.
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>Mais praticidade no dia a dia</Text>
              <Text style={styles.infoCardText}>
                Use a calculadora para simular rapidamente valores antes de
                fechar contas, conferir verbas ou validar rescisões.
              </Text>
            </View>
          </View>

          <View style={{ height: 40 }} />
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
    backgroundColor: "#081120",
  },

  contentContainer: {
    paddingTop: Platform.OS === "web" ? 18 : 0,
    paddingBottom: 40,
  },

  pageWrap: {
    width: "100%",
    maxWidth: 1340,
    alignSelf: "center",
    paddingHorizontal: 14,
  },

  glowOne: {
    position: "absolute",
    top: -70,
    right: -20,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(37,99,235,0.22)",
  },

  glowTwo: {
    position: "absolute",
    top: 360,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(34,197,94,0.12)",
  },

  glowThree: {
    position: "absolute",
    bottom: 80,
    right: -50,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(239,68,68,0.10)",
  },

  hero: {
    backgroundColor: "#111c34",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 10,
    zIndex: 3,
  },

  heroDesktop: {
    paddingHorizontal: 34,
    paddingTop: 32,
    paddingBottom: 30,
  },

  heroLeft: {
    marginBottom: 20,
  },

  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(96,165,250,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(147,197,253,0.25)",
  },

  heroBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#bfdbfe",
  },

  heroTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 10,
  },

  heroTitleMobile: {
    fontSize: 28,
  },

  heroTitleDesktop: {
    fontSize: 44,
  },

  heroSubtitle: {
    fontSize: 14,
    color: "#cbd5e1",
    lineHeight: 22,
    maxWidth: 760,
  },

  heroSubtitleDesktop: {
    fontSize: 16,
    lineHeight: 25,
  },

  summaryCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  summaryCardMobile: {
    paddingHorizontal: 8,
  },

  summaryItem: {
    flex: 1,
    alignItems: "center",
  },

  summaryNumber: {
    fontSize: 19,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 4,
  },

  summaryLabel: {
    fontSize: 12,
    color: "#cbd5e1",
    fontWeight: "600",
  },

  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  sectionHeader: {
    paddingHorizontal: 6,
    paddingTop: 6,
    paddingBottom: 14,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#f8fafc",
    marginBottom: 4,
  },

  sectionSubtitle: {
    fontSize: 14,
    color: "#94a3b8",
  },

  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
    zIndex: 5,
  },

  cardWrapper: {
    marginBottom: 2,
    zIndex: 5,
  },

  card: {
    borderRadius: 26,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },

  cardColorBand: {
    height: 8,
    width: "100%",
  },

  cardContent: {
    minHeight: 240,
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: "space-between",
  },

  cardTop: {
    alignItems: "flex-start",
  },

  iconWrapper: {
    width: 78,
    height: 78,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  avatarIcon: {
    elevation: 0,
  },

  tagBadge: {
    backgroundColor: "#ffffffd9",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 4,
  },

  tagText: {
    fontSize: 11,
    fontWeight: "900",
  },

  cardTextArea: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 4,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 23,
    marginBottom: 8,
  },

  cardDescription: {
    fontSize: 13.5,
    lineHeight: 19,
    color: "#334155",
  },

  cardFooter: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardAction: {
    fontSize: 13,
    fontWeight: "900",
  },

  arrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },

  cardArrow: {
    fontSize: 18,
    fontWeight: "900",
    color: "#ffffff",
    marginTop: -1,
  },

  bottomGrid: {
    flexDirection: "row",
    gap: 16,
    marginTop: 20,
    zIndex: 4,
  },

  bottomGridMobile: {
    flexDirection: "column",
  },

  tipCard: {
    flex: 1,
    backgroundColor: "#111c34",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 6,
  },

  tipBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(96,165,250,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 10,
  },

  tipBadgeText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#bfdbfe",
  },

  tipTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 6,
  },

  tipText: {
    fontSize: 13,
    color: "#cbd5e1",
    lineHeight: 20,
  },

  infoCard: {
    flex: 1,
    backgroundColor: "#0f1a30",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  infoCardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 8,
  },

  infoCardText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#cbd5e1",
  },
});

export default HomeScreen;