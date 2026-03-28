import React, { useState, useEffect } from "react";
import { Platform, View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";

// Formata a data para o padrão do input HTML: YYYY-MM-DD
function formatarParaInput(date) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatarDataBr(date) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return "Selecionar Data";
  return date.toLocaleDateString("pt-BR");
}

export default function CampoData({ label, value, onChange, onOpen, styles = {} }) {
  const BLUE_COLOR = "#2563eb";
  
  // Estado local para o input Web não travar durante a digitação do ano
  const [tempValue, setTempValue] = useState(formatarParaInput(value));

  // Sincroniza o estado local se o valor vier de fora (ex: reset do form)
  useEffect(() => {
    setTempValue(formatarParaInput(value));
  }, [value]);

  if (Platform.OS === "web") {
    return (
      <View style={[styles.dateCard, { marginBottom: 15 }]}>
        <Text style={{ color: BLUE_COLOR, fontWeight: "bold", marginBottom: 6, fontSize: 16 }}>
          {label}
        </Text>

        <View style={styles.webDateWrap}>
          <input
            type="date"
            value={tempValue}
            onChange={(e) => {
              const v = e.target.value;
              setTempValue(v); // Atualiza o texto visualmente na hora

              if (!v) {
                onChange(null);
                return;
              }

              const [ano, mes, dia] = v.split("-").map(Number);
              
              // Só dispara o onChange global se o ano for plausível (evita travas)
              if (ano > 1900 && ano < 2100) {
                onChange(new Date(ano, mes - 1, dia, 12, 0, 0));
              }
            }}
            style={{
              width: "100%",
              height: 52,
              borderRadius: 16,
              border: `2px solid ${BLUE_COLOR}`,
              background: "rgba(37, 99, 235, 0.05)",
              color: BLUE_COLOR,
              padding: "0 14px",
              outline: "none",
              fontSize: 16,
              fontWeight: "bold",
              boxSizing: "border-box",
              fontFamily: "inherit",
              appearance: "list-item", // Garante que o ícone do calendário apareça
            }}
          />
        </View>
      </View>
    );
  }

  // Layout Mobile (Android/iOS)
  return (
    <View style={[styles.dateCard, { marginBottom: 15 }]}>
      <Text style={{ color: BLUE_COLOR, fontWeight: "bold", marginBottom: 6, fontSize: 16 }}>
        {label}
      </Text>
      <Button
        mode="outlined"
        onPress={onOpen}
        style={{ borderColor: BLUE_COLOR, borderRadius: 16, borderWeight: 2 }}
        contentStyle={{ height: 50 }}
        textColor={BLUE_COLOR}
        labelStyle={{ fontWeight: "bold" }}
      >
        {formatarDataBr(value)}
      </Button>
    </View>
  );
}