const arred = (v) => Number((v || 0).toFixed(2));

const toNum = (v) => {
  if (v === null || v === undefined || v === "") return 0;
  return Number(String(v).replace(",", ".")) || 0;
};

function calcularINSS2026(salario) {
  const faixas = [
    { limite: 1621.0, aliquota: 0.075 },
    { limite: 2902.84, aliquota: 0.09 },
    { limite: 4354.27, aliquota: 0.12 },
    { limite: 8475.55, aliquota: 0.14 },
  ];

  let inss = 0;
  let anterior = 0;
  const base = Math.min(toNum(salario), 8475.55);

  for (const faixa of faixas) {
    if (base > anterior) {
      const valorFaixa = Math.min(base, faixa.limite) - anterior;
      inss += valorFaixa * faixa.aliquota;
      anterior = faixa.limite;
    }
  }

  return arred(inss);
}

function calcularIRRFProgressivo2026(baseCalculo) {
  if (baseCalculo <= 2428.8) {
    return { imposto: 0, aliquota: 0, deducao: 0 };
  }
  if (baseCalculo <= 2826.65) {
    return {
      imposto: arred(baseCalculo * 0.075 - 182.16),
      aliquota: 7.5,
      deducao: 182.16,
    };
  }
  if (baseCalculo <= 3751.05) {
    return {
      imposto: arred(baseCalculo * 0.15 - 394.16),
      aliquota: 15,
      deducao: 394.16,
    };
  }
  if (baseCalculo <= 4664.68) {
    return {
      imposto: arred(baseCalculo * 0.225 - 675.49),
      aliquota: 22.5,
      deducao: 675.49,
    };
  }

  return {
    imposto: arred(baseCalculo * 0.275 - 908.73),
    aliquota: 27.5,
    deducao: 908.73,
  };
}

function calcularReducaoIRRF2026(rendimentoTributavelMensal, impostoApurado) {
  const rendimento = toNum(rendimentoTributavelMensal);
  const imposto = toNum(impostoApurado);

  let reducao = 0;

  if (rendimento <= 5000) {
    reducao = Math.min(imposto, 312.89);
  } else if (rendimento <= 7350) {
    reducao = 978.62 - 0.133145 * rendimento;
    reducao = Math.max(0, Math.min(reducao, imposto));
  }

  return arred(reducao);
}

function calcularIRRF2026({
  brutoTributavel,
  inss,
  dependentes = 0,
  pensao = 0,
  usarSimplificado = true,
}) {
  const deducaoDependentes = arred(toNum(dependentes) * 189.59);
  const descontoSimplificado = usarSimplificado ? 607.2 : 0;

  const baseLegal = arred(
    toNum(brutoTributavel) - toNum(inss) - deducaoDependentes - toNum(pensao)
  );

  const baseSimplificada = arred(toNum(brutoTributavel) - descontoSimplificado);

  const melhorBase = usarSimplificado
    ? Math.min(baseLegal > 0 ? baseLegal : 0, baseSimplificada > 0 ? baseSimplificada : 0)
    : Math.max(baseLegal, 0);

  const baseCalculo = arred(Math.max(melhorBase, 0));
  const progressivo = calcularIRRFProgressivo2026(baseCalculo);
  const reducao = calcularReducaoIRRF2026(brutoTributavel, progressivo.imposto);
  const irrfFinal = arred(Math.max(progressivo.imposto - reducao, 0));

  return {
    baseCalculoIRRF: baseCalculo,
    deducaoDependentes,
    descontoSimplificadoAplicado:
      usarSimplificado && baseSimplificada <= baseLegal ? 607.2 : 0,
    irrfSemReducao: progressivo.imposto,
    reducaoIRRF: reducao,
    irrf: irrfFinal,
    faixaIRRF: progressivo.aliquota,
    parcelaDeduzirIRRF: progressivo.deducao,
  };
}

function calcularHorasExtras({
  bruto,
  jornada,
  h50,
  h70,
  h100,
  p50,
  p70,
  p100,
}) {
  const salarioHora = toNum(bruto) / (toNum(jornada) || 220);

  const extra50 = salarioHora * (1 + toNum(p50) / 100) * toNum(h50);
  const extra70 = salarioHora * (1 + toNum(p70) / 100) * toNum(h70);
  const extra100 = salarioHora * (1 + toNum(p100) / 100) * toNum(h100);

  return {
    extra50: arred(extra50),
    extra70: arred(extra70),
    extra100: arred(extra100),
    totalExtras: arred(extra50 + extra70 + extra100),
  };
}

function calcularAdicionalNoturno({
  bruto,
  jornada,
  hNoturna,
  pNoturna,
}) {
  const salarioHora = toNum(bruto) / (toNum(jornada) || 220);
  const horas = toNum(hNoturna);
  const percentual = toNum(pNoturna) / 100;

  const adicionalNoturnoValor = salarioHora * percentual * horas;

  return {
    adicionalNoturnoValor: arred(adicionalNoturnoValor),
  };
}

function calcularAdicional({
  bruto,
  periculosidade,
  insalubridade,
  grauInsalubridade,
}) {
  let adicional = 0;
  let adicionalAplicado = "Nenhum";

  if (periculosidade) {
    adicional = toNum(bruto) * 0.3;
    adicionalAplicado = "Periculosidade 30%";
  } else if (insalubridade) {
    const grau = toNum(grauInsalubridade);
    adicional = toNum(bruto) * (grau / 100);
    adicionalAplicado = `Insalubridade ${grau}%`;
  }

  return {
    adicional: arred(adicional),
    adicionalAplicado,
  };
}

export function calcularTrabalhistaCompleto(dados) {
  const bruto = toNum(dados.bruto);

  const adicionais = calcularAdicional({
    bruto,
    periculosidade: !!dados.periculosidade,
    insalubridade: !!dados.insalubridade,
    grauInsalubridade: dados.grauInsalubridade,
  });

  const horas = calcularHorasExtras({
    bruto,
    jornada: dados.jornada,
    h50: dados.h50,
    h70: dados.h70,
    h100: dados.h100,
    p50: dados.p50,
    p70: dados.p70,
    p100: dados.p100,
  });

  const noturno = calcularAdicionalNoturno({
    bruto,
    jornada: dados.jornada,
    hNoturna: dados.adicionalNoturno ? dados.hNoturna : 0,
    pNoturna: dados.pNoturna,
  });

  const novoBrutoTotal = arred(
    bruto +
      adicionais.adicional +
      horas.totalExtras +
      noturno.adicionalNoturnoValor
  );

  const inss = calcularINSS2026(novoBrutoTotal);

  const irrfData = calcularIRRF2026({
    brutoTributavel: novoBrutoTotal,
    inss,
    dependentes: dados.dependentes,
    pensao: dados.pensao,
    usarSimplificado: true,
  });

  const descontoVT = dados.vt ? arred(novoBrutoTotal * 0.06) : 0;
  const descontoVR = arred(toNum(dados.vr));
  const descontoPensao = arred(toNum(dados.pensao));
  

  const liquido = arred(
    novoBrutoTotal -
      inss -
      irrfData.irrf -
      descontoVT -
      descontoVR -
      descontoPensao
  );

  function calcularFGTS(brutoBase) {
  return arred(toNum(brutoBase) * 0.08);
}

  return {
    bruto: arred(bruto),

    adicional: adicionais.adicional,
    adicionalAplicado: adicionais.adicionalAplicado,

    extra50: horas.extra50,
    extra70: horas.extra70,
    extra100: horas.extra100,
    totalExtras: horas.totalExtras,

    adicionalNoturnoValor: noturno.adicionalNoturnoValor,

    novoBrutoTotal,

    inss,
    irrf: irrfData.irrf,
    irrfSemReducao: irrfData.irrfSemReducao,
    reducaoIRRF: irrfData.reducaoIRRF,
    baseCalculoIRRF: irrfData.baseCalculoIRRF,
    faixaIRRF: irrfData.faixaIRRF,
    deducaoDependentes: irrfData.deducaoDependentes,
    descontoSimplificadoAplicado: irrfData.descontoSimplificadoAplicado,

    descontoVT,
    descontoVR,
    descontoPensao,

    liquido,
  };
}