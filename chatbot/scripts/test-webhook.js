const axios = require('axios');

async function main() {
  const webhookUrl = process.env.WEBHOOK_TEST_URL || 'http://localhost:3000/webhook';
  const phone = process.env.TEST_PHONE || '5531999999999';
  const messageId = process.env.TEST_MESSAGE_ID || `TEST_${Date.now()}`;
  const text = process.argv.slice(2).join(' ') || 'Olá, qual o valor das aulas de violão?';

  const payload = {
    event: 'messages.upsert',
    instance: process.env.EVOLUTION_INSTANCE || 'srborem',
    data: {
      key: {
        remoteJid: `${phone}@s.whatsapp.net`,
        fromMe: false,
        id: messageId,
      },
      message: {
        conversation: text,
      },
      messageType: 'conversation',
      pushName: 'Teste Local',
    },
  };

  const response = await axios.post(webhookUrl, payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
  });

  console.log('Webhook status:', response.status);
  console.log('Resposta endpoint:', response.data);
  console.log('Payload enviado para:', webhookUrl);
  console.log('Telefone de teste:', phone);
  console.log('Message ID:', messageId);
  console.log('Texto:', text);
}

main().catch((error) => {
  if (error.response) {
    console.error('Falha:', error.response.status, error.response.data);
    process.exit(1);
  }

  console.error('Erro:', error.message);
  process.exit(1);
});
