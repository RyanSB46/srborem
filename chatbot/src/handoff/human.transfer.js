function buildHandoffStartMessage() {
  return 'Perfeito, vou pausar o bot e encaminhar seu atendimento para o Henrique. Se quiser retomar comigo depois, é só escrever: "voltar pro bot".';
}

function buildHandoffActiveMessage() {
  return 'Seu atendimento já está em modo humano com o Henrique. Quando quiser voltar para o bot, envie: "voltar pro bot".';
}

function buildHandoffResumeMessage() {
  return 'Atendimento automático retomado ✅ Como posso te ajudar agora?';
}

module.exports = {
  buildHandoffStartMessage,
  buildHandoffActiveMessage,
  buildHandoffResumeMessage,
};
