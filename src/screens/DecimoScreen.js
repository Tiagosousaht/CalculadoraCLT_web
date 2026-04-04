import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import {
  TextInput,
  Button,
  Card,
  Text,
  Divider,
  SegmentedButtons,
  Switch,
} from "react-native-paper";
import { calcularDecimoTerceiro } from "../utils/calculos13";

const formatarMoeda = (valor) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(valor || 0));

const Linha = React.memo(
  ({ label, valor, cor = "#e2e8f0", destaque = false }) => (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, destaque && styles.rowLabelStrong]}>
        {label}
      </Text>
      <Text
        style={[
          styles.rowValue,
          { color: cor },
          destaque && styles.rowValueStrong,
        ]}
      >
        {formatarMoeda(valor)}
      </Text>
    </View>
  )
);

export default function DecimoScreen({ navigation }) {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1100;
  const isDesktop = width >= 1100;

  const [dados, setDados] = useState({
    bruto: "",
    meses: "12",
    dep: "0",
    tipo: "total",
    periculosidade: false,
  });

  const [res, setRes] = useState(null);

  const inputTheme = useMemo(
    () => ({
      colors: {
        primary: "#0a66c2",
        outline: "rgba(255,255,255,0.14)",
        onSurfaceVariant: "#94a3b8",
      },
    }),
    []
  );

  const updateCampo = useCallback((campo, valor) => {
    setDados((prev) => ({ ...prev, [campo]: valor }));
  }, []);

  const handleCalcular = useCallback(() => {
    const brutoNum = parseFloat((dados.bruto || "").replace(",", "."));

    if (!brutoNum) return;

    const resultado = calcularDecimoTerceiro({
      ...dados,
      bruto: brutoNum,
      meses: parseInt(dados.meses, 10) || 0,
      dependentes: parseInt(dados.dep, 10) || 0,
      periculosidade: dados.periculosidade,
    });

    setRes(resultado);
  }, [dados]);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#111c34" />

      <View style={styles.root}>
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
          keyboardShouldPersistTaps="handled"
        >
          <View pointerEvents="none" style={styles.glowOne} />
          <View pointerEvents="none" style={styles.glowTwo} />

          <View
            style={[
              styles.pageWrap,
              isTablet && styles.pageWrapTablet,
              isMobile && styles.pageWrapMobile,
            ]}
          >
            <View
              style={[
                styles.hero,
                isDesktop && styles.heroDesktop,
                isTablet && styles.heroTablet,
                isMobile && styles.heroMobile,
              ]}
            >
              <View style={styles.topBar}>
                <TouchableOpacity
                  style={styles.backButton}
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate("Home")}
                >
                  <Text style={styles.backButtonText}>← Início</Text>
                </TouchableOpacity>

                <View style={styles.heroMiniBadge}>
                  <Text style={styles.heroMiniBadgeText}>13º</Text>
                </View>
              </View>

              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>Cálculo anual</Text>
              </View>

              <Text
                style={[
                  styles.pageTitle,
                  isTablet && styles.pageTitleTablet,
                  isMobile && styles.pageTitleMobile,
                ]}
              >
                13º Salário
              </Text>

              <Text
                style={[
                  styles.pageSubtitle,
                  isMobile && styles.pageSubtitleMobile,
                ]}
              >
                Simule a 1ª parcela, 2ª parcela ou o valor total do 13º com
                descontos e adicionais.
              </Text>

              <View
                style={[
                  styles.heroInfoCard,
                  isMobile && styles.heroInfoCardMobile,
                ]}
              >
                <View style={styles.heroInfoItem}>
                  <Text style={styles.heroInfoValue}>1ª</Text>
                  <Text style={styles.heroInfoLabel}>Parcela</Text>
                </View>

                <View style={styles.heroDivider} />

                <View style={styles.heroInfoItem}>
                  <Text style={styles.heroInfoValue}>2ª</Text>
                  <Text style={styles.heroInfoLabel}>Parcela</Text>
                </View>

                <View style={styles.heroDivider} />

                <View style={styles.heroInfoItem}>
                  <Text style={styles.heroInfoValue}>INSS / IRRF</Text>
                  <Text style={styles.heroInfoLabel}>Descontos</Text>
                </View>
              </View>
            </View>

            <Card style={[styles.mainCard, isMobile && styles.mainCardMobile]}>
              <Card.Content style={styles.cardContent}>
                <Text style={styles.sectionHeading}>Dados para cálculo</Text>

                <TextInput
                  label="Salário Bruto"
                  value={dados.bruto}
                  onChangeText={(v) => updateCampo("bruto", v)}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Affix text="R$ " />}
                  outlineStyle={styles.inputOutline}
                  textColor="#ffffff"
                  theme={inputTheme}
                />

                <View style={styles.optionCard}>
                  <View style={styles.switchRow}>
                    <View style={styles.switchTextArea}>
                      <Text style={styles.switchTitle}>
                        Recebe periculosidade?
                      </Text>
                      <Text style={styles.switchSubtitle}>
                        Adicional de 30% sobre o salário base
                      </Text>
                    </View>

                    <Switch
                      value={dados.periculosidade}
                      onValueChange={(v) => updateCampo("periculosidade", v)}
                      color="#0a66c2"
                    />
                  </View>
                </View>

                <TextInput
                  label="Meses Trabalhados (1 a 12)"
                  value={dados.meses}
                  onChangeText={(v) => updateCampo("meses", v)}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  textColor="#ffffff"
                  theme={inputTheme}
                />

                <TextInput
                  label="Dependentes"
                  value={dados.dep}
                  onChangeText={(v) => updateCampo("dep", v)}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  textColor="#ffffff"
                  theme={inputTheme}
                />

                <Text style={styles.label}>O que deseja visualizar?</Text>

                <SegmentedButtons
                  value={dados.tipo}
                  onValueChange={(v) => updateCampo("tipo", v)}
                  buttons={[
                    {
                      value: "1",
                      label: "1ª Parc.",
                      labelStyle: { color: "#0a66c2", fontWeight: "700" },
                    },
                    {
                      value: "2",
                      label: "2ª Parc.",
                      labelStyle: { color: "#0a66c2", fontWeight: "700" },
                    },
                    {
                      value: "total",
                      label: "Total",
                      labelStyle: { color: "#0a66c2", fontWeight: "700" },
                    },
                  ]}
                  style={styles.segmented}
                />

                <Button
                  mode="contained"
                  onPress={handleCalcular}
                  style={styles.btn}
                  contentStyle={styles.btnContent}
                  labelStyle={styles.btnLabel}
                >
                  CALCULAR 13º SALÁRIO
                </Button>
              </Card.Content>
            </Card>

            {res !== null && (
              <Card style={[styles.resultCard, isMobile && styles.resultCardMobile]}>
                <Card.Content style={styles.resultContent}>
                  <View style={styles.resultHeader}>
                    <Text style={styles.resultTitle}>Resumo do 13º</Text>
                    <Text style={styles.resultSubtitle}>
                      Veja como o valor foi calculado
                    </Text>
                  </View>

                  <View style={styles.resultSection}>
                    <Text style={styles.resultSectionTitle}>Base do cálculo</Text>

                    <Linha label="Salário Base" valor={res.salarioBase} />

                    {res.valorPericulosidade > 0 && (
                      <Linha
                        label="Periculosidade (30%)"
                        valor={res.valorPericulosidade}
                        cor="#22c55e"
                      />
                    )}

                    <Divider style={styles.divider} />

                    <Linha label="Base do 13º" valor={res.baseDecimo} />
                    <Linha label="Valor Proporcional" valor={res.valorIntegral} />
                  </View>

                  {dados.tipo === "1" && (
                    <View style={styles.resultSection}>
                      <Text style={styles.resultSectionTitle}>1ª parcela</Text>

                      <Linha
                        label="Valor da 1ª Parcela"
                        valor={res.primeiraParcela}
                        cor="#22c55e"
                        destaque
                      />
                    </View>
                  )}

                  {(dados.tipo === "2" || dados.tipo === "total") && (
                    <View style={styles.resultSection}>
                      <Text style={styles.resultSectionTitle}>2ª parcela</Text>

                      <Linha
                        label="Desconto INSS"
                        valor={-res.inss}
                        cor="#f87171"
                      />
                      <Linha
                        label="Desconto IRRF"
                        valor={-res.irrf}
                        cor="#f87171"
                      />

                      {dados.tipo === "2" && (
                        <>
                          <Divider style={styles.divider} />
                          <Linha
                            label="Valor da 2ª Parcela"
                            valor={res.segundaParcela}
                            cor="#22c55e"
                            destaque
                          />
                        </>
                      )}
                    </View>
                  )}

                  {dados.tipo === "total" && (
                    <View style={styles.totalBox}>
                      <Text style={styles.totalLabel}>TOTAL LÍQUIDO (1ª + 2ª)</Text>
                      <Text style={styles.total}>
                        {formatarMoeda(res.totalLiquido)}
                      </Text>
                    </View>
                  )}
                </Card.Content>
              </Card>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#111c34",
  },

  container: {
    flex: 1,
    backgroundColor: "#111c34",
  },

  contentContainer: {
    paddingTop: Platform.OS === "web" ? 14 : 6,
    paddingBottom: 32,
  },

  contentContainerMobile: {
    paddingTop: 6,
    paddingBottom: 24,
  },

  pageWrap: {
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
    paddingHorizontal: 14,
  },

  pageWrapTablet: {
    paddingHorizontal: 16,
  },

  pageWrapMobile: {
    paddingHorizontal: 12,
  },

  glowOne: {
    position: "absolute",
    top: -50,
    right: -20,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(10,102,194,0.08)",
  },

  glowTwo: {
    position: "absolute",
    top: 300,
    left: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(10,102,194,0.05)",
  },

  hero: {
    backgroundColor: "#111c34",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 22,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  heroDesktop: {
    paddingHorizontal: 28,
    paddingTop: 22,
    paddingBottom: 24,
  },

  heroTablet: {
    paddingHorizontal: 24,
  },

  heroMobile: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  backButton: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  backButtonText: {
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: "800",
  },

  heroMiniBadge: {
    backgroundColor: "rgba(10,102,194,0.16)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  heroMiniBadgeText: {
    color: "#dbeafe",
    fontSize: 12,
    fontWeight: "800",
  },

  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(10,102,194,0.16)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(10,102,194,0.18)",
  },

  heroBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#dbeafe",
  },

  pageTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 8,
  },

  pageTitleTablet: {
    fontSize: 28,
  },

  pageTitleMobile: {
    fontSize: 25,
  },

  pageSubtitle: {
    fontSize: 14,
    color: "#cbd5e1",
    lineHeight: 21,
    marginBottom: 16,
    maxWidth: 760,
  },

  pageSubtitleMobile: {
    fontSize: 13.5,
    lineHeight: 20,
  },

  heroInfoCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  heroInfoCardMobile: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },

  heroInfoItem: {
    flex: 1,
    alignItems: "center",
  },

  heroInfoValue: {
    fontSize: 15,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 4,
    textAlign: "center",
  },

  heroInfoLabel: {
    fontSize: 11.5,
    color: "#cbd5e1",
    fontWeight: "600",
    textAlign: "center",
  },

  heroDivider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  mainCard: {
    borderRadius: 22,
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  mainCardMobile: {
    borderRadius: 18,
  },

  cardContent: {
    paddingVertical: 8,
  },

  sectionHeading: {
    fontSize: 16,
    fontWeight: "800",
    color: "#f8fafc",
    marginBottom: 14,
  },

  input: {
    marginBottom: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  inputOutline: {
    borderRadius: 15,
    borderWidth: 1.1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  optionCard: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  switchTextArea: {
    flex: 1,
    paddingRight: 10,
  },

  switchTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#e2e8f0",
  },

  switchSubtitle: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 3,
    lineHeight: 17,
  },

  label: {
    marginBottom: 8,
    fontSize: 14,
    color: "#cbd5e1",
    fontWeight: "700",
  },

  segmented: {
    marginBottom: 18,
  },

  btn: {
    borderRadius: 16,
    backgroundColor: "#0a66c2",
    shadowColor: "#0a66c2",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },

  btnContent: {
    paddingVertical: 10,
  },

  btnLabel: {
    fontWeight: "900",
    letterSpacing: 0.4,
    fontSize: 14,
  },

  resultCard: {
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 18,
  },

  resultCardMobile: {
    borderRadius: 18,
  },

  resultContent: {
    paddingVertical: 10,
  },

  resultHeader: {
    marginBottom: 12,
    alignItems: "center",
  },

  resultTitle: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    color: "#ffffff",
    marginBottom: 4,
  },

  resultSubtitle: {
    fontSize: 13,
    textAlign: "center",
    color: "#94a3b8",
  },

  resultSection: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  resultSectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#cbd5e1",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    alignItems: "center",
  },

  rowLabel: {
    fontSize: 14,
    color: "#cbd5e1",
    flex: 1,
    paddingRight: 10,
  },

  rowLabelStrong: {
    fontWeight: "800",
    color: "#ffffff",
  },

  rowValue: {
    fontSize: 14,
    fontWeight: "700",
  },

  rowValueStrong: {
    fontSize: 15,
    fontWeight: "900",
  },

  divider: {
    marginVertical: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  totalBox: {
    marginTop: 8,
    backgroundColor: "rgba(10,102,194,0.14)",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(10,102,194,0.22)",
  },

  totalLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: "#bfdbfe",
    letterSpacing: 0.8,
    marginBottom: 6,
    textAlign: "center",
  },

  total: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "900",
    color: "#60a5fa",
  },
});