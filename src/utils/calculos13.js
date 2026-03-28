export const calcularDecimoTerceiro = (dados) => {
  const {
    bruto = 0,
    meses = 12,
    dependentes = 0,
    adiantamento = true,
    periculosidade = false,
  } = dados;

  const salarioBase = parseFloat(bruto) || 0;
  const qtdDependentes = parseInt(dependentes) || 0;
  const mesesTrab = Math.max(0, Math.min(12, parseInt(meses) || 0));

  const valorPericulosidade = periculosidade ? salarioBase * 0.3 : 0;
  const baseDecimo = salarioBase + valorPericulosidade;

  const valorIntegral = (baseDecimo / 12) * mesesTrab;
  const primeiraParcela = adiantamento ? valorIntegral * 0.5 : 0;

  const faixasINSS = [
    { limite: 1621.0, aliquota: 0.075 },
    { limite: 2902.84, aliquota: 0.09 },
    { limite: 4354.27, aliquota: 0.12 },
    { limite: 8475.55, aliquota: 0.14 },
  ];

  let inss = 0;
  let restante = valorIntegral;
  let anterior = 0;

  for (const faixa of faixasINSS) {
    if (restante <= 0) break;
    const baseFaixa = Math.min(restante, faixa.limite - anterior);
    inss += baseFaixa * faixa.aliquota;
    restante -= baseFaixa;
    anterior = faixa.limite;
  }

  const baseIRRF = Math.max(0, valorIntegral - inss - qtdDependentes * 189.59);

  let irrfBase = 0;
  if (baseIRRF <= 2428.8) {
    irrfBase = 0;
  } else if (baseIRRF <= 2826.65) {
    irrfBase = baseIRRF * 0.075 - 182.16;
  } else if (baseIRRF <= 3751.05) {
    irrfBase = baseIRRF * 0.15 - 394.16;
  } else if (baseIRRF <= 4664.68) {
    irrfBase = baseIRRF * 0.225 - 675.49;
  } else {
    irrfBase = baseIRRF * 0.275 - 908.73;
  }

  let reducaoIR = 0;
  if (baseIRRF <= 5000) {
    reducaoIR = Math.min(irrfBase, 312.89);
  } else if (baseIRRF <= 7350) {
    reducaoIR = Math.max(0, 978.62 - 0.133145 * baseIRRF);
  }

  const irrf = Math.max(0, irrfBase - reducaoIR);

  const totalLiquido = valorIntegral - inss - irrf;
  const segundaParcela = totalLiquido - primeiraParcela;

  return {
    salarioBase,
    valorPericulosidade,
    baseDecimo,
    valorIntegral,
    primeiraParcela,
    segundaParcela,
    inss,
    irrf,
    totalLiquido,
  };
};