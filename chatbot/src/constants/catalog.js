const PRICING = {
  piano: { label: 'Piano/Teclado', modalidades: ['Individual: R$ 230,00'] },
  teclado: { label: 'Piano/Teclado', modalidades: ['Individual: R$ 230,00'] },
  canto: {
    label: 'Canto',
    modalidades: ['Individual: R$ 230,00', 'Trio: R$ 180,00 por pessoa', 'Quarteto: R$ 155,00 por pessoa'],
  },
  violao: { label: 'Violão', modalidades: ['Individual: R$ 215,00', 'Dupla: R$ 160,00 por pessoa'] },
  contrabaixo: { label: 'Contrabaixo', modalidades: ['Individual: R$ 210,00'] },
  guitarra: { label: 'Guitarra', modalidades: ['Individual: R$ 230,00'] },
  bateria: { label: 'Bateria', modalidades: ['Individual: R$ 220,00'] },
  ukulele: { label: 'Ukulele', modalidades: ['Individual: R$ 200,00', 'Dupla: R$ 160,00 por pessoa'] },
  violino: { label: 'Violino', modalidades: ['Individual: R$ 220,00', 'Dupla: R$ 180,00 por pessoa'] },
};

const AULA_PADRAO = 'Duração: 1h | Frequência: 1 vez por semana | Total: 4 aulas por mês.';

const MATRICULA_INFO = [
  'Taxa de matrícula anual: R$ 250,00.',
  'Formas de pagamento: Pix à vista ou 3x sem juros no cartão.',
  'Após pagamento e envio do comprovante, fazemos inclusão no grupo e finalizamos o cadastro no sistema.',
].join(' ');

const FORM_FIELDS = [
  { key: 'nomeAluno', label: 'Nome completo do aluno' },
  { key: 'dataNascimentoAluno', label: 'Data de nascimento do aluno' },
  { key: 'endereco', label: 'Endereço' },
  { key: 'cep', label: 'CEP' },
  { key: 'bairro', label: 'Bairro' },
  { key: 'idade', label: 'Idade' },
  { key: 'emailAluno', label: 'E-mail do aluno' },
  { key: 'nomePai', label: 'Nome do pai' },
  { key: 'ocupacaoPai', label: 'Ocupação do pai' },
  { key: 'nomeMae', label: 'Nome da mãe' },
  { key: 'ocupacaoMae', label: 'Ocupação da mãe' },
  { key: 'telefonePai', label: 'Telefone de contato do pai' },
  { key: 'telefoneMae', label: 'Telefone de contato da mãe' },
  { key: 'responsavelFinanceiro', label: 'Nome completo do responsável financeiro (se diferente dos pais)' },
  { key: 'cpfResponsavelFinanceiro', label: 'CPF do responsável financeiro' },
  { key: 'nascimentoResponsavelFinanceiro', label: 'Data de nascimento do responsável financeiro' },
  { key: 'emailResponsavelFinanceiro', label: 'E-mail do responsável financeiro' },
  { key: 'periodoContratual', label: 'Período contratual (6 meses ou 11 meses)' },
];

module.exports = {
  PRICING,
  AULA_PADRAO,
  MATRICULA_INFO,
  FORM_FIELDS,
};
