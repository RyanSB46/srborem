const { FORM_FIELDS, MATRICULA_INFO } = require('../constants/catalog');

function startEnrollment() {
  return {
    text: [
      'Perfeito! Vamos iniciar sua matrícula. Vou te fazer algumas perguntas rápidas.',
      MATRICULA_INFO,
      `1/${FORM_FIELDS.length} - ${FORM_FIELDS[0].label}:`,
    ].join('\n'),
    nextStep: 0,
  };
}

function processEnrollmentAnswer(session, userText) {
  const currentStep = session.matriculaStep;
  if (currentStep < 0 || currentStep >= FORM_FIELDS.length) {
    return {
      done: true,
      text: 'Matrícula já finalizada nesta conversa. Se quiser, posso te enviar o resumo.',
    };
  }

  const currentField = FORM_FIELDS[currentStep];
  const updatedData = {
    ...session.matriculaData,
    [currentField.key]: userText,
  };

  const nextStep = currentStep + 1;

  if (nextStep >= FORM_FIELDS.length) {
    return {
      done: true,
      data: updatedData,
      text: [
        'Perfeito, recebi todos os dados da matrícula ✅',
        'Próximo passo: enviar o comprovante da taxa de matrícula (R$ 250,00).',
        'Assim que confirmado, seguimos com inclusão no grupo e envio do link do app.',
      ].join('\n'),
    };
  }

  return {
    done: false,
    data: updatedData,
    nextStep,
    text: `${nextStep + 1}/${FORM_FIELDS.length} - ${FORM_FIELDS[nextStep].label}:`,
  };
}

module.exports = {
  startEnrollment,
  processEnrollmentAnswer,
};
