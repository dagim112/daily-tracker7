import dayjs from 'dayjs';

export const weekDays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

export function getWeek(startDate?: string) {
  const base = startDate ? dayjs(startDate) : dayjs();
  const monday = base.startOf('week').add(1, 'day');
  return Array.from({ length: 7 }, (_, i) => monday.add(i, 'day'));
}

export function labelWithFullDate(d: dayjs.Dayjs) {
  return `${d.format('dddd')} — ${d.format('DD MMM YYYY')}`;
}
