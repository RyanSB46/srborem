const { INTENTS, INSTRUMENT_ALIASES } = require('./intents');
const { compactText } = require('../utils/text');

function classifyMessage(text) {
  const normalized = compactText(text);
  const entities = {
    instrument: detectInstrument(normalized),
    period: detectPeriod(normalized),
  };

  let bestIntent = 'duvida_outra';
  let bestScore = 0;

  Object.entries(INTENTS).forEach(([intent, patterns]) => {
    const score = patterns.reduce((acc, pattern) => {
      const exact = normalized === compactText(pattern) ? 1.0 : 0;
      const includes = normalized.includes(compactText(pattern)) ? 0.8 : 0;
      return Math.max(acc, exact, includes);
    }, 0);
    if (score > bestScore) {
      bestIntent = intent;
      bestScore = score;
    }
  });

  if (entities.instrument && bestIntent === 'preco_geral') {
    bestIntent = 'preco_instrumento';
    bestScore = 0.95;
  }

  if (entities.instrument && bestIntent === 'duvida_outra' && /(preco|preço|valor|custa)/.test(normalized)) {
    bestIntent = 'preco_instrumento';
    bestScore = 0.7;
  }

  return {
    intent: bestIntent,
    confidence: Number(bestScore.toFixed(2)),
    entities,
  };
}

function detectInstrument(normalized) {
  const match = Object.entries(INSTRUMENT_ALIASES).find(([, aliases]) =>
    aliases.some((alias) => normalized.includes(alias))
  );
  return match ? match[0] : null;
}

function detectPeriod(normalized) {
  if (/(manha|manhã)/.test(normalized)) {
    return 'manhã';
  }
  if (/tarde/.test(normalized)) {
    return 'tarde';
  }
  if (/noite/.test(normalized)) {
    return 'noite';
  }
  if (/(fim de semana|sabado|sábado|domingo)/.test(normalized)) {
    return 'fim de semana';
  }
  return null;
}

module.exports = {
  classifyMessage,
};
