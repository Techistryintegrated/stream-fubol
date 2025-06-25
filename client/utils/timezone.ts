import { DateTime } from 'luxon';

export function convertISTtoWAT(istTimeStr: string): string | null {
  // Skip conversion if string is missing, empty, or "0"
  if (!istTimeStr || istTimeStr === '0') return null;

  const dt = DateTime.fromFormat(istTimeStr, 'M/d/yyyy h:mm:ss a', {
    zone: 'Asia/Kolkata',
  });
  if (!dt.isValid) return null; // Instead of throwing error, return null

  return dt.setZone('Africa/Lagos').toISO();
}
