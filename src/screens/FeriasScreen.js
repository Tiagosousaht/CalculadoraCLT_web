import React, { useState, useMemo, useCallback, memo } from "react";
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

const inputTheme = {
  colors: {
    primary: "#0a66c2",
    outline: "rgba(255,255,255,0.14)",
    onSurfaceVariant: "#94a3b8",
    background: "#14233f",
  },
};

const MoneyItem = memo(
  ({ label, valor, cor = "#22c55e", destaque = false }) => (
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
  )
);

const InfoItem = memo(({ label, valor, cor = "#ffffff" }) => (
  <View style={styles.rowBetween}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[styles.detailValue, { color: cor }]}>
      {Number(valor || 0).toFixed(2)}
    </Text>
  </View>
));

export default function FeriasScreen({ navigation }) {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 1100;
  const isTablet = width >= 768 && width < 1100;
  const isMobile = width < 768;

  const [salario, setSalario] = useState("");
  const [mesesTrabalhados, setMesesTrabalhados] = useState("12");
  const [dependentes, setDependentes] = useState("0");
  const [vender10, setVender10] = useState(false);
  const [periculosidade, setPericulosidade] = useState(false);
  const [res, setRes] = useState(null);

  const calcular = useCallback(() => {
    const resultado = calcularFerias({
      salario: parseFloat((salario || "").replace(",", ".")) || 0,
      mesesTrabalhados:
        parseFloat((mesesTrabalhados || "").replace(",", ".")) || 0,
      dependentes: parseFloat((dependentes || "").replace(",", ".")) || 0,
      vender10,
      periculosidade,
    });

    setRes(resultado);
  }, [salario, mesesTrabalhados, dependentes, vender10, periculosidade]);

  const heroStyle = useMemo(
    () => [
      styles.hero,
      isDesktop && styles.heroDesktop,
      isTablet && styles.heroTablet,
      isMobile && styles.heroMobile,
    ],
    [isDesktop, isTablet, isMobile]
  );

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
            <View style={heroStyle}>
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

              <Text
                style={[
                  styles.pageTitle,
                  isTablet && styles.pageTitleTablet,
                  isMobile && styles.pageTitleMobile,
                ]}
              >
                Cálculo de Férias
              </Text>

              <Text
                style={[
                  styles.pageSubtitle,
                  isMobile && styles.pageSubtitleMobile,
                ]}
              >
                Veja férias proporcionais, abono, adicionais e descontos de forma
                clara, moderna e organizada.
              </Text>

              <View
                style={[
                  styles.heroInfoCard,
                  isMobile && styles.heroInfoCardMobile,
                ]}
              >
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

            <Card style={[styles.mainCard, isMobile && styles.mainCardMobile]}>
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

            {res !== null && (
              <Card style={[styles.resultCard, isMobile && styles.resultCardMobile]}>
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
                    <InfoItem
                      label="Meses Restantes"
                      valor={res.mesesRestantes}
                    />
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
    fontSize: 12,
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

  optionGrid: {
    marginTop: 2,
  },

  optionGridMobile: {},

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

  btn: {
    marginTop: 10,
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
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.22)",
  },

  totalLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: "#86efac",
    letterSpacing: 0.8,
    marginBottom: 6,
    textAlign: "center",
  },

  total: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "900",
    color: "#22c55e",
  },
});