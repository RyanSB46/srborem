function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function cleanPhone(rawPhone) {
  return String(rawPhone || '')
    .replace('@s.whatsapp.net', '')
    .replace(/\D/g, '');
}

function compactText(value) {
  return normalizeText(value).replace(/\s+/g, ' ');
}

module.exports = {
  normalizeText,
  cleanPhone,
  compactText,
};
