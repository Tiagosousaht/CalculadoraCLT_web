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

  const handleCalcular = () => {
    const brutoNum = parseFloat((dados.bruto || "").replace(",", "."));
    if (!brutoNum) return;

    const resultado = calcularTrabalhistaCompleto({
      ...dados,
      bruto: brutoNum,
      dependentes: parseFloat((dados.dep || "0").replace(",", ".")) || 0,
      pensao: parseFloat((dados.pensao || "0").replace(",", ".")) || 0,
    });

    setRes(resultado);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#081120" />

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
                  <Text style={styles.heroMiniBadgeText}>2026</Text>
                </View>
              </View>

              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>Cálculo atualizado</Text>
              </View>

              <Text style={styles.pageTitle}>Salário Líquido CLT</Text>
              <Text style={styles.pageSubtitle}>
                Calcule descontos, adicionais, horas extras e adicional noturno
                com um visual mais simples, moderno e organizado.
              </Text>

              <View style={styles.heroInfoCard}>
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

            <Card style={styles.mainCard}>
              <Card.Content style={styles.cardContent}>
                <Text style={styles.sectionHeading}>Dados principais</Text>

                <TextInput
                  label="Salário Bruto"
                  value={dados.bruto}
                  onChangeText={(v) => setDados({ ...dados, bruto: v })}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Affix text="R$ " />}
                  outlineStyle={styles.inputOutline}
                  textColor="#f8fafc"
                  theme={{
                    colors: {
                      onSurfaceVariant: "#94a3b8",
                      outline: "rgba(255,255,255,0.10)",
                      primary: "#60a5fa",
                    },
                  }}
                />

                <List.Accordion
                  title="Adicionais e Descontos"
                  description="Periculosidade, insalubridade, VT, VR e dependentes"
                  expanded={showExtra}
                  onPress={() => setShowExtra(!showExtra)}
                  style={styles.accordion}
                  titleStyle={styles.accordionTitle}
                  descriptionStyle={styles.accordionDescription}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon="shield-check-outline"
                      color="#60a5fa"
                    />
                  )}
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
                          onValueChange={(v) =>
                            setDados({
                              ...dados,
                              periculosidade: v,
                              insalubridade: v ? false : dados.insalubridade,
                            })
                          }
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
                          onValueChange={(v) =>
                            setDados({
                              ...dados,
                              insalubridade: v,
                              periculosidade: v ? false : dados.periculosidade,
                            })
                          }
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
                              setDados({ ...dados, grauInsalubridade: v })
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
                          !isMobile && { marginRight: 10 },
                        ]}
                        value={dados.dep}
                        onChangeText={(v) => setDados({ ...dados, dep: v })}
                        outlineStyle={styles.inputOutline}
                        textColor="#f8fafc"
                        theme={{
                          colors: {
                            onSurfaceVariant: "#94a3b8",
                            outline: "rgba(255,255,255,0.10)",
                            primary: "#60a5fa",
                          },
                        }}
                      />

                      <TextInput
                        label="Pensão"
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.inputFlex}
                        value={dados.pensao}
                        onChangeText={(v) => setDados({ ...dados, pensao: v })}
                        outlineStyle={styles.inputOutline}
                        textColor="#f8fafc"
                        theme={{
                          colors: {
                            onSurfaceVariant: "#94a3b8",
                            outline: "rgba(255,255,255,0.10)",
                            primary: "#60a5fa",
                          },
                        }}
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
                          onValueChange={(v) => setDados({ ...dados, vt: v })}
                        />
                      </View>
                    </View>

                    <TextInput
                      label="Vale Refeição"
                      keyboardType="numeric"
                      mode="outlined"
                      style={styles.input}
                      value={dados.vr}
                      onChangeText={(v) => setDados({ ...dados, vr: v })}
                      left={<TextInput.Affix text="R$ " />}
                      outlineStyle={styles.inputOutline}
                      textColor="#f8fafc"
                      theme={{
                        colors: {
                          onSurfaceVariant: "#94a3b8",
                          outline: "rgba(255,255,255,0.10)",
                          primary: "#60a5fa",
                        },
                      }}
                    />
                  </View>
                </List.Accordion>

                <List.Accordion
                  title="Horas Extras e Adicional Noturno"
                  description="Informe percentuais e quantidade de horas"
                  expanded={showHoras}
                  onPress={() => setShowHoras(!showHoras)}
                  style={styles.accordion}
                  titleStyle={styles.accordionTitle}
                  descriptionStyle={styles.accordionDescription}
                  left={(props) => (
                    <List.Icon {...props} icon="clock-outline" color="#60a5fa" />
                  )}
                >
                  <View style={styles.sectionBox}>
                    <View style={styles.helperBox}>
                      <Text style={styles.helperText}>
                        Ajuste os percentuais e a quantidade de horas de cada faixa.
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
                            onChangeText={(v) => setDados({ ...dados, p50: v })}
                            outlineStyle={styles.inputOutline}
                            textColor="#f8fafc"
                            theme={{
                              colors: {
                                onSurfaceVariant: "#94a3b8",
                                outline: "rgba(255,255,255,0.10)",
                                primary: "#60a5fa",
                              },
                            }}
                          />
                          <TextInput
                            label="Horas"
                            value={dados.h50}
                            mode="outlined"
                            keyboardType="numeric"
                            style={styles.hourLargeInput}
                            onChangeText={(v) => setDados({ ...dados, h50: v })}
                            outlineStyle={styles.inputOutline}
                            textColor="#f8fafc"
                            theme={{
                              colors: {
                                onSurfaceVariant: "#94a3b8",
                                outline: "rgba(255,255,255,0.10)",
                                primary: "#60a5fa",
                              },
                            }}
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
                            onChangeText={(v) => setDados({ ...dados, p70: v })}
                            outlineStyle={styles.inputOutline}
                            textColor="#f8fafc"
                            theme={{
                              colors: {
                                onSurfaceVariant: "#94a3b8",
                                outline: "rgba(255,255,255,0.10)",
                                primary: "#60a5fa",
                              },
                            }}
                          />
                          <TextInput
                            label="Horas"
                            value={dados.h70}
                            mode="outlined"
                            keyboardType="numeric"
                            style={styles.hourLargeInput}
                            onChangeText={(v) => setDados({ ...dados, h70: v })}
                            outlineStyle={styles.inputOutline}
                            textColor="#f8fafc"
                            theme={{
                              colors: {
                                onSurfaceVariant: "#94a3b8",
                                outline: "rgba(255,255,255,0.10)",
                                primary: "#60a5fa",
                              },
                            }}
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
                            onChangeText={(v) => setDados({ ...dados, p100: v })}
                            outlineStyle={styles.inputOutline}
                            textColor="#f8fafc"
                            theme={{
                              colors: {
                                onSurfaceVariant: "#94a3b8",
                                outline: "rgba(255,255,255,0.10)",
                                primary: "#60a5fa",
                              },
                            }}
                          />
                          <TextInput
                            label="Horas"
                            value={dados.h100}
                            mode="outlined"
                            keyboardType="numeric"
                            style={styles.hourLargeInput}
                            onChangeText={(v) => setDados({ ...dados, h100: v })}
                            outlineStyle={styles.inputOutline}
                            textColor="#f8fafc"
                            theme={{
                              colors: {
                                onSurfaceVariant: "#94a3b8",
                                outline: "rgba(255,255,255,0.10)",
                                primary: "#60a5fa",
                              },
                            }}
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
                            setDados({ ...dados, adicionalNoturno: v })
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
                            onChangeText={(v) =>
                              setDados({ ...dados, pNoturna: v })
                            }
                            outlineStyle={styles.inputOutline}
                            textColor="#f8fafc"
                            theme={{
                              colors: {
                                onSurfaceVariant: "#94a3b8",
                                outline: "rgba(255,255,255,0.10)",
                                primary: "#60a5fa",
                              },
                            }}
                          />
                          <TextInput
                            label="Horas"
                            value={dados.hNoturna}
                            mode="outlined"
                            keyboardType="numeric"
                            style={styles.hourLargeInput}
                            onChangeText={(v) =>
                              setDados({ ...dados, hNoturna: v })
                            }
                            outlineStyle={styles.inputOutline}
                            textColor="#f8fafc"
                            theme={{
                              colors: {
                                onSurfaceVariant: "#94a3b8",
                                outline: "rgba(255,255,255,0.10)",
                                primary: "#60a5fa",
                              },
                            }}
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
                      onChangeText={(v) => setDados({ ...dados, jornada: v })}
                      outlineStyle={styles.inputOutline}
                      textColor="#f8fafc"
                      theme={{
                        colors: {
                          onSurfaceVariant: "#94a3b8",
                          outline: "rgba(255,255,255,0.10)",
                          primary: "#60a5fa",
                        },
                      }}
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

            {res && (
              <Card style={styles.resultCard}>
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

const Detalhamento = ({ label, valor, cor, destaque = false }) => (
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
    maxWidth: 1180,
    alignSelf: "center",
    paddingHorizontal: 14,
  },

  glowOne: {
    position: "absolute",
    top: -70,
    right: -20,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(37,99,235,0.20)",
  },

  glowTwo: {
    position: "absolute",
    top: 320,
    left: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(34,197,94,0.10)",
  },

  hero: {
    backgroundColor: "#111c34",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
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
    backgroundColor: "rgba(96,165,250,0.18)",
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
    fontSize: 16,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 4,
  },

  heroInfoLabel: {
    fontSize: 12,
    color: "#cbd5e1",
    fontWeight: "600",
  },

  heroDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.14)",
  },

  mainCard: {
    borderRadius: 24,
    marginBottom: 18,
    backgroundColor: "#0f1a30",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
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
    backgroundColor: "#14233f",
  },

  inputOutline: {
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: "rgba(255,255,255,0.10)",
  },

  accordion: {
    backgroundColor: "#13203a",
    borderRadius: 20,
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.14)",
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
    backgroundColor: "#0f1a30",
  },

  optionCard: {
    backgroundColor: "#14233f",
    borderRadius: 18,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.10)",
  },

  responsiveRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  responsiveColumn: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 12,
  },

  inputFlex: {
    flex: 1,
    backgroundColor: "#14233f",
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
    backgroundColor: "rgba(96,165,250,0.10)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.14)",
  },

  helperText: {
    fontSize: 12,
    color: "#bfdbfe",
    lineHeight: 18,
    fontWeight: "500",
  },

  hoursGrid: {
    gap: 12,
  },

  hourCard: {
    backgroundColor: "#14233f",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.10)",
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
    borderRadius: 18,
    backgroundColor: "#2563eb",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
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
    backgroundColor: "#0f1a30",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
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
    backgroundColor: "#111c34",
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
    backgroundColor: "rgba(34,197,94,0.10)",
    borderRadius: 22,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.18)",
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

  obsText: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});