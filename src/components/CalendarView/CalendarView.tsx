import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  getDay, addMonths, subMonths, isSameDay, parseISO, isBefore, isToday,
} from 'date-fns';
import { useAppStore } from '../../store/useAppStore';
import { supabase } from '../../lib/supabase';

interface DayMeta {
  hasTasks: boolean;
  allComplete: boolean;
  hasIncomplete: boolean;
}

interface CalendarViewProps {
  onDateSelect: (date: string) => void;
}

export const CalendarView = ({ onDateSelect }: CalendarViewProps) => {
  const { activeDate } = useAppStore();
  const [viewMonth, setViewMonth] = useState(new Date());
  const [dayMeta, setDayMeta] = useState<Record<string, DayMeta>>({});
  const [slideDir, setSlideDir] = useState(0);

  useEffect(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth() + 1;
    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    const end = `${year}-${String(month).padStart(2, '0')}-31`;

    supabase
      .from('tasks')
      .select('due_date, completed')
      .gte('due_date', start)
      .lte('due_date', end)
      .then(({ data }) => {
        if (!data) return;
        const meta: Record<string, DayMeta> = {};
        for (const t of data) {
          const d = t.due_date;
          if (!meta[d]) meta[d] = { hasTasks: false, allComplete: true, hasIncomplete: false };
          meta[d].hasTasks = true;
          if (!t.completed) {
            meta[d].allComplete = false;
            meta[d].hasIncomplete = true;
          }
        }
        setDayMeta(meta);
      });
  }, [viewMonth]);

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDow = getDay(monthStart); // 0=Sun
  const blanks = Array(startDow).fill(null);

  const goNext = () => {
    setSlideDir(1);
    setViewMonth(addMonths(viewMonth, 1));
  };
  const goPrev = () => {
    setSlideDir(-1);
    setViewMonth(subMonths(viewMonth, 1));
  };

  const handleDayTap = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    onDateSelect(dateStr);
  };

  const activeD = parseISO(activeDate);

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: `calc(var(--safe-top) + 16px) var(--space-xl) 0`,
      overflow: 'hidden',
    }}>
      {/* Month header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
      }}>
        <button
          onClick={goPrev}
          aria-label="Previous month"
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--color-card)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ChevronLeft size={18} color="var(--color-white)" />
        </button>

        <AnimatePresence mode="popLayout" initial={false}>
          <motion.h2
            key={format(viewMonth, 'yyyy-MM')}
            initial={{ x: slideDir * 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: slideDir * -30, opacity: 0 }}
            transition={{ duration: 0.28 }}
            style={{ fontSize: 20, fontWeight: 700 }}
          >
            {format(viewMonth, 'MMMM yyyy')}
          </motion.h2>
        </AnimatePresence>

        <button
          onClick={goNext}
          aria-label="Next month"
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--color-card)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ChevronRight size={18} color="var(--color-white)" />
        </button>
      </div>

      {/* Day of week headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 8 }}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} style={{
            textAlign: 'center', fontSize: 11,
            fontWeight: 600, color: 'var(--color-grey)',
            padding: '0 0 6px',
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={format(viewMonth, 'yyyy-MM')}
          initial={{ x: slideDir * 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: slideDir * -40, opacity: 0 }}
          transition={{ duration: 0.28 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px 0' }}
        >
          {blanks.map((_, i) => <div key={`blank-${i}`} />)}
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const meta = dayMeta[dateStr];
            const isSelected = isSameDay(day, activeD);
            const isT = isToday(day);
            const isPast = isBefore(day, new Date()) && !isT;

            let dotColor: string | null = null;
            if (meta?.hasTasks) {
              if (isPast) {
                dotColor = meta.allComplete ? '#4CAF50' : '#F05050';
              } else {
                dotColor = 'var(--color-yellow)';
              }
            }

            return (
              <button
                key={dateStr}
                onClick={() => handleDayTap(day)}
                aria-label={`${format(day, 'EEEE, MMMM d')}${meta?.hasTasks ? `, has tasks` : ''}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 44,
                  border: isSelected && !isT ? '1.5px solid var(--color-white)' : 'none',
                  borderRadius: '50%',
                  background: isT ? 'var(--color-yellow)' : 'transparent',
                  cursor: 'pointer',
                  position: 'relative',
                  gap: 2,
                }}
              >
                <span style={{
                  fontSize: 15,
                  fontWeight: isT || isSelected ? 700 : 400,
                  color: isT
                    ? 'var(--color-text-dark)'
                    : isSelected
                      ? 'var(--color-yellow)'
                      : isPast
                        ? 'var(--color-grey)'
                        : 'var(--color-white)',
                  opacity: !isT && !isSelected && !isPast ? 1 : undefined,
                }}>
                  {format(day, 'd')}
                </span>
                {dotColor && (
                  <div style={{
                    width: 4, height: 4, borderRadius: '50%',
                    background: dotColor, flexShrink: 0,
                  }} />
                )}
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Legend */}
      <div style={{
        display: 'flex',
        gap: 16,
        marginTop: 20,
        paddingTop: 16,
        borderTop: '1px solid var(--color-mid)',
      }}>
        {[
          { color: 'var(--color-yellow)', label: 'Has tasks' },
          { color: '#4CAF50', label: 'All complete' },
          { color: '#F05050', label: 'Incomplete past' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.color }} />
            <span style={{ fontSize: 11, color: 'var(--color-grey)' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
