import React, { useState } from "react";
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

export default function DecimoScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1100;

  const [dados, setDados] = useState({
    bruto: "",
    meses: "12",
    dep: "0",
    tipo: "total",
    periculosidade: false,
  });

  const [res, setRes] = useState(null);

  const inputTheme = {
    colors: {
      primary: "#0a66c2",
      outline: "rgba(255,255,255,0.14)",
      onSurfaceVariant: "#94a3b8",
    },
  };

  const handleCalcular = () => {
    const brutoNum = parseFloat((dados.bruto || "").replace(",", "."));
    if (!brutoNum) return;

    setRes(
      calcularDecimoTerceiro({
        ...dados,
        bruto: brutoNum,
        meses: parseInt(dados.meses) || 0,
        dependentes: parseInt(dados.dep) || 0,
        periculosidade: dados.periculosidade,
      }),
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="rgb(17, 28, 52)" />

      <View style={styles.root}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View pointerEvents="none" style={styles.glowOne} />
          <View pointerEvents="none" style={styles.glowTwo} />

          <View style={styles.pageWrap}>
            <View style={[styles.hero, isDesktop && styles.heroDesktop]}>
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

              <Text style={styles.pageTitle}>13º Salário</Text>
              <Text style={styles.pageSubtitle}>
                Simule a 1ª parcela, 2ª parcela ou o valor total do 13º com
                descontos e adicionais.
              </Text>

              <View style={styles.heroInfoCard}>
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

            <Card style={styles.mainCard}>
              <Card.Content style={styles.cardContent}>
                <Text style={styles.sectionHeading}>Dados para cálculo</Text>

                <TextInput
                  label="Salário Bruto"
                  value={dados.bruto}
                  onChangeText={(v) => setDados({ ...dados, bruto: v })}
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
                      onValueChange={(v) =>
                        setDados({ ...dados, periculosidade: v })
                      }
                      color="#0a66c2"
                    />
                  </View>
                </View>

                <TextInput
                  label="Meses Trabalhados (1 a 12)"
                  value={dados.meses}
                  onChangeText={(v) => setDados({ ...dados, meses: v })}
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
                  onChangeText={(v) => setDados({ ...dados, dep: v })}
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
                  onValueChange={(v) => setDados({ ...dados, tipo: v })}
                  buttons={[
                    {
                      value: "1",
                      label: "1ª Parc.",
                      labelStyle: { color: "#0a66c2" }, 
                    },
                    {
                      value: "2",
                      label: "2ª Parc.",
                      labelStyle: { color: "#0a66c2" },
                    },
                    {
                      value: "total",
                      label: "Total",
                      labelStyle: { color: "#0a66c2" },
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

            {res && (
              <Card style={styles.resultCard}>
                <Card.Content style={styles.resultContent}>
                  <View style={styles.resultHeader}>
                    <Text style={styles.resultTitle}>Resumo do 13º</Text>
                    <Text style={styles.resultSubtitle}>
                      Veja como o valor foi calculado
                    </Text>
                  </View>

                  <View style={styles.resultSection}>
                    <Text style={styles.resultSectionTitle}>
                      Base do cálculo
                    </Text>

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
                    <Linha
                      label="Valor Proporcional"
                      valor={res.valorIntegral}
                    />
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
                      <Text style={styles.totalLabel}>
                        TOTAL LÍQUIDO (1ª + 2ª)
                      </Text>
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

const Linha = ({ label, valor, cor = "#e2e8f0", destaque = false }) => (
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
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "rgb(17, 28, 52)",
  },

  container: {
    flex: 1,
    backgroundColor: "rgb(17, 28, 52)",
  },

  contentContainer: {
    paddingTop: Platform.OS === "web" ? 18 : 0,
    paddingBottom: 40,
  },

  pageWrap: {
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
    paddingHorizontal: 14,
  },

  glowOne: {
    position: "absolute",
    top: -70,
    right: -30,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(10,102,194,0.12)",
  },

  glowTwo: {
    position: "absolute",
    top: 300,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(10,102,194,0.07)",
  },

  hero: {
    backgroundColor: "rgb(17, 28, 52)",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },

  heroDesktop: {
    paddingHorizontal: 30,
    paddingTop: 22,
    paddingBottom: 28,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  backButton: {
    backgroundColor: "rgba(255,255,255,0.08)",
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

  pageSubtitle: {
    fontSize: 14,
    color: "#cbd5e1",
    lineHeight: 21,
    marginBottom: 18,
    maxWidth: 760,
  },

  heroInfoCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
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
    fontSize: 12,
    color: "#cbd5e1",
    fontWeight: "600",
    textAlign: "center",
  },

  heroDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.14)",
  },

  mainCard: {
    borderRadius: 24,
    marginBottom: 18,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
  },

  cardContent: {
    paddingVertical: 10,
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
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: "rgba(255,255,255,0.12)",
  },

  optionCard: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 18,
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
    borderRadius: 18,
    backgroundColor: "#0a66c2",
    shadowColor: "#0a66c2",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },

  btnContent: {
    paddingVertical: 10,
  },

  btnLabel: {
    fontWeight: "900",
    letterSpacing: 0.5,
    fontSize: 14,
  },

  resultCard: {
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },

  resultContent: {
    paddingVertical: 12,
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
    borderRadius: 18,
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
    letterSpacing: 0.6,
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
    borderRadius: 22,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(10,102,194,0.25)",
  },

  totalLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: "#bfdbfe",
    letterSpacing: 1,
    marginBottom: 6,
  },

  total: {
    fontSize: 32,
    textAlign: "center",
    fontWeight: "900",
    color: "#60a5fa",
  },
});
