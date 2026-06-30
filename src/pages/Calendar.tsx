import { CalendarView } from '../components/CalendarView/CalendarView';
import { useAppStore } from '../store/useAppStore';

interface CalendarProps {
  onDateSelect: (date: string) => void;
}

export const Calendar = ({ onDateSelect }: CalendarProps) => {
  const { setActiveDate, setActiveNav } = useAppStore();

  const handleDateSelect = (date: string) => {
    setActiveDate(date);
    setActiveNav('home');
    onDateSelect(date);
  };

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <CalendarView onDateSelect={handleDateSelect} />
    </div>
  );
};
