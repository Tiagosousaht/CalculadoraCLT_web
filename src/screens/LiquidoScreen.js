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
  List,
  Switch,
  Divider,
  SegmentedButtons,
} from "react-native-paper";
import { calcularTrabalhistaCompleto } from "../utils/calculos";

const formatarMoeda = (valor) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(valor || 0));

const inputTheme = {
  colors: {
    onSurfaceVariant: "#94a3b8",
    outline: "rgba(255,255,255,0.10)",
    primary: "#60a5fa",
    background: "#14233f",
  },
};

const accordionTheme = {
  colors: {
    background: "#14233f",
    primary: "#60a5fa",
    onSurface: "#f8fafc",
    onSurfaceVariant: "#94a3b8",
  },
};

const Detalhamento = memo(({ label, valor, cor, destaque = false }) => (
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
));

export default function LiquidoScreen({ navigation }) {
  const { width } = useWindowDimensions();

  const isDesktop = width >= 1100;
  const isTablet = width >= 768 && width < 1100;
  const isMobile = width < 768;

  const [dados, setDados] = useState({
    bruto: "",
    dep: "0",
    pensao: "",
    vt: false,
    vr: "",

    h50: "",
    h70: "",
    h100: "",
    p50: "50",
    p70: "70",
    p100: "100",

    adicionalNoturno: false,
    hNoturna: "",
    pNoturna: "20",

    jornada: "220",
    periculosidade: false,
    insalubridade: false,
    grauInsalubridade: "20",
  });

  const [res, setRes] = useState(null);
  const [showExtra, setShowExtra] = useState(true);
  const [showHoras, setShowHoras] = useState(false);

  const updateCampo = useCallback((campo, valor) => {
    setDados((prev) => ({ ...prev, [campo]: valor }));
  }, []);

  const handlePericulosidade = useCallback((v) => {
    setDados((prev) => ({
      ...prev,
      periculosidade: v,
      insalubridade: v ? false : prev.insalubridade,
    }));
  }, []);

  const handleInsalubridade = useCallback((v) => {
    setDados((prev) => ({
      ...prev,
      insalubridade: v,
      periculosidade: v ? false : prev.periculosidade,
    }));
  }, []);

  const handleCalcular = useCallback(() => {
    const brutoNum = parseFloat((dados.bruto || "").replace(",", "."));
    if (!brutoNum) return;

    const resultado = calcularTrabalhistaCompleto({
      ...dados,
      bruto: brutoNum,
      dependentes: parseFloat((dados.dep || "0").replace(",", ".")) || 0,
      pensao: parseFloat((dados.pensao || "0").replace(",", ".")) || 0,
    });

    setRes(resultado);
  }, [dados]);

  const accordionLeftExtra = useCallback(
    (props) => (
      <List.Icon
        {...props}
        icon="shield-check-outline"
        color="#60a5fa"
      />
    ),
    []
  );

  const accordionLeftHoras = useCallback(
    (props) => <List.Icon {...props} icon="clock-outline" color="#60a5fa" />,
    []
  );

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
      <StatusBar barStyle="light-content" backgroundColor="#081120" />

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
                  <Text style={styles.heroMiniBadgeText}>2026</Text>
                </View>
              </View>

              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>Cálculo atualizado</Text>
              </View>

              <Text
                style={[
                  styles.pageTitle,
                  isTablet && styles.pageTitleTablet,
                  isMobile && styles.pageTitleMobile,
                ]}
              >
                Salário Líquido CLT
              </Text>

              <Text
                style={[
                  styles.pageSubtitle,
                  isMobile && styles.pageSubtitleMobile,
                ]}
              >
                Calcule descontos, adicionais, horas extras e adicional noturno
                com um visual mais simples, moderno e organizado.
              </Text>

              <View
                style={[
                  styles.heroInfoCard,
                  isMobile && styles.heroInfoCardMobile,
                ]}
              >
                <View style={styles.heroInfoItem}>
                  <Text style={styles.heroInfoValue}>INSS</Text>
                  <Text style={styles.heroInfoLabel}>Atual</Text>
                </View>

                <View style={styles.heroDivider} />

                <View style={styles.heroInfoItem}>
                  <Text style={styles.heroInfoValue}>IRRF</Text>
                  <Text style={styles.heroInfoLabel}>2026</Text>
                </View>

                <View style={styles.heroDivider} />

                <View style={styles.heroInfoItem}>
                  <Text style={styles.heroInfoValue}>CLT</Text>
                  <Text style={styles.heroInfoLabel}>Brasil</Text>
                </View>
              </View>
            </View>

            <Card style={[styles.mainCard, isMobile && styles.mainCardMobile]}>
              <Card.Content style={styles.cardContent}>
                <Text style={styles.sectionHeading}>Dados principais</Text>

                <TextInput
                  label="Salário Bruto"
                  value={dados.bruto}
                  onChangeText={(v) => updateCampo("bruto", v)}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Affix text="R$ " />}
                  outlineStyle={styles.inputOutline}
                  textColor="#f8fafc"
                  theme={inputTheme}
                />

                <List.Accordion
                  title="Adicionais e Descontos"
                  description="Periculosidade, insalubridade, VT, VR e dependentes"
                  expanded={showExtra}
                  onPress={() => setShowExtra((prev) => !prev)}
                  style={styles.accordion}
                  titleStyle={styles.accordionTitle}
                  descriptionStyle={styles.accordionDescription}
                  left={accordionLeftExtra}
                  theme={accordionTheme}
                >
                  <View style={styles.sectionBox}>
                    <View style={styles.optionCard}>
                      <View style={styles.switchRow}>
                        <View style={styles.switchTextArea}>
                          <Text style={styles.switchTitle}>Periculosidade</Text>
                          <Text style={styles.switchSubtitle}>
                            Adicional de 30% sobre o salário
                          </Text>
                        </View>
                        <Switch
                          value={dados.periculosidade}
                          onValueChange={handlePericulosidade}
                        />
                      </View>

                      <View style={styles.switchRow}>
                        <View style={styles.switchTextArea}>
                          <Text style={styles.switchTitle}>Insalubridade</Text>
                          <Text style={styles.switchSubtitle}>
                            Não acumula com periculosidade
                          </Text>
                        </View>
                        <Switch
                          value={dados.insalubridade}
                          onValueChange={handleInsalubridade}
                        />
                      </View>

                      {dados.insalubridade && (
                        <View style={styles.segmentArea}>
                          <Text style={styles.segmentLabel}>
                            Grau da insalubridade
                          </Text>
                          <SegmentedButtons
                            value={dados.grauInsalubridade}
                            onValueChange={(v) =>
                              updateCampo("grauInsalubridade", v)
                            }
                            buttons={[
                              { value: "10", label: "10%" },
                              { value: "20", label: "20%" },
                              { value: "40", label: "40%" },
                            ]}
                          />
                        </View>
                      )}
                    </View>

                    <Divider style={styles.innerDivider} />

                    <View
                      style={[
                        styles.responsiveRow,
                        isMobile && styles.responsiveColumn,
                      ]}
                    >
                      <TextInput
                        label="Dependentes"
                        keyboardType="numeric"
                        mode="outlined"
                        style={[
                          styles.inputFlex,
                          !isMobile && styles.inputFlexRight,
                        ]}
                        value={dados.dep}
                        onChangeText={(v) => updateCampo("dep", v)}
                        outlineStyle={styles.inputOutline}
                        textColor="#f8fafc"
                        theme={inputTheme}
                      />

                      <TextInput
                        label="Pensão"
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.inputFlex}
                        value={dados.pensao}
                        onChangeText={(v) => updateCampo("pensao", v)}
                        outlineStyle={styles.inputOutline}
                        textColor="#f8fafc"
                        theme={inputTheme}
                      />
                    </View>

                    <View style={styles.optionCard}>
                      <View style={styles.switchRow}>
                        <View style={styles.switchTextArea}>
                          <Text style={styles.switchTitle}>Vale Transporte</Text>
                          <Text style={styles.switchSubtitle}>
                            Desconto padrão de 6%
                          </Text>
                        </View>
                        <Switch
                          value={dados.vt}
                          onValueChange={(v) => updateCampo("vt", v)}
                        />
                      </View>
                    </View>

                    <TextInput
                      label="Vale Refeição"
                      keyboardType="numeric"
                      mode="outlined"
                      style={styles.input}
                      value={dados.vr}
                      onChangeText={(v) => updateCampo("vr", v)}
                      left={<TextInput.Affix text="R$ " />}
                      outlineStyle={styles.inputOutline}
                      textColor="#f8fafc"
                      theme={inputTheme}
                    />
                  </View>
                </List.Accordion>

                <List.Accordion
                  title="Horas Extras e Adicional Noturno"
                  description="Informe percentuais e quantidade de horas"
                  expanded={showHoras}
                  onPress={() => setShowHoras((prev) => !prev)}
                  style={styles.accordion}
                  titleStyle={styles.accordionTitle}
                  descriptionStyle={styles.accordionDescription}
                  left={accordionLeftHoras}
                  theme={accordionTheme}
                >
                  <View style={styles.sectionBox}>
                    <View style={styles.helperBox}>
                      <Text style={styles.helperText}>
                        Ajuste os percentuais e a quantidade de horas de cada
                        faixa.
                      </Text>
                    </View>

                    <View style={styles.hoursGrid}>
                      <View style={styles.hourCard}>
                        <Text style={styles.hourCardTitle}>Hora extra 50%</Text>
                        <View
                          style={[
                            styles.hourCardRow,
                            isMobile && styles.hourCardColumn,
                          ]}
                        >
                          <TextInput
                            label="% Extra"
                            value={dados.p50}
                            mode="outlined"
                            keyboardType="numeric"
                            style={[
                              styles.hourSmallInput,
                              isMobile && styles.hourSmallInputMobile,
                            ]}
                            onChangeText={(v) => updateCampo("p50", v)}
                            outlineStyle={styles.inputOutline}
                            textColor="#f8fafc"
                            theme={inputTheme}
                          />
                          <TextInput
                            label="Horas"
                            value={dados.h50}
                            mode="outlined"
                            keyboardType="numeric"
                            style={styles.hourLargeInput}
                            onChangeText={(v) => updateCampo("h50", v)}
                            outlineStyle={styles.inputOutline}
                            textColor="#f8fafc"
                            theme={inputTheme}
                          />
                        </View>
                      </View>

                      <View style={styles.hourCard}>
                        <Text style={styles.hourCardTitle}>Hora extra 70%</Text>
                        <View
                          style={[
                            styles.hourCardRow,
                            isMobile && styles.hourCardColumn,
                          ]}
                        >
                          <TextInput
                            label="% Extra"
                            value={dados.p70}
                            mode="outlined"
                            keyboardType="numeric"
                            style={[
                              styles.hourSmallInput,
                              isMobile && styles.hourSmallInputMobile,
                            ]}
                            onChangeText={(v) => updateCampo("p70", v)}
                            outlineStyle={styles.inputOutline}
                            textColor="#f8fafc"
                            theme={inputTheme}
                          />
                          <TextInput
                            label="Horas"
                            value={dados.h70}
                            mode="outlined"
                            keyboardType="numeric"
                            style={styles.hourLargeInput}
                            onChangeText={(v) => updateCampo("h70", v)}
                            outlineStyle={styles.inputOutline}
                            textColor="#f8fafc"
                            theme={inputTheme}
                          />
                        </View>
                      </View>

                      <View style={styles.hourCard}>
                        <Text style={styles.hourCardTitle}>Hora extra 100%</Text>
                        <View
                          style={[
                            styles.hourCardRow,
                            isMobile && styles.hourCardColumn,
                          ]}
                        >
                          <TextInput
                            label="% Extra"
                            value={dados.p100}
                            mode="outlined"
                            keyboardType="numeric"
                            style={[
                              styles.hourSmallInput,
                              isMobile && styles.hourSmallInputMobile,
                            ]}
                            onChangeText={(v) => updateCampo("p100", v)}
                            outlineStyle={styles.inputOutline}
                            textColor="#f8fafc"
                            theme={inputTheme}
                          />
                          <TextInput
                            label="Horas"
                            value={dados.h100}
                            mode="outlined"
                            keyboardType="numeric"
                            style={styles.hourLargeInput}
                            onChangeText={(v) => updateCampo("h100", v)}
                            outlineStyle={styles.inputOutline}
                            textColor="#f8fafc"
                            theme={inputTheme}
                          />
                        </View>
                      </View>
                    </View>

                    <Divider style={styles.innerDivider} />

                    <View style={styles.optionCard}>
                      <View style={styles.switchRow}>
                        <View style={styles.switchTextArea}>
                          <Text style={styles.switchTitle}>Adicional Noturno</Text>
                          <Text style={styles.switchSubtitle}>
                            Mesmo padrão das horas extras
                          </Text>
                        </View>
                        <Switch
                          value={dados.adicionalNoturno}
                          onValueChange={(v) =>
                            updateCampo("adicionalNoturno", v)
                          }
                        />
                      </View>
                    </View>

                    {dados.adicionalNoturno && (
                      <View style={styles.hourCard}>
                        <Text style={styles.hourCardTitle}>Adicional noturno</Text>
                        <View
                          style={[
                            styles.hourCardRow,
                            isMobile && styles.hourCardColumn,
                          ]}
                        >
                          <TextInput
                            label="% Noturno"
                            value={dados.pNoturna}
                            mode="outlined"
                            keyboardType="numeric"
                            style={[
                              styles.hourSmallInput,
                              isMobile && styles.hourSmallInputMobile,
                            ]}
                            onChangeText={(v) => updateCampo("pNoturna", v)}
                            outlineStyle={styles.inputOutline}
                            textColor="#f8fafc"
                            theme={inputTheme}
                          />
                          <TextInput
                            label="Horas"
                            value={dados.hNoturna}
                            mode="outlined"
                            keyboardType="numeric"
                            style={styles.hourLargeInput}
                            onChangeText={(v) => updateCampo("hNoturna", v)}
                            outlineStyle={styles.inputOutline}
                            textColor="#f8fafc"
                            theme={inputTheme}
                          />
                        </View>
                      </View>
                    )}

                    <TextInput
                      label="Jornada Mensal"
                      value={dados.jornada}
                      mode="outlined"
                      keyboardType="numeric"
                      style={styles.input}
                      onChangeText={(v) => updateCampo("jornada", v)}
                      outlineStyle={styles.inputOutline}
                      textColor="#f8fafc"
                      theme={inputTheme}
                    />
                  </View>
                </List.Accordion>

                <Button
                  mode="contained"
                  onPress={handleCalcular}
                  style={styles.btn}
                  contentStyle={styles.btnContent}
                  labelStyle={styles.btnLabel}
                >
                  CALCULAR AGORA
                </Button>
              </Card.Content>
            </Card>

            {res !== null && (
              <Card style={[styles.resultCard, isMobile && styles.resultCardMobile]}>
                <Card.Content style={styles.resultContent}>
                  <View style={styles.resultHeader}>
                    <Text style={styles.resultTitle}>Resumo do Salário</Text>
                    <Text style={styles.resultSubtitle}>
                      Veja como o valor líquido foi composto
                    </Text>
                  </View>

                  <View style={styles.resultSection}>
                    <Text style={styles.resultSectionTitle}>Proventos</Text>

                    <Detalhamento
                      label="Salário Base"
                      valor={res.bruto}
                      cor="#22c55e"
                      destaque
                    />

                    {res.adicional > 0 && (
                      <Detalhamento
                        label={`Adicional (${res.adicionalAplicado})`}
                        valor={res.adicional}
                        cor="#22c55e"
                      />
                    )}

                    {res.totalExtras > 0 && (
                      <Detalhamento
                        label="Horas Extras"
                        valor={res.totalExtras}
                        cor="#22c55e"
                      />
                    )}

                    {res.adicionalNoturnoValor > 0 && (
                      <Detalhamento
                        label="Adicional Noturno"
                        valor={res.adicionalNoturnoValor}
                        cor="#22c55e"
                      />
                    )}

                    <Divider style={styles.divider} />

                    <Detalhamento
                      label="Bruto Total"
                      valor={res.novoBrutoTotal}
                      cor="#f8fafc"
                      destaque
                    />
                  </View>

                  <View style={styles.resultSection}>
                    <Text style={styles.resultSectionTitle}>Descontos</Text>

                    {res.fgts > 0 && (
                      <Detalhamento
                        label="FGTS (depósito)"
                        valor={res.fgts}
                        cor="#60a5fa"
                      />
                    )}

                    <Detalhamento label="INSS" valor={-res.inss} cor="#f87171" />

                    {res.irrfSemReducao > 0 && (
                      <Detalhamento
                        label="IRRF antes da redução"
                        valor={-res.irrfSemReducao}
                        cor="#f87171"
                      />
                    )}

                    {res.reducaoIRRF > 0 && (
                      <Detalhamento
                        label="Redução IRRF 2026"
                        valor={res.reducaoIRRF}
                        cor="#22c55e"
                      />
                    )}

                    <Detalhamento
                      label="IRRF final"
                      valor={-res.irrf}
                      cor="#f87171"
                    />

                    {res.descontoVT > 0 && (
                      <Detalhamento
                        label="Vale Transporte"
                        valor={-res.descontoVT}
                        cor="#f87171"
                      />
                    )}

                    {res.descontoVR > 0 && (
                      <Detalhamento
                        label="Vale Refeição"
                        valor={-res.descontoVR}
                        cor="#f87171"
                      />
                    )}

                    {res.descontoPensao > 0 && (
                      <Detalhamento
                        label="Pensão"
                        valor={-res.descontoPensao}
                        cor="#f87171"
                      />
                    )}
                  </View>

                  <View style={styles.totalBox}>
                    <Text style={styles.totalLabel}>LÍQUIDO A RECEBER</Text>
                    <Text style={styles.total}>{formatarMoeda(res.liquido)}</Text>
                  </View>

                  <Text style={styles.obsText}>
                    Cálculo com tabela mensal de INSS e IRRF vigente em 2026.
                  </Text>
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
    backgroundColor: "#081120",
  },

  container: {
    flex: 1,
    backgroundColor: "#081120",
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
    maxWidth: 1180,
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
    backgroundColor: "rgba(37,99,235,0.10)",
  },

  glowTwo: {
    position: "absolute",
    top: 320,
    left: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(34,197,94,0.05)",
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
    backgroundColor: "rgba(96,165,250,0.16)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  heroMiniBadgeText: {
    color: "#bfdbfe",
    fontSize: 12,
    fontWeight: "800",
  },

  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(96,165,250,0.16)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(147,197,253,0.20)",
  },

  heroBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#bfdbfe",
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
    backgroundColor: "#0f1a30",
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
    backgroundColor: "#14233f",
  },

  inputOutline: {
    borderRadius: 15,
    borderWidth: 1.1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  accordion: {
    backgroundColor: "#14233f",
    borderRadius: 18,
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.10)",
  },

  accordionTitle: {
    fontWeight: "800",
    color: "#f8fafc",
    fontSize: 15,
  },

  accordionDescription: {
    color: "#94a3b8",
    fontSize: 12,
  },

  sectionBox: {
    paddingHorizontal: 12,
    paddingBottom: 14,
    paddingTop: 6,
    backgroundColor: "#14233f",
  },

  optionCard: {
    backgroundColor: "#162846",
    borderRadius: 16,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.08)",
  },

  responsiveRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  responsiveColumn: {
    flexDirection: "column",
    alignItems: "stretch",
  },

  inputFlex: {
    flex: 1,
    backgroundColor: "#14233f",
  },

  inputFlexRight: {
    marginRight: 10,
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 6,
  },

  switchTextArea: {
    flex: 1,
    paddingRight: 10,
  },

  switchTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#f8fafc",
  },

  switchSubtitle: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 3,
    lineHeight: 17,
  },

  segmentArea: {
    marginTop: 10,
    marginBottom: 4,
  },

  segmentLabel: {
    fontSize: 13,
    color: "#cbd5e1",
    marginBottom: 8,
    fontWeight: "700",
  },

  innerDivider: {
    marginVertical: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  helperBox: {
    backgroundColor: "rgba(96,165,250,0.06)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.10)",
  },

  helperText: {
    fontSize: 12,
    color: "#bfdbfe",
    lineHeight: 18,
    fontWeight: "500",
  },

  hoursGrid: {},

  hourCard: {
    backgroundColor: "#162846",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.08)",
    marginBottom: 12,
  },

  hourCardTitle: {
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 10,
  },

  hourCardRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  hourCardColumn: {
    flexDirection: "column",
    alignItems: "stretch",
  },

  hourSmallInput: {
    flex: 1,
    backgroundColor: "#1a2c4d",
    marginRight: 10,
  },

  hourSmallInputMobile: {
    marginRight: 0,
    marginBottom: 10,
  },

  hourLargeInput: {
    flex: 1.6,
    backgroundColor: "#1a2c4d",
  },

  btn: {
    marginTop: 10,
    borderRadius: 16,
    backgroundColor: "#2563eb",
    shadowColor: "#2563eb",
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
    backgroundColor: "#0f1a30",
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
    backgroundColor: "#111c34",
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
    backgroundColor: "rgba(34,197,94,0.10)",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.16)",
  },

  totalLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: "#86efac",
    letterSpacing: 0.8,
    marginBottom: 6,
  },

  total: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "900",
    color: "#22c55e",
  },

  obsText: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});