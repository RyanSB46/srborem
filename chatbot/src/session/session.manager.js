const sessions = new Map();

const SESSION_TTL_MS = Number(process.env.SESSION_TTL_MS || 1000 * 60 * 60 * 24 * 3);
const ANTI_LOOP_WINDOW_MS = Number(process.env.ANTI_LOOP_WINDOW_MS || 1000 * 60 * 3);

function getSession(phone) {
  const now = Date.now();
  const current = sessions.get(phone);

  if (!current) {
    const fresh = createDefaultSession(now);
    sessions.set(phone, fresh);
    return fresh;
  }

  if (now - current.updatedAt > SESSION_TTL_MS) {
    const renewed = createDefaultSession(now);
    sessions.set(phone, renewed);
    return renewed;
  }

  current.updatedAt = now;
  return current;
}

function createDefaultSession(now) {
  return {
    stage: 'idle',
    handoff: false,
    matriculaStep: -1,
    matriculaData: {},
    lastIntent: null,
    lastSentText: null,
    lastSentAt: 0,
    lastFloodNoticeAt: 0,
    recentInbound: [],
    updatedAt: now,
  };
}

function saveSession(phone, patch) {
  const prev = getSession(phone);
  const next = {
    ...prev,
    ...patch,
    updatedAt: Date.now(),
  };
  sessions.set(phone, next);
  return next;
}

function canSendText(phone, text) {
  const session = getSession(phone);
  const now = Date.now();
  const repeated = session.lastSentText === text;
  const withinWindow = now - session.lastSentAt <= ANTI_LOOP_WINDOW_MS;
  return !(repeated && withinWindow);
}

function reserveSendText(phone, text) {
  const session = getSession(phone);
  const now = Date.now();
  const repeated = session.lastSentText === text;
  const withinWindow = now - session.lastSentAt <= ANTI_LOOP_WINDOW_MS;

  if (repeated && withinWindow) {
    return false;
  }

  session.lastSentText = text;
  session.lastSentAt = now;
  session.updatedAt = now;
  sessions.set(phone, session);
  return true;
}

function registerOutbound(phone, text) {
  const session = getSession(phone);
  session.lastSentText = text;
  session.lastSentAt = Date.now();
  session.updatedAt = Date.now();
  sessions.set(phone, session);
}

function registerInbound(phone) {
  const session = getSession(phone);
  const now = Date.now();
  session.recentInbound = [...session.recentInbound.filter((ts) => now - ts <= 12000), now];
  session.updatedAt = now;
  sessions.set(phone, session);
  return session.recentInbound.length;
}

function shouldNotifyFlood(phone) {
  const session = getSession(phone);
  const now = Date.now();
  if (session.recentInbound.length < 3) {
    return false;
  }
  if (now - session.lastFloodNoticeAt < 15000) {
    return false;
  }
  session.lastFloodNoticeAt = now;
  sessions.set(phone, session);
  return true;
}

module.exports = {
  getSession,
  saveSession,
  registerInbound,
  shouldNotifyFlood,
  canSendText,
  reserveSendText,
  registerOutbound,
};
