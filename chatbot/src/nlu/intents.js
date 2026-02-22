const INTENTS = {
  saudacao: ['oi', 'ola', 'olá', 'bom dia', 'boa tarde', 'boa noite'],
  apresentacao: ['quem e voce', 'quem responde', 'com quem falo', 'voces sao robô', 'é bot'],
  preco_geral: ['valor das aulas', 'preco das aulas', 'preço das aulas', 'quanto custa as aulas'],
  preco_instrumento: ['quanto custa', 'preco', 'preço', 'valor do', 'valor da aula de'],
  horarios_disponiveis: ['horario', 'horários', 'tem vaga', 'periodo', 'manhã', 'tarde', 'noite'],
  detalhes_aula: ['duracao', 'duração', 'quantas aulas', 'aula por semana', 'como funciona as aulas'],
  matricula_info: ['matricula', 'matrícula', 'taxa de matricula', 'valor da matricula'],
  como_pagar: ['pix', 'cartao', 'cartão', 'parcelar', 'pagamento'],
  enviar_comprovante: ['comprovante', 'ja paguei', 'já paguei', 'enviei o pix'],
  quero_matricular: ['quero matricular', 'quero me matricular', 'vamos fechar', 'quero fazer a matricula'],
  falar_com_professor: ['falar com henrique', 'falar com professor', 'atendente humano', 'quero atendimento humano'],
  retomar_bot: ['voltar pro bot', 'continuar com bot', 'retomar atendimento'],
};

const INSTRUMENT_ALIASES = {
  piano: ['piano', 'teclado'],
  teclado: ['teclado', 'piano'],
  violao: ['violao', 'violão'],
  guitarra: ['guitarra'],
  bateria: ['bateria'],
  canto: ['canto', 'cantar'],
  ukulele: ['ukulele', 'uke'],
  contrabaixo: ['contrabaixo', 'baixo'],
  violino: ['violino'],
};

module.exports = {
  INTENTS,
  INSTRUMENT_ALIASES,
};
