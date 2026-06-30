import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Calendar, Clock, Check } from 'lucide-react';
import type { Task } from '../../types/database.types';
import { formatShortDate, formatTime } from '../../utils/date';
import { completeTask, uncompleteTask } from '../../utils/taskMutations';
import { useHaptic } from '../../hooks/useHaptic';

interface TaskCardProps {
  task: Task;
  onTap?: () => void;
  style?: React.CSSProperties;
}

const CARD_COLORS: Record<string, string> = {
  Low: 'var(--color-green-card)',
  Medium: 'var(--color-amber-card)',
  High: 'var(--color-red-card)',
  Blocked: 'var(--color-purple-card)',
};

export const TaskCard = ({ task, onTap, style }: TaskCardProps) => {
  const [completing, setCompleting] = useState(false);
  const { heavy } = useHaptic();

  const bg = task.completed ? 'var(--color-mid)' : CARD_COLORS[task.urgency] ?? 'var(--color-amber-card)';
  const textColor = task.completed ? 'var(--color-grey)' : 'var(--color-text-dark)';

  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setCompleting(true);
    heavy();
    if (task.completed) {
      await uncompleteTask(task.id);
    } else {
      await completeTask(task.id, task.due_date);
    }
    setCompleting(false);
  };

  return (
    <motion.div
      layout
      onClick={onTap}
      style={{
        background: bg,
        borderRadius: 'var(--radius-md)',
        padding: '14px var(--space-lg)',
        position: 'relative',
        cursor: 'pointer',
        minHeight: 80,
        ...style,
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Urgency badge */}
      {!task.completed && (
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: bg,
          border: '1.5px solid rgba(0,0,0,0.12)',
          borderRadius: 'var(--radius-pill)',
          padding: '2px 8px',
          fontSize: 10,
          fontWeight: 700,
          color: 'var(--color-text-dark)',
          letterSpacing: '0.5px',
        }}>
          {task.urgency.toUpperCase()}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        {/* Complete button */}
        <motion.button
          onClick={handleComplete}
          animate={completing ? { scale: [0.9, 1.1, 1] } : {}}
          transition={{ duration: 0.3 }}
          aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            border: task.completed
              ? 'none'
              : '2px solid rgba(0,0,0,0.3)',
            background: task.completed ? 'rgba(0,0,0,0.25)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: 2,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          <AnimatePresence>
            {task.completed && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Check size={14} color="var(--color-grey)" strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title */}
          <p style={{
            fontSize: 16,
            fontWeight: 700,
            color: textColor,
            lineHeight: 1.3,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            textDecoration: task.completed ? 'line-through' : 'none',
            opacity: task.completed ? 0.6 : 1,
            paddingRight: task.completed ? 0 : 60,
            transition: 'opacity 0.2s',
          }}>
            {task.title}
          </p>

          {/* Description */}
          {task.description && (
            <p style={{
              fontSize: 13,
              color: 'rgba(28,28,30,0.6)',
              marginTop: 4,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
              {task.description}
            </p>
          )}

          {/* Meta row */}
          {(task.due_time) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 6,
            }}>
              {task.due_time && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Clock size={11} color="rgba(28,28,30,0.5)" />
                  <span style={{ fontSize: 11, color: 'rgba(28,28,30,0.5)', fontWeight: 500 }}>
                    {formatTime(task.due_time)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* Stacked preview card (shows as tab) */
export const TaskCardStacked = ({
  task,
  index,
  total,
}: {
  task: Task;
  index: number;
  total: number;
}) => {
  const bg = CARD_COLORS[task.urgency] ?? 'var(--color-amber-card)';
  const offset = index * 10;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: -offset,
        left: offset / 2,
        right: offset / 2,
        height: index === 0 ? 'auto' : 10,
        background: bg,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        zIndex: total - index,
        boxShadow: index === 0
          ? '0 4px 12px rgba(0,0,0,0.3)'
          : `0 ${2 - index}px 6px rgba(0,0,0,0.2)`,
      }}
    >
      {index === 0 && (
        <div style={{ padding: '14px var(--space-lg)', paddingBottom: 20 }}>
          <p style={{
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--color-text-dark)',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          }}>
            {task.title}
          </p>
          {task.due_time && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
              <Clock size={11} color="rgba(28,28,30,0.5)" />
              <span style={{ fontSize: 11, color: 'rgba(28,28,30,0.5)', fontWeight: 500 }}>
                {formatTime(task.due_time)}
              </span>
            </div>
          )}
          <div style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'rgba(0,0,0,0.1)',
            borderRadius: 'var(--radius-pill)',
            padding: '2px 8px',
            fontSize: 10,
            fontWeight: 700,
            color: 'var(--color-text-dark)',
            letterSpacing: '0.5px',
          }}>
            {task.urgency.toUpperCase()}
          </div>
        </div>
      )}
    </div>
  );
};
