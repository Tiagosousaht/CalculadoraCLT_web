// utils/calculosAcerto.js

const arred = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

function diferencaDias(dataInicial, dataFinal) {
  const msPorDia = 1000 * 60 * 60 * 24;
  const ini = new Date(
    dataInicial.getFullYear(),
    dataInicial.getMonth(),
    dataInicial.getDate()
  );
  const fim = new Date(
    dataFinal.getFullYear(),
    dataFinal.getMonth(),
    dataFinal.getDate()
  );

  return Math.floor((fim - ini) / msPorDia) + 1;
}

function ultimoDiaDoMes(ano, mes) {
  return new Date(ano, mes + 1, 0).getDate();
}

function mesesTrabalhadosParaDecimo(admissao, desligamento) {
  let meses = 0;

  for (let ano = admissao.getFullYear(); ano <= desligamento.getFullYear(); ano++) {
    const mesInicio = ano === admissao.getFullYear() ? admissao.getMonth() : 0;
    const mesFim = ano === desligamento.getFullYear() ? desligamento.getMonth() : 11;

    for (let mes = mesInicio; mes <= mesFim; mes++) {
      const inicioMes = new Date(ano, mes, 1);
      const fimMes = new Date(ano, mes, ultimoDiaDoMes(ano, mes));

      const inicioValido = admissao > inicioMes ? admissao : inicioMes;
      const fimValido = desligamento < fimMes ? desligamento : fimMes;

      if (inicioValido <= fimValido) {
        const diasNoMes = diferencaDias(inicioValido, fimValido);
        if (diasNoMes >= 15) meses++;
      }
    }
  }

  return clamp(meses, 0, 12);
}

function mesesFeriasNoPeriodo(inicioPeriodo, fimPeriodo) {
  let meses = 0;

  for (
    let ano = inicioPeriodo.getFullYear();
    ano <= fimPeriodo.getFullYear();
    ano++
  ) {
    const mesInicio = ano === inicioPeriodo.getFullYear() ? inicioPeriodo.getMonth() : 0;
    const mesFim = ano === fimPeriodo.getFullYear() ? fimPeriodo.getMonth() : 11;

    for (let mes = mesInicio; mes <= mesFim; mes++) {
      const inicioMes = new Date(ano, mes, 1);
      const fimMes = new Date(ano, mes, ultimoDiaDoMes(ano, mes));

      const inicioValido = inicioPeriodo > inicioMes ? inicioPeriodo : inicioMes;
      const fimValido = fimPeriodo < fimMes ? fimPeriodo : fimMes;

      if (inicioValido <= fimValido) {
        const diasNoMes = diferencaDias(inicioValido, fimValido);
        if (diasNoMes >= 15) meses++;
      }
    }
  }

  return clamp(meses, 0, 12);
}

function calcularTempoFormatado(admissao, desligamento) {
  let anos = desligamento.getFullYear() - admissao.getFullYear();
  let meses = desligamento.getMonth() - admissao.getMonth();
  let dias = desligamento.getDate() - admissao.getDate();

  if (dias < 0) {
    meses--;
    const mesAnterior = new Date(
      desligamento.getFullYear(),
      desligamento.getMonth(),
      0
    ).getDate();
    dias += mesAnterior;
  }

  if (meses < 0) {
    anos--;
    meses += 12;
  }

  const partes = [];
  if (anos > 0) partes.push(`${anos} ano(s)`);
  if (meses > 0) partes.push(`${meses} mês(es)`);
  if (dias > 0) partes.push(`${dias} dia(s)`);

  return partes.length ? partes.join(", ") : "0 dia(s)";
}

function calcularDiasAviso(admissao, desligamento, tipoDemissao, avisoPrevio) {
  if (tipoDemissao !== "semJusta") return 0;

  // Para sem justa causa existe aviso.
  // Acréscimo de 3 dias por ano completo após 1 ano, limitado a 90 dias.
  let dias = 30;

  const anosCompletos =
    desligamento.getFullYear() -
    admissao.getFullYear() -
    (
      desligamento.getMonth() < admissao.getMonth() ||
      (desligamento.getMonth() === admissao.getMonth() &&
        desligamento.getDate() < admissao.getDate())
        ? 1
        : 0
    );

  if (anosCompletos > 1) {
    dias += (anosCompletos - 1) * 3;
  }

  dias = clamp(dias, 30, 90);

  // Se trabalhado, normalmente não entra como verba extra.
  if (avisoPrevio === "trabalhado") return 0;

  return dias;
}

function calcularINSS2026(base) {
  // Estrutura progressiva.
  // Mantive teto/fatias no padrão mais recente conhecido da previdência
  // para cálculo estimativo em app de simulação.
  // Ajuste fácil se quiser trocar por tabela oficial anual exata.
  const faixas = [
    { limite: 1518.0, aliquota: 0.075 },
    { limite: 2793.88, aliquota: 0.09 },
    { limite: 4190.83, aliquota: 0.12 },
    { limite: 8157.41, aliquota: 0.14 },
  ];

  let restante = Number(base || 0);
  let total = 0;
  let anterior = 0;

  for (const faixa of faixas) {
    if (restante <= 0) break;
    const tetoFaixa = faixa.limite - anterior;
    const valorFaixa = Math.min(restante, tetoFaixa);
    total += valorFaixa * faixa.aliquota;
    restante -= valorFaixa;
    anterior = faixa.limite;
  }

  return arred(total);
}

function calcularIRRFMensal2026(baseTributavel) {
  const base = Number(baseTributavel || 0);
  if (base <= 0) return 0;

  // Tabela mensal de 2026
  let impostoBase = 0;

  if (base <= 2428.8) {
    impostoBase = 0;
  } else if (base <= 2826.65) {
    impostoBase = base * 0.075 - 182.16;
  } else if (base <= 3751.05) {
    impostoBase = base * 0.15 - 394.16;
  } else if (base <= 4664.68) {
    impostoBase = base * 0.225 - 675.49;
  } else {
    impostoBase = base * 0.275 - 908.73;
  }

  impostoBase = Math.max(0, arred(impostoBase));

  // Redução do imposto em 2026:
  // até 5.000 zera;
  // de 5.000,01 até 7.350 aplica redução parcial:
  // redução = 978,62 - 0,13167 * renda
  // conforme comunicação oficial da Receita/Governo.
  let reducao = 0;

  if (base <= 5000) {
    reducao = impostoBase;
  } else if (base <= 7350) {
    reducao = 978.62 - 0.13167 * base;
    reducao = Math.max(0, arred(reducao));
  }

  const impostoFinal = Math.max(0, arred(impostoBase - reducao));
  return impostoFinal;
}

function calcularFGTSEstimado(salarioBaseFGTS, admissao, desligamento, avisoPrevio, tipoDemissao) {
  // Estimativa simples:
  // 8% por mês com 15+ dias no mês.
  // Considera também mês do desligamento e 13º proporcional aproximado.
  let mesesFGTS = 0;

  for (let ano = admissao.getFullYear(); ano <= desligamento.getFullYear(); ano++) {
    const mesInicio = ano === admissao.getFullYear() ? admissao.getMonth() : 0;
    const mesFim = ano === desligamento.getFullYear() ? desligamento.getMonth() : 11;

    for (let mes = mesInicio; mes <= mesFim; mes++) {
      const inicioMes = new Date(ano, mes, 1);
      const fimMes = new Date(ano, mes, ultimoDiaDoMes(ano, mes));

      const inicioValido = admissao > inicioMes ? admissao : inicioMes;
      const fimValido = desligamento < fimMes ? desligamento : fimMes;

      if (inicioValido <= fimValido) {
        const diasNoMes = diferencaDias(inicioValido, fimValido);
        if (diasNoMes >= 15) mesesFGTS++;
      }
    }
  }

  const meses13 = mesesTrabalhadosParaDecimo(
    new Date(desligamento.getFullYear(), 0, 1),
    desligamento
  );

  let fgts =
    salarioBaseFGTS * 0.08 * mesesFGTS +
    salarioBaseFGTS * (meses13 / 12) * 0.08;

  // Aviso indenizado sofre FGTS
  if (tipoDemissao === "semJusta" && avisoPrevio === "indenizado") {
    const diasAviso = calcularDiasAviso(admissao, desligamento, tipoDemissao, avisoPrevio);
    const valorAviso = (salarioBaseFGTS / 30) * diasAviso;
    fgts += valorAviso * 0.08;
  }

  return arred(fgts);
}

export function calcularRescisao({
  bruto,
  tipoDemissao = "semJusta",
  avisoPrevio = "trabalhado",
  saldoFGTS = 0,
  modoFGTS = "manual",
  incluirFGTSNoTotal = false,
  admissao,
  desligamento,
  periculosidade = false,
}) {
  const salarioBase = Number(bruto || 0);
  const valorPericulosidade = periculosidade ? salarioBase * 0.3 : 0;
  const salarioCalculado = arred(salarioBase + valorPericulosidade);

  const tempoFormatado = calcularTempoFormatado(admissao, desligamento);

  // saldo de salário
  const diasTrabalhadosNoMes = desligamento.getDate();
  const saldoSalario = arred((salarioCalculado / 30) * diasTrabalhadosNoMes);

  // 13º proporcional do ano da rescisão
  const inicioAno = new Date(desligamento.getFullYear(), 0, 1);
  const mesesDecimo = mesesTrabalhadosParaDecimo(
    admissao > inicioAno ? admissao : inicioAno,
    desligamento
  );
  const decimoProporcional = arred((salarioCalculado / 12) * mesesDecimo);

  // férias vencidas e proporcionais
  const totalMesesContrato =
    (desligamento.getFullYear() - admissao.getFullYear()) * 12 +
    (desligamento.getMonth() - admissao.getMonth()) +
    (desligamento.getDate() >= admissao.getDate() ? 0 : -1);

  const periodosVencidos = Math.max(0, Math.floor(totalMesesContrato / 12));

  const feriasVencidas = arred(periodosVencidos * salarioCalculado);
  const umTercoFeriasVencidas = arred(feriasVencidas / 3);

  const inicioUltimoPeriodo = new Date(admissao);
  inicioUltimoPeriodo.setMonth(admissao.getMonth() + periodosVencidos * 12);

  const mesesFeriasProporcionais = mesesFeriasNoPeriodo(inicioUltimoPeriodo, desligamento);
  const feriasProporcionais = arred((salarioCalculado / 12) * mesesFeriasProporcionais);
  const umTercoFeriasProporcionais = arred(feriasProporcionais / 3);

  // aviso
  const diasAviso = calcularDiasAviso(admissao, desligamento, tipoDemissao, avisoPrevio);
  const valorAviso = arred((salarioCalculado / 30) * diasAviso);

  // FGTS
  const saldoFGTSCalculado =
    tipoDemissao !== "semJusta"
      ? 0
      : modoFGTS === "calcular"
      ? calcularFGTSEstimado(salarioCalculado, admissao, desligamento, avisoPrevio, tipoDemissao)
      : arred(Number(saldoFGTS || 0));

  const multaFGTS =
    tipoDemissao === "semJusta" ? arred(saldoFGTSCalculado * 0.4) : 0;

  // -----------------------------
  // BASES TRIBUTÁVEIS CORRETAS
  // -----------------------------
  // Tributáveis:
  // - saldo de salário
  // - 13º proporcional (observação: na prática costuma ter cálculo separado;
  //   aqui mantemos no resumo geral do app)
  //
  // Isentos na rescisão:
  // - aviso prévio indenizado
  // - férias indenizadas/proporcionais indenizadas + 1/3
  // - FGTS
  // - multa FGTS
  //
  // Para pedido de demissão com aviso trabalhado:
  // - não existe verba de aviso a receber
  //
  const baseINSS = arred(saldoSalario + decimoProporcional);
  const inss = calcularINSS2026(baseINSS);

  const baseIRRF = arred(baseINSS - inss);
  const irrf = calcularIRRFMensal2026(baseIRRF);

  const brutoRescisao = arred(
    saldoSalario +
      decimoProporcional +
      feriasProporcionais +
      umTercoFeriasProporcionais +
      feriasVencidas +
      umTercoFeriasVencidas +
      valorAviso +
      multaFGTS
  );

  const liquidoRescisao = arred(brutoRescisao - inss - irrf);

  const totalReceberComFGTS = arred(liquidoRescisao + saldoFGTSCalculado);

  const liquido =
    tipoDemissao === "semJusta" && incluirFGTSNoTotal
      ? totalReceberComFGTS
      : liquidoRescisao;

  return {
    salarioBase: arred(salarioBase),
    valorPericulosidade: arred(valorPericulosidade),
    salarioCalculado,
    tempoFormatado,

    mesesDecimo,
    mesesFeriasProporcionais,
    periodosVencidos,

    saldoSalario,
    decimoProporcional,
    feriasProporcionais,
    umTercoFeriasProporcionais,
    feriasVencidas,
    umTercoFeriasVencidas,

    diasAviso,
    valorAviso,

    saldoFGTSCalculado,
    multaFGTS,

    inss,
    irrf,

    liquidoRescisao,
    totalReceberComFGTS,
    liquido,
  };
}