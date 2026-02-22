const { AULA_PADRAO, PRICING } = require('../constants/catalog');

function buildAllPricingMessage() {
  const lines = ['🎶 Opções de aulas:'];

  const visited = new Set();
  Object.entries(PRICING).forEach(([key, value]) => {
    if (visited.has(value.label)) {
      return;
    }
    visited.add(value.label);
    lines.push(`- ${value.label}: ${value.modalidades.join(' | ')}`);
  });

  lines.push(AULA_PADRAO);
  lines.push('Se quiser, já te passo os valores de um instrumento específico.');
  return lines.join('\n');
}

function buildInstrumentPricingMessage(instrument) {
  const target = PRICING[instrument];
  if (!target) {
    return null;
  }
  return [`🎵 ${target.label}`, ...target.modalidades.map((m) => `- ${m}`), AULA_PADRAO, 'Quer ver opções de horário?'].join('\n');
}

module.exports = {
  buildAllPricingMessage,
  buildInstrumentPricingMessage,
};
