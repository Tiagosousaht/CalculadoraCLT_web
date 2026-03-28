import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  StatusBar,
  TouchableOpacity,
  useWindowDimensions,
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
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as Linking from "expo-linking";
import { calcularRescisao } from "../utils/calculosAcerto";
import CampoData from "../../components/CampoData";

const formatarMoeda = (valor) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(valor || 0));

const formatarData = (data) => {
  if (!data || !(data instanceof Date) || isNaN(data.getTime())) {
    return "Selecionar";
  }

  return new Intl.DateTimeFormat("pt-BR").format(data);
};

export default function RescisaoScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1100;

  const [dados, setDados] = useState({
    bruto: "",
    tipo: "semJusta",
    aviso: "trabalhado",
    fgts: "",
    modoFGTS: "manual",
    incluirFGTSNoTotal: false,
    admissao: null,
    desligamento: new Date(),
    periculosidade: false,
  });

  const [res, setRes] = useState(null);
  const [showAdmissao, setShowAdmissao] = useState(false);
  const [showDesligamento, setShowDesligamento] = useState(false);

  const inputTheme = {
    colors: {
      primary: "#0a66c2",
      outline: "rgba(255,255,255,0.14)",
      onSurfaceVariant: "#94a3b8",
    },
  };

  const brutoNum = useMemo(
    () => parseFloat((dados.bruto || "").replace(",", ".")) || 0,
    [dados.bruto],
  );

  const fgtsNum = useMemo(
    () => parseFloat((dados.fgts || "").replace(",", ".")) || 0,
    [dados.fgts],
  );

  const atualizarCampo = (campo, valor) => {
    setDados((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleCalcular = () => {
    if (!brutoNum || brutoNum <= 0) {
      Alert.alert("Atenção", "Informe um salário bruto válido.");
      return;
    }

    if (
      !dados.admissao ||
      !(dados.admissao instanceof Date) ||
      isNaN(dados.admissao.getTime())
    ) {
      Alert.alert("Atenção", "Selecione uma data de admissão válida.");
      return;
    }

    if (
      !dados.desligamento ||
      !(dados.desligamento instanceof Date) ||
      isNaN(dados.desligamento.getTime())
    ) {
      Alert.alert("Atenção", "Selecione uma data de desligamento válida.");
      return;
    }

    if (dados.desligamento < dados.admissao) {
      Alert.alert(
        "Atenção",
        "A data de desligamento não pode ser anterior à admissão.",
      );
      return;
    }

    const resultado = calcularRescisao({
      bruto: brutoNum,
      tipoDemissao: dados.tipo,
      avisoPrevio: dados.aviso,
      saldoFGTS: fgtsNum,
      modoFGTS: dados.modoFGTS,
      incluirFGTSNoTotal: dados.incluirFGTSNoTotal,
      admissao: dados.admissao,
      desligamento: dados.desligamento,
      periculosidade: dados.periculosidade,
    });

    setRes(resultado);
  };

  const gerarHtmlRescisao = () => {
    if (!res) return "";

    const tituloTotal =
      dados.incluirFGTSNoTotal && dados.tipo === "semJusta"
        ? "Total com FGTS"
        : "Total líquido";

    return `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 24px;
              color: #222;
            }
            h1 {
              text-align: center;
              color: #0a66c2;
              margin-bottom: 20px;
            }
            .bloco {
              border: 1px solid #ddd;
              border-radius: 10px;
              padding: 16px;
              margin-bottom: 16px;
            }
            .linha {
              display: flex;
              justify-content: space-between;
              margin: 8px 0;
              font-size: 14px;
            }
            .titulo {
              font-weight: bold;
              margin-bottom: 10px;
              color: #444;
            }
            .negativo {
              color: #d32f2f;
              font-weight: bold;
            }
            .positivo {
              color: #2e7d32;
              font-weight: bold;
            }
            .total {
              text-align: center;
              font-size: 24px;
              font-weight: bold;
              color: #0a66c2;
              margin-top: 18px;
            }
          </style>
        </head>
        <body>
          <h1>Resumo da Rescisão</h1>

          <div class="bloco">
            <div class="titulo">Dados</div>
            <div class="linha"><span>Admissão</span><span>${formatarData(
              dados.admissao,
            )}</span></div>
            <div class="linha"><span>Desligamento</span><span>${formatarData(
              dados.desligamento,
            )}</span></div>
            <div class="linha"><span>Tempo total</span><span>${
              res.tempoFormatado
            }</span></div>
            <div class="linha"><span>Motivo</span><span>${
              dados.tipo === "semJusta"
                ? "Sem Justa Causa"
                : "Pedido de Demissão"
            }</span></div>
            <div class="linha"><span>Aviso prévio</span><span>${
              dados.aviso === "indenizado" ? "Indenizado" : "Trabalhado"
            }</span></div>
            ${
              dados.tipo === "semJusta"
                ? `<div class="linha"><span>Modo FGTS</span><span>${
                    dados.modoFGTS === "manual"
                      ? "Saldo informado"
                      : "Calculado pelo salário"
                  }</span></div>`
                : ""
            }
          </div>

          <div class="bloco">
            <div class="titulo">Base de cálculo</div>
            <div class="linha"><span>Salário base</span><span>${formatarMoeda(
              res.salarioBase,
            )}</span></div>
            <div class="linha"><span>Periculosidade</span><span>${formatarMoeda(
              res.valorPericulosidade,
            )}</span></div>
            <div class="linha"><span>Salário para cálculo</span><span>${formatarMoeda(
              res.salarioCalculado,
            )}</span></div>
          </div>

          <div class="bloco">
            <div class="titulo">Verbas</div>
            <div class="linha"><span>Saldo de salário</span><span>${formatarMoeda(
              res.saldoSalario,
            )}</span></div>
            <div class="linha"><span>13º proporcional</span><span>${formatarMoeda(
              res.decimoProporcional,
            )}</span></div>
            <div class="linha"><span>Férias proporcionais</span><span>${formatarMoeda(
              res.feriasProporcionais,
            )}</span></div>
            <div class="linha"><span>1/3 férias proporcionais</span><span>${formatarMoeda(
              res.umTercoFeriasProporcionais,
            )}</span></div>
            <div class="linha"><span>Férias vencidas</span><span>${formatarMoeda(
              res.feriasVencidas,
            )}</span></div>
            <div class="linha"><span>1/3 férias vencidas</span><span>${formatarMoeda(
              res.umTercoFeriasVencidas,
            )}</span></div>
            <div class="linha"><span>Aviso prévio</span><span>${formatarMoeda(
              res.valorAviso,
            )}</span></div>
            <div class="linha"><span>Multa FGTS</span><span>${formatarMoeda(
              res.multaFGTS,
            )}</span></div>
            ${
              res.saldoFGTSCalculado > 0
                ? `<div class="linha"><span>Saldo FGTS</span><span class="positivo">${formatarMoeda(
                    res.saldoFGTSCalculado,
                  )}</span></div>`
                : ""
            }
          </div>

          <div class="bloco">
            <div class="titulo">Descontos</div>
            <div class="linha"><span>INSS</span><span class="negativo">${formatarMoeda(
              res.inss,
            )}</span></div>
            <div class="linha"><span>IRRF</span><span class="negativo">${formatarMoeda(
              res.irrf,
            )}</span></div>
          </div>

          <div class="bloco">
            <div class="titulo">Totais</div>
            <div class="linha"><span>Líquido da rescisão</span><span>${formatarMoeda(
              res.liquidoRescisao,
            )}</span></div>
            ${
              dados.tipo === "semJusta"
                ? `<div class="linha"><span>Total com FGTS</span><span>${formatarMoeda(
                    res.totalReceberComFGTS,
                  )}</span></div>`
                : ""
            }
          </div>

          <div class="total">
            ${tituloTotal}: ${formatarMoeda(res.liquido)}
          </div>
        </body>
      </html>
    `;
  };

  const gerarPdf = async () => {
    try {
      if (!res) {
        Alert.alert("Atenção", "Calcule a rescisão antes de gerar o PDF.");
        return null;
      }

      const html = gerarHtmlRescisao();
      const { uri } = await Print.printToFileAsync({ html });
      Alert.alert("PDF gerado", "Arquivo criado com sucesso.");
      return uri;
    } catch {
      Alert.alert("Erro", "Não foi possível gerar o PDF.");
      return null;
    }
  };

  const compartilharPdf = async () => {
    try {
      if (!res) {
        Alert.alert("Atenção", "Calcule a rescisão antes de compartilhar.");
        return;
      }

      const uri = await gerarPdf();
      if (!uri) return;

      const disponivel = await Sharing.isAvailableAsync();
      if (!disponivel) {
        Alert.alert(
          "Atenção",
          "Compartilhamento não disponível neste dispositivo.",
        );
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Compartilhar PDF da rescisão",
        UTI: "com.adobe.pdf",
      });
    } catch {
      Alert.alert("Erro", "Não foi possível compartilhar o PDF.");
    }
  };

  const compartilharWhatsapp = async () => {
    try {
      if (!res) {
        Alert.alert("Atenção", "Calcule a rescisão antes de compartilhar.");
        return;
      }

      const mensagem =
        `*Resumo da Rescisão*%0A%0A` +
        `Tempo total: ${encodeURIComponent(res.tempoFormatado)}%0A` +
        `Salário base: ${encodeURIComponent(formatarMoeda(res.salarioBase))}%0A` +
        `Periculosidade: ${encodeURIComponent(formatarMoeda(res.valorPericulosidade))}%0A` +
        `Salário para cálculo: ${encodeURIComponent(formatarMoeda(res.salarioCalculado))}%0A` +
        `Saldo de salário: ${encodeURIComponent(formatarMoeda(res.saldoSalario))}%0A` +
        `13º proporcional: ${encodeURIComponent(formatarMoeda(res.decimoProporcional))}%0A` +
        `Férias proporcionais: ${encodeURIComponent(formatarMoeda(res.feriasProporcionais))}%0A` +
        `1/3 férias proporcionais: ${encodeURIComponent(formatarMoeda(res.umTercoFeriasProporcionais))}%0A` +
        `Férias vencidas: ${encodeURIComponent(formatarMoeda(res.feriasVencidas))}%0A` +
        `1/3 férias vencidas: ${encodeURIComponent(formatarMoeda(res.umTercoFeriasVencidas))}%0A` +
        `Aviso prévio: ${encodeURIComponent(formatarMoeda(res.valorAviso))}%0A` +
        `Multa FGTS: ${encodeURIComponent(formatarMoeda(res.multaFGTS))}%0A` +
        `Saldo FGTS: ${encodeURIComponent(formatarMoeda(res.saldoFGTSCalculado))}%0A` +
        `INSS: ${encodeURIComponent(formatarMoeda(res.inss))}%0A` +
        `IRRF: ${encodeURIComponent(formatarMoeda(res.irrf))}%0A` +
        `Líquido da rescisão: ${encodeURIComponent(formatarMoeda(res.liquidoRescisao))}%0A` +
        `Total com FGTS: ${encodeURIComponent(formatarMoeda(res.totalReceberComFGTS))}%0A%0A` +
        `*Total final: ${encodeURIComponent(formatarMoeda(res.liquido))}*`;

      const url = `whatsapp://send?text=${mensagem}`;
      const canOpen = await Linking.canOpenURL(url);

      if (!canOpen) {
        Alert.alert("Atenção", "WhatsApp não encontrado neste dispositivo.");
        return;
      }

      await Linking.openURL(url);
    } catch {
      Alert.alert("Erro", "Não foi possível compartilhar no WhatsApp.");
    }
  };

  const Linha = ({
    label,
    valor,
    valorTexto,
    cor = "#e2e8f0",
    destaque = false,
  }) => (
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
        {valorTexto ?? formatarMoeda(valor)}
      </Text>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="rgb(17, 28, 52)" />

      <View style={styles.root}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
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
                  <Text style={styles.heroMiniBadgeText}>Rescisão</Text>
                </View>
              </View>

              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>Acerto trabalhista</Text>
              </View>

              <Text style={styles.pageTitle}>Rescisão / Acerto</Text>
              <Text style={styles.pageSubtitle}>
                Simule saldo de salário, 13º, férias, aviso prévio, multa do
                FGTS e veja o total com ou sem saque do FGTS.
              </Text>

              <View style={styles.heroInfoCard}>
                <View style={styles.heroInfoItem}>
                  <Text style={styles.heroInfoValue}>FGTS</Text>
                  <Text style={styles.heroInfoLabel}>Manual ou automático</Text>
                </View>

                <View style={styles.heroDivider} />

                <View style={styles.heroInfoItem}>
                  <Text style={styles.heroInfoValue}>Aviso</Text>
                  <Text style={styles.heroInfoLabel}>
                    Trabalhado / Indenizado
                  </Text>
                </View>

                <View style={styles.heroDivider} />
              </View>
            </View>

            <Card style={styles.mainCard}>
              <Card.Content style={styles.cardContent}>
                <Text style={styles.sectionHeading}>Dados da rescisão</Text>

                <TextInput
                  label="Último Salário Bruto"
                  value={dados.bruto}
                  onChangeText={(v) => atualizarCampo("bruto", v)}
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
                      onValueChange={(v) => atualizarCampo("periculosidade", v)}
                      color="#0a66c2"
                    />
                  </View>
                </View>
                <Text style={styles.label}>Motivo da saída</Text>
                <SegmentedButtons
                  value={dados.tipo}
                  onValueChange={(v) => atualizarCampo("tipo", v)}
                  buttons={[
                    {
                      value: "semJusta",
                      label: "Sem Justa Causa",
                      labelStyle: { color: "#2563eb" }, // Cor aplicada aqui
                    },
                    {
                      value: "pedido",
                      label: "Pedido Demissão",
                      labelStyle: { color: "#2563eb" }, // Cor aplicada aqui
                    },
                  ]}
                  style={styles.seg}
                />

                <Text style={styles.label}>Aviso prévio</Text>
                <SegmentedButtons
                  value={dados.aviso}
                  onValueChange={(v) => atualizarCampo("aviso", v)}
                  buttons={[
                    {
                      value: "trabalhado",
                      label: "Trabalhado",
                      labelStyle: { color: "#2563eb" },
                    },
                    {
                      value: "indenizado",
                      label: "Indenizado",
                      labelStyle: { color: "#2563eb" },
                    },
                  ]}
                  style={styles.seg}
                />

                <CampoData
                  label="Data de admissão"
                  value={dados.admissao}
                  onChange={(data) => atualizarCampo("admissao", data)}
                  onOpen={() => setShowAdmissao(true)}
                  styles={styles}
                />

                {Platform.OS !== "web" && showAdmissao && (
                  <DateTimePicker
                    value={dados.admissao || new Date(2025, 0, 1)}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(_, selectedDate) => {
                      setShowAdmissao(false);
                      if (selectedDate)
                        atualizarCampo("admissao", selectedDate);
                    }}
                  />
                )}

                <CampoData
                  label="Data de desligamento"
                  value={dados.desligamento}
                  onChange={(data) => atualizarCampo("desligamento", data)}
                  onOpen={() => setShowDesligamento(true)}
                  styles={styles}
                />

                {Platform.OS !== "web" && showDesligamento && (
                  <DateTimePicker
                    value={dados.desligamento || new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(_, selectedDate) => {
                      setShowDesligamento(false);
                      if (selectedDate)
                        atualizarCampo("desligamento", selectedDate);
                    }}
                  />
                )}

                {dados.tipo === "semJusta" && (
                  <>
                    <Text style={styles.label}>
                      Como deseja calcular o FGTS?
                    </Text>
                    <SegmentedButtons
                      value={dados.modoFGTS}
                      onValueChange={(v) => atualizarCampo("modoFGTS", v)}
                      buttons={[
                        {
                          value: "manual",
                          label: "Informar saldo",
                          checkedColor: "#FFFFFF", // Texto branco quando selecionado
                          uncheckedColor: "#94A3B8", // Texto cinza quando não selecionado
                          style: {
                            backgroundColor:
                              dados.modoFGTS === "manual"
                                ? "#3B82F6"
                                : "transparent",
                            borderColor: "#334155",
                          },
                        },
                        {
                          value: "calcular",
                          label: "Calcular pelo salário",
                          checkedColor: "#FFFFFF",
                          uncheckedColor: "#94A3B8",
                          style: {
                            backgroundColor:
                              dados.modoFGTS === "calcular"
                                ? "#3B82F6"
                                : "transparent",
                            borderColor: "#334155",
                          },
                        },
                      ]}
                      style={styles.seg}
                    />
                    {dados.modoFGTS === "manual" && (
                      <TextInput
                        label="Saldo Total do FGTS"
                        value={dados.fgts}
                        onChangeText={(v) => atualizarCampo("fgts", v)}
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.input}
                        left={<TextInput.Affix text="R$ " />}
                        outlineStyle={styles.inputOutline}
                        textColor="#ffffff"
                        theme={inputTheme}
                      />
                    )}

                    {dados.modoFGTS === "calcular" && (
                      <View style={styles.infoBox}>
                        <Text style={styles.infoBoxText}>
                          O sistema vai estimar o saldo do FGTS com base no
                          salário de cálculo e no tempo trabalhado.
                        </Text>
                      </View>
                    )}

                    <View style={styles.optionCard}>
                      <View style={styles.switchRow}>
                        <View style={styles.switchTextArea}>
                          <Text style={styles.switchTitle}>
                            Somar saque do FGTS no total
                          </Text>
                          <Text style={styles.switchSubtitle}>
                            Adiciona o saldo FGTS ao valor total final
                          </Text>
                        </View>
                        <Switch
                          value={dados.incluirFGTSNoTotal}
                          onValueChange={(v) =>
                            atualizarCampo("incluirFGTSNoTotal", v)
                          }
                          color="#0a66c2"
                        />
                      </View>
                    </View>
                  </>
                )}

                <Button
                  mode="contained"
                  onPress={handleCalcular}
                  style={styles.btn}
                  contentStyle={styles.btnContent}
                  labelStyle={styles.btnLabel}
                >
                  CALCULAR ACERTO
                </Button>
              </Card.Content>
            </Card>

            {res && (
              <Card style={styles.resultCard}>
                <Card.Content style={styles.resultContent}>
                  <View style={styles.resultHeader}>
                    <Text style={styles.resTitle}>Resumo da Rescisão</Text>
                    <Text style={styles.resSubtitle}>
                      Veja como cada verba compõe o valor final
                    </Text>
                  </View>

                  <View style={styles.resultSection}>
                    <Text style={styles.resultSectionTitle}>Informações</Text>

                    <Linha
                      label="Tempo Total"
                      valorTexto={res.tempoFormatado}
                    />
                    <Linha
                      label="Meses para 13º"
                      valorTexto={`${res.mesesDecimo} mês(es)`}
                    />
                    <Linha
                      label="Férias Proporcionais"
                      valorTexto={`${res.mesesFeriasProporcionais} mês(es)`}
                    />
                    <Linha
                      label="Períodos Vencidos"
                      valorTexto={`${res.periodosVencidos} período(s)`}
                    />
                  </View>

                  <View style={styles.resultSection}>
                    <Text style={styles.resultSectionTitle}>
                      Base de cálculo
                    </Text>

                    <Linha label="Salário Base" valor={res.salarioBase} />
                    {res.valorPericulosidade > 0 && (
                      <Linha
                        label="Periculosidade (30%)"
                        valor={res.valorPericulosidade}
                        cor="#22c55e"
                      />
                    )}
                    <Divider style={styles.div} />
                    <Linha
                      label="Salário para Cálculo"
                      valor={res.salarioCalculado}
                      destaque
                    />
                  </View>

                  <View style={styles.resultSection}>
                    <Text style={styles.resultSectionTitle}>Verbas</Text>

                    <Linha
                      label="Saldo de Salário"
                      valor={res.saldoSalario}
                      cor="#22c55e"
                    />
                    <Linha
                      label="13º Proporcional"
                      valor={res.decimoProporcional}
                      cor="#22c55e"
                    />
                    <Linha
                      label="Férias Proporcionais"
                      valor={res.feriasProporcionais}
                      cor="#22c55e"
                    />
                    <Linha
                      label="1/3 s/ Férias Proporcionais"
                      valor={res.umTercoFeriasProporcionais}
                      cor="#22c55e"
                    />

                    {res.feriasVencidas > 0 && (
                      <>
                        <Linha
                          label="Férias Vencidas"
                          valor={res.feriasVencidas}
                          cor="#22c55e"
                        />
                        <Linha
                          label="1/3 s/ Férias Vencidas"
                          valor={res.umTercoFeriasVencidas}
                          cor="#22c55e"
                        />
                      </>
                    )}

                    {res.valorAviso > 0 && (
                      <Linha
                        label={`Aviso Prévio (${res.diasAviso} dias)`}
                        valor={res.valorAviso}
                        cor="#22c55e"
                      />
                    )}

                    {res.multaFGTS > 0 && (
                      <Linha
                        label="Multa FGTS (40%)"
                        valor={res.multaFGTS}
                        cor="#22c55e"
                      />
                    )}

                    {res.saldoFGTSCalculado > 0 && (
                      <Linha
                        label="Saldo FGTS"
                        valor={res.saldoFGTSCalculado}
                        cor="#22c55e"
                      />
                    )}
                  </View>

                  <View style={styles.resultSection}>
                    <Text style={styles.resultSectionTitle}>Descontos</Text>

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
                  </View>

                  <View style={styles.resultSection}>
                    <Text style={styles.resultSectionTitle}>Totais</Text>

                    <Linha
                      label="Líquido da Rescisão"
                      valor={res.liquidoRescisao}
                      cor="#ffffff"
                      destaque
                    />

                    {dados.tipo === "semJusta" && (
                      <Linha
                        label="Total com FGTS"
                        valor={res.totalReceberComFGTS}
                        cor="#22c55e"
                        destaque
                      />
                    )}
                  </View>

                  <View style={styles.totalArea}>
                    <Text style={styles.totalLabel}>
                      {dados.incluirFGTSNoTotal && dados.tipo === "semJusta"
                        ? "TOTAL A RECEBER COM FGTS"
                        : "TOTAL LÍQUIDO A RECEBER"}
                    </Text>
                    <Text style={styles.totalValor}>
                      {formatarMoeda(res.liquido)}
                    </Text>
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
    backgroundColor: "rgb(17, 28, 52)",
  },

  label: {
    fontSize: 16,
    color: "#2563eb",
    fontWeight: "bold", // Título em negrito
    marginBottom: 8,
    marginTop: 16,
  },

  container: {
    flex: 1,
    backgroundColor: "rgb(17, 28, 52)",
  },

  content: {
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

  seg: {
    marginBottom: 16,
  },

  dateCard: {
    marginBottom: 14,
  },

  dateBtn: {
    borderRadius: 14,
    borderColor: "rgba(255,255,255,0.12)",
  },

  dateBtnContent: {
    paddingVertical: 6,
  },

  webDateWrap: {
    width: "100%",
  },

  infoBox: {
    backgroundColor: "rgba(10,102,194,0.10)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(10,102,194,0.18)",
  },

  infoBoxText: {
    fontSize: 12,
    color: "#bfdbfe",
    lineHeight: 18,
    fontWeight: "500",
  },

  btn: {
    backgroundColor: "#0a66c2",
    borderRadius: 18,
    marginTop: 8,
    shadowColor: "#0a66c2",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },

  btnContent: {
    paddingVertical: 8,
  },

  btnLabel: {
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 0.5,
  },

  actionRow: {
    marginTop: 12,
    gap: 10,
  },

  btnSecundario: {
    borderRadius: 16,
    borderColor: "rgba(255,255,255,0.12)",
  },

  btnSecundarioContent: {
    paddingVertical: 6,
  },

  btnSecundarioLabel: {
    fontWeight: "800",
  },

  resultCard: {
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.04)",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },

  resultContent: {
    paddingVertical: 12,
  },

  resultHeader: {
    alignItems: "center",
    marginBottom: 12,
  },

  resTitle: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    color: "#ffffff",
    marginBottom: 4,
  },

  resSubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    textAlign: "center",
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
    alignItems: "center",
    paddingVertical: 8,
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

  div: {
    marginVertical: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  totalArea: {
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "rgba(10,102,194,0.14)",
    borderRadius: 22,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(10,102,194,0.25)",
  },

  totalLabel: {
    fontSize: 12,
    color: "#bfdbfe",
    marginBottom: 6,
    fontWeight: "900",
    letterSpacing: 1,
  },

  totalValor: {
    fontSize: 32,
    fontWeight: "900",
    color: "#60a5fa",
  },
});
