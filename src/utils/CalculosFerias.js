export const calcularFerias = (dados) => {
  const {
    salario = 0,
    mesesTrabalhados = 12,
    vender10 = false,
    dependentes = 0,
    periculosidade = false,
  } = dados;

  const salarioNum = parseFloat(salario) || 0;
  const meses = Math.max(0, parseFloat(mesesTrabalhados) || 0);
  const qtdDependentes = parseInt(dependentes) || 0;

  // Base com periculosidade habitual
  const salarioBase = periculosidade ? salarioNum * 1.3 : salarioNum;

  // Períodos
  const anosCompletos = Math.floor(meses / 12);
  const mesesRestantes = meses % 12;
  const diasProporcionais = (mesesRestantes / 12) * 30;

  // Para férias normais, calcula 1 período
  const diasFerias = meses >= 12 ? 30 : diasProporcionais;

  // Férias gozadas
  const valorFerias = (salarioBase / 30) * diasFerias;
  const adicionalUmTerco = valorFerias / 3;

  // Venda de 10 dias - só quando houver 30 dias cheios
  const abono = vender10 && diasFerias >= 30
    ? (salarioBase / 30) * 10
    : 0;

  const adicionalAbono = abono / 3;

  // Total pago ao empregado
  const brutoTotal =
    valorFerias +
    adicionalUmTerco +
    abono +
    adicionalAbono;

  // Base previdenciária do empregado:
  // férias gozadas + 1/3 constitucional
  // sem incluir abono pecuniário e 1/3 do abono
  const baseINSS = valorFerias + adicionalUmTerco;

  const faixasINSS = [
    { limite: 1621.00, aliquota: 0.075 },
    { limite: 2902.84, aliquota: 0.09 },
    { limite: 4354.27, aliquota: 0.12 },
    { limite: 8475.55, aliquota: 0.14 },
  ];

  let inss = 0;
  let restante = baseINSS;
  let anterior = 0;

  for (const faixa of faixasINSS) {
    if (restante <= 0) break;
    const baseFaixa = Math.min(restante, faixa.limite - anterior);
    inss += baseFaixa * faixa.aliquota;
    restante -= baseFaixa;
    anterior = faixa.limite;
  }

  // IRRF
  const descontoDependente = qtdDependentes * 189.59;

  // Para simulador simples de férias gozadas:
  // usa o total tributável recebido no mês
  const baseIR = Math.max(
    0,
    brutoTotal - inss - descontoDependente
  );

  let irrfBase = 0;

  if (baseIR <= 2428.80) {
    irrfBase = 0;
  } else if (baseIR <= 2826.65) {
    irrfBase = baseIR * 0.075 - 182.16;
  } else if (baseIR <= 3751.05) {
    irrfBase = baseIR * 0.15 - 394.16;
  } else if (baseIR <= 4664.68) {
    irrfBase = baseIR * 0.225 - 675.49;
  } else {
    irrfBase = baseIR * 0.275 - 908.73;
  }

  let reducaoIR = 0;
  if (baseIR <= 5000) {
    reducaoIR = Math.min(irrfBase, 312.89);
  } else if (baseIR <= 7350) {
    reducaoIR = Math.max(0, 978.62 - 0.133145 * baseIR);
  }

  const irrf = Math.max(0, irrfBase - reducaoIR);

  const liquido = brutoTotal - inss - irrf;

  return {
    salarioBase,
    anosCompletos,
    mesesRestantes,
    diasFerias,
    totalDias: anosCompletos * 30 + diasProporcionais,
    valorFerias,
    adicionalUmTerco,
    abono,
    adicionalAbono,
    brutoTotal,
    baseINSS,
    baseIR,
    inss,
    irrf,
    liquido,
  };
};