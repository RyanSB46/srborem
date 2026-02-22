const express = require('express');
const { classifyMessage } = require('./nlu/classifier');
const { buildAllPricingMessage, buildInstrumentPricingMessage } = require('./flows/preco.flow');
const { startEnrollment, processEnrollmentAnswer } = require('./flows/matricula.flow');
const { sendText } = require('./evolution.service');
const {
  getSession,
  saveSession,
  registerInbound,
  shouldNotifyFlood,
  reserveSendText,
  registerOutbound,
} = require('./session/session.manager');
const {
  buildHandoffActiveMessage,
  buildHandoffResumeMessage,
  buildHandoffStartMessage,
} = require('./handoff/human.transfer');
const { cleanPhone, compactText } = require('./utils/text');
const { AULA_PADRAO, MATRICULA_INFO } = require('./constants/catalog');

const router = express.Router();
const inboundMessageCache = new Map();
const INBOUND_DEDUP_WINDOW_MS = Number(process.env.INBOUND_DEDUP_WINDOW_MS || 1000 * 60 * 2);

router.post('/', async (req, res) => {
  res.status(200).json({ received: true });

  try {
    const inbound = extractInboundMessage(req.body);
    if (!inbound || !inbound.phone || inbound.fromMe || !inbound.text) {
      return;
    }

    if (isDuplicateInbound(inbound.phone, inbound.messageId)) {
      return;
    }

    const phone = inbound.phone;
    const userText = inbound.text.trim();
    registerInbound(phone);

    if (shouldNotifyFlood(phone)) {
      await sendReply(phone, 'Recebi suas mensagens ✅ Vou te responder em sequência para não ficar confuso, combinado?');
    }

    const session = getSession(phone);
    const normalized = compactText(userText);

    if (session.handoff) {
      if (normalized.includes('voltar pro bot') || normalized.includes('retomar atendimento')) {
        saveSession(phone, { handoff: false, stage: 'idle', lastIntent: 'retomar_bot' });
        await sendReply(phone, buildHandoffResumeMessage());
        return;
      }

      await sendReply(phone, buildHandoffActiveMessage());
      return;
    }

    if (session.stage === 'enrollment') {
      const stepResult = processEnrollmentAnswer(session, userText);
      if (stepResult.done) {
        saveSession(phone, {
          stage: 'awaiting_payment_receipt',
          matriculaStep: -1,
          matriculaData: stepResult.data || session.matriculaData,
        });
      } else {
        saveSession(phone, {
          stage: 'enrollment',
          matriculaStep: stepResult.nextStep,
          matriculaData: stepResult.data,
        });
      }

      await sendReply(phone, stepResult.text);
      return;
    }

    if (session.stage === 'awaiting_payment_receipt' && (inbound.isMedia || normalized.includes('comprovante') || normalized.includes('paguei'))) {
      saveSession(phone, { stage: 'payment_under_review', lastIntent: 'enviar_comprovante' });
      await sendReply(
        phone,
        'Comprovante recebido ✅ Vou sinalizar o Henrique para confirmar o pagamento e seguir com a inclusão no grupo e finalização da matrícula.'
      );
      return;
    }

    const classification = classifyMessage(userText);
    saveSession(phone, { lastIntent: classification.intent });
    const reply = buildReplyByIntent(classification, session);

    if (reply) {
      if (reply.activateHandoff) {
        saveSession(phone, { handoff: true, stage: 'human_handoff' });
      }
      if (reply.startEnrollment) {
        const enrollment = startEnrollment();
        saveSession(phone, { stage: 'enrollment', matriculaStep: enrollment.nextStep, matriculaData: {} });
        await sendReply(phone, enrollment.text);
        return;
      }
      await sendReply(phone, reply.text);
    }
  } catch (error) {
    console.error('[webhook] erro ao processar evento:', error.message);
  }
});

function buildReplyByIntent(classification) {
  const { intent, confidence, entities } = classification;

  if (confidence < 0.5) {
    return {
      text: 'Não quero te responder errado. Você prefere: valores, horários, matrícula ou falar com o Henrique?',
    };
  }

  switch (intent) {
    case 'saudacao':
      return {
        text: [
          'Olá! Que bom receber seu contato 🎶',
          'Posso te ajudar com valores, horários, matrícula ou já te conectar com o Henrique.',
          'Qual instrumento você tem interesse?',
        ].join('\n'),
      };

    case 'apresentacao':
      return {
        text: 'Sou o assistente da Sr. Borém Escola de Música e te ajudo com informações iniciais. Se quiser, te transfiro para o Henrique.',
      };

    case 'preco_geral':
      return { text: buildAllPricingMessage() };

    case 'preco_instrumento': {
      if (!entities.instrument) {
        return { text: 'Perfeito! Me diz o instrumento que você quer (piano, violão, canto, guitarra, bateria...).' };
      }
      return { text: buildInstrumentPricingMessage(entities.instrument) || buildAllPricingMessage() };
    }

    case 'detalhes_aula':
      return { text: AULA_PADRAO };

    case 'horarios_disponiveis':
      return {
        text: 'Temos horários em períodos específicos. Me diga se você prefere manhã, tarde, noite ou fim de semana para eu encaminhar ao Henrique confirmar a disponibilidade.',
      };

    case 'matricula_info':
    case 'como_pagar':
      return { text: MATRICULA_INFO };

    case 'quero_matricular':
      return { startEnrollment: true };

    case 'enviar_comprovante':
      return {
        text: 'Perfeito! Pode enviar aqui o comprovante (imagem ou PDF). Assim que chegar eu sinalizo para confirmação.',
      };

    case 'falar_com_professor':
      return {
        text: buildHandoffStartMessage(),
        activateHandoff: true,
      };

    case 'retomar_bot':
      return {
        text: buildHandoffResumeMessage(),
      };

    default:
      return {
        text: 'Consigo te ajudar com valores, horários, matrícula e pagamento. Se preferir, te conecto direto com o Henrique.',
      };
  }
}

async function sendReply(phone, text) {
  if (!text || !phone) {
    return;
  }

  if (!reserveSendText(phone, text)) {
    return;
  }

  await sendText(phone, text);
  registerOutbound(phone, text);
}

function extractInboundMessage(payload) {
  if (!payload) {
    return null;
  }

  const event = payload.event || payload.type || payload?.data?.event;
  const allowed = [
    'MESSAGES_UPSERT',
    'messages.upsert',
    'MENSAGENS_UPSERT',
  ];

  if (event && !allowed.includes(event)) {
    return null;
  }

  const data = payload.data || payload;
  const messageNode = data.message || data.messages?.[0] || data;
  const key = messageNode.key || data.key || {};

  const fromMe = Boolean(key.fromMe || data.fromMe || messageNode.fromMe);
  const remoteJid = key.remoteJid || data.remoteJid || data.key?.remoteJid || data.from;
  const phone = cleanPhone(remoteJid || data.sender || data.phone || data.number);

  const text =
    messageNode?.message?.conversation ||
    messageNode?.message?.extendedTextMessage?.text ||
    messageNode?.conversation ||
    messageNode?.text ||
    data?.text ||
    '';

  const isMedia = Boolean(
    messageNode?.message?.imageMessage ||
      messageNode?.message?.documentMessage ||
      messageNode?.message?.videoMessage ||
      data?.media
  );

  return {
    phone,
    messageId: key.id || data.id || data.messageId || null,
    text: String(text || ''),
    fromMe,
    isMedia,
  };
}

function isDuplicateInbound(phone, messageId) {
  if (!phone || !messageId) {
    return false;
  }

  const now = Date.now();
  for (const [cacheKey, timestamp] of inboundMessageCache.entries()) {
    if (now - timestamp > INBOUND_DEDUP_WINDOW_MS) {
      inboundMessageCache.delete(cacheKey);
    }
  }

  const key = `${phone}:${messageId}`;
  if (inboundMessageCache.has(key)) {
    return true;
  }

  inboundMessageCache.set(key, now);
  return false;
}

module.exports = router;
