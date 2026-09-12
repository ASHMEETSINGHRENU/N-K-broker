export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validates international phone or UAE mobile format
 * e.g. +971501234567 or 0501234567 or general international +[1-9][0-9]{7,14}
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  const re = /^\+?[0-9]{8,15}$/;
  return re.test(cleaned);
}

export function maskPhone(phone?: string): string {
  if (!phone) return '—';
  const cleaned = phone.trim();
  if (cleaned.length < 5) return '***';
  return cleaned.slice(0, 4) + ' ••• ••• ' + cleaned.slice(-2);
}

export function maskEmail(email?: string): string {
  if (!email) return '—';
  const parts = email.split('@');
  if (parts.length !== 2) return '***@***';
  const name = parts[0];
  const domain = parts[1];
  const maskedName = name.length > 2 ? name[0] + '***' + name[name.length - 1] : name[0] + '***';
  return `${maskedName}@${domain}`;
}
