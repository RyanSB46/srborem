const axios = require('axios');

const baseURL = (process.env.EVOLUTION_API_URL || 'http://localhost:8080').replace(/\/$/, '');
const instance = process.env.EVOLUTION_INSTANCE;
const apiKey = process.env.EVOLUTION_API_KEY;

const sendPathTemplate = process.env.EVOLUTION_SEND_PATH_TEMPLATE || '/message/sendText/{instance}';
const sendPayloadMode = process.env.EVOLUTION_SEND_PAYLOAD_MODE || 'simple';

const http = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    apikey: apiKey,
    'Content-Type': 'application/json',
  },
});

function getSendPath() {
  if (!instance) {
    throw new Error('EVOLUTION_INSTANCE não configurado');
  }
  return sendPathTemplate.replace('{instance}', instance);
}

function buildPayload(to, text) {
  if (sendPayloadMode === 'textMessage') {
    return {
      number: to,
      options: { delay: 1200, presence: 'composing' },
      textMessage: { text },
    };
  }

  return {
    number: to,
    text,
  };
}

async function sendText(to, text) {
  if (!apiKey) {
    throw new Error('EVOLUTION_API_KEY não configurada');
  }

  const path = getSendPath();
  const payload = buildPayload(to, text);
  await http.post(path, payload);
}

module.exports = {
  sendText,
};
