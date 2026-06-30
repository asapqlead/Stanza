import { format, addDays, parseISO, isToday, isPast, isFuture } from 'date-fns';

export const formatDate = (dateStr: string) => format(parseISO(dateStr), 'yyyy-MM-dd');
export const formatDisplay = (dateStr: string) => format(parseISO(dateStr), 'EEEE, d MMMM');
export const formatDayNum = (dateStr: string) => format(parseISO(dateStr), 'd');
export const formatMonth = (dateStr: string) => format(parseISO(dateStr), 'MMMM');
export const formatWeekday = (dateStr: string) => format(parseISO(dateStr), 'EEEE');
export const formatShortDate = (dateStr: string) => format(parseISO(dateStr), 'MMM d');
export const formatTime = (time: string | null) => {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'pm' : 'am';
  const h12 = hour % 12 || 12;
  return `${h12}:${m}${ampm}`;
};

export const nextDay = (dateStr: string) => format(addDays(parseISO(dateStr), 1), 'yyyy-MM-dd');
export const prevDay = (dateStr: string) => format(addDays(parseISO(dateStr), -1), 'yyyy-MM-dd');
export const today = () => format(new Date(), 'yyyy-MM-dd');
export const isDateToday = (dateStr: string) => isToday(parseISO(dateStr));
export const isDatePast = (dateStr: string) => isPast(parseISO(dateStr)) && !isToday(parseISO(dateStr));
export const isDateFuture = (dateStr: string) => isFuture(parseISO(dateStr)) && !isToday(parseISO(dateStr));

export { format, addDays, parseISO };
