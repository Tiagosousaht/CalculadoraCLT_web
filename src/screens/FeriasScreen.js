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
  Switch,
  Divider,
} from "react-native-paper";
import { calcularFerias } from "../utils/CalculosFerias";

const formatarMoeda = (valor) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(valor || 0));

export default function FeriasScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1100;
  const isMobile = width < 768;

  const [salario, setSalario] = useState("");
  const [mesesTrabalhados, setMesesTrabalhados] = useState("12");
  const [dependentes, setDependentes] = useState("0");
  const [vender10, setVender10] = useState(false);
  const [periculosidade, setPericulosidade] = useState(false);
  const [res, setRes] = useState(null);

  const inputTheme = {
    colors: {
      primary: "#0a66c2",
      outline: "rgba(255,255,255,0.14)",
      onSurfaceVariant: "#94a3b8",
    },
  };

  const calcular = () => {
    const resultado = calcularFerias({
      salario: parseFloat((salario || "").replace(",", ".")) || 0,
      mesesTrabalhados:
        parseFloat((mesesTrabalhados || "").replace(",", ".")) || 0,
      dependentes: parseFloat((dependentes || "").replace(",", ".")) || 0,
      vender10,
      periculosidade,
    });

    setRes(resultado);
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
                  <Text style={styles.heroMiniBadgeText}>Férias</Text>
                </View>
              </View>

              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>Simulação de férias</Text>
              </View>

              <Text style={styles.pageTitle}>Cálculo de Férias</Text>
              <Text style={styles.pageSubtitle}>
                Veja férias proporcionais, abono, adicionais e descontos de forma
                clara, moderna e organizada.
              </Text>

              <View style={styles.heroInfoCard}>
                <View style={styles.heroInfoItem}>
                  <Text style={styles.heroInfoValue}>1/3</Text>
                  <Text style={styles.heroInfoLabel}>Constitucional</Text>
                </View>

                <View style={styles.heroDivider} />

                <View style={styles.heroInfoItem}>
                  <Text style={styles.heroInfoValue}>10 dias</Text>
                  <Text style={styles.heroInfoLabel}>Abono</Text>
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
                  label="Salário"
                  value={salario}
                  onChangeText={setSalario}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Affix text="R$ " />}
                  outlineStyle={styles.inputOutline}
                  textColor="#ffffff"
                  theme={inputTheme}
                />

                <TextInput
                  label="Meses Trabalhados"
                  value={mesesTrabalhados}
                  onChangeText={setMesesTrabalhados}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  textColor="#ffffff"
                  theme={inputTheme}
                />

                <TextInput
                  label="Dependentes"
                  value={dependentes}
                  onChangeText={setDependentes}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  textColor="#ffffff"
                  theme={inputTheme}
                />

                <View
                  style={[
                    styles.optionGrid,
                    isMobile && styles.optionGridMobile,
                  ]}
                >
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
                        value={periculosidade}
                        onValueChange={setPericulosidade}
                        color="#0a66c2"
                      />
                    </View>
                  </View>

                  <View style={styles.optionCard}>
                    <View style={styles.switchRow}>
                      <View style={styles.switchTextArea}>
                        <Text style={styles.switchTitle}>Vender 10 dias?</Text>
                        <Text style={styles.switchSubtitle}>
                          Calcula o abono pecuniário automaticamente
                        </Text>
                      </View>
                      <Switch
                        value={vender10}
                        onValueChange={setVender10}
                        color="#0a66c2"
                      />
                    </View>
                  </View>
                </View>

                <Button
                  mode="contained"
                  onPress={calcular}
                  style={styles.btn}
                  contentStyle={styles.btnContent}
                  labelStyle={styles.btnLabel}
                >
                  CALCULAR FÉRIAS
                </Button>
              </Card.Content>
            </Card>

            {res && (
              <Card style={styles.resultCard}>
                <Card.Content style={styles.resultContent}>
                  <View style={styles.resultHeader}>
                    <Text style={styles.resultTitle}>Resumo das Férias</Text>
                    <Text style={styles.resultSubtitle}>
                      Veja como o valor final foi composto
                    </Text>
                  </View>

                  <View style={styles.resultSection}>
                    <Text style={styles.resultSectionTitle}>Informações</Text>

                    <InfoItem label="Anos Completos" valor={res.anosCompletos} />
                    <InfoItem label="Meses Restantes" valor={res.mesesRestantes} />
                    <InfoItem label="Dias de Férias" valor={res.diasFerias} />
                  </View>

                  <View style={styles.resultSection}>
                    <Text style={styles.resultSectionTitle}>Proventos</Text>

                    <MoneyItem
                      label="Salário Base Ajustado"
                      valor={res.salarioBase}
                    />
                    <MoneyItem label="Valor Férias" valor={res.valorFerias} />
                    <MoneyItem
                      label="1/3 Constitucional"
                      valor={res.adicionalUmTerco}
                    />

                    {res.abono > 0 && (
                      <>
                        <Divider style={styles.divider} />
                        <MoneyItem label="Abono (10 dias)" valor={res.abono} />
                        <MoneyItem
                          label="1/3 do Abono"
                          valor={res.adicionalAbono}
                        />
                      </>
                    )}

                    <Divider style={styles.divider} />

                    <MoneyItem
                      label="Bruto Total"
                      valor={res.brutoTotal}
                      cor="#ffffff"
                      destaque
                    />
                  </View>

                  <View style={styles.resultSection}>
                    <Text style={styles.resultSectionTitle}>Descontos</Text>

                    <MoneyItem label="INSS" valor={-res.inss} cor="#f87171" />
                    <MoneyItem label="IRRF" valor={-res.irrf} cor="#f87171" />
                  </View>

                  <View style={styles.totalBox}>
                    <Text style={styles.totalLabel}>LÍQUIDO A RECEBER</Text>
                    <Text style={styles.total}>{formatarMoeda(res.liquido)}</Text>
                  </View>
                </Card.Content>
              </Card>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const MoneyItem = ({ label, valor, cor = "#22c55e", destaque = false }) => (
  <View style={styles.rowBetween}>
    <Text style={[styles.detailLabel, destaque && styles.detailLabelStrong]}>
      {label}
    </Text>
    <Text
      style={[
        styles.detailValue,
        { color: cor },
        destaque && styles.detailValueStrong,
      ]}
    >
      {formatarMoeda(valor)}
    </Text>
  </View>
);

const InfoItem = ({ label, valor, cor = "#ffffff" }) => (
  <View style={styles.rowBetween}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[styles.detailValue, { color: cor }]}>
      {Number(valor || 0).toFixed(2)}
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
    shadowOpacity: 0.10,
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

  optionGrid: {
    gap: 12,
  },

  optionGridMobile: {
    gap: 12,
  },

  optionCard: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 18,
    padding: 12,
    marginBottom: 0,
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

  btn: {
    marginTop: 10,
    borderRadius: 18,
    backgroundColor: "#0a66c2",
    shadowColor: "#0a66c2",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.20,
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
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 3,
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

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },

  detailLabel: {
    fontSize: 14,
    color: "#cbd5e1",
    flex: 1,
    paddingRight: 10,
  },

  detailLabelStrong: {
    fontWeight: "800",
    color: "#ffffff",
  },

  detailValue: {
    fontSize: 14,
    fontWeight: "700",
  },

  detailValueStrong: {
    fontSize: 15,
    fontWeight: "900",
  },

  divider: {
    marginVertical: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  totalBox: {
    marginTop: 8,
    backgroundColor: "rgba(16,185,129,0.12)",
    borderRadius: 22,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.25)",
  },

  totalLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: "#86efac",
    letterSpacing: 1,
    marginBottom: 6,
  },

  total: {
    fontSize: 32,
    textAlign: "center",
    fontWeight: "900",
    color: "#22c55e",
  },
});