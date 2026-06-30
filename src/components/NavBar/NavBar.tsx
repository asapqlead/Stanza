import { motion } from 'framer-motion';
import { Home, CalendarDays, Settings } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { NavTab } from '../../types/database.types';
import { format } from 'date-fns';

const NAV_TABS: { id: NavTab; icon: LucideIcon; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'calendar', icon: CalendarDays, label: 'Calendar' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

interface NavBarProps {
  onTabChange: (tab: NavTab) => void;
}

export const NavBar = ({ onTabChange }: NavBarProps) => {
  const { activeNav, setActiveNav, setActiveDate } = useAppStore();

  const handleTab = (tab: NavTab) => {
    if (tab === 'home' && activeNav === 'home') {
      setActiveDate(format(new Date(), 'yyyy-MM-dd'));
    }
    setActiveNav(tab);
    onTabChange(tab);
  };

  return (
    <div
      role="tablist"
      aria-label="Main navigation"
      style={{
        position: 'fixed',
        bottom: `calc(var(--safe-bottom) + 16px)`,
        left: 24,
        right: 24,
        height: 56,
        background: 'rgba(44,44,46,0.92)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderRadius: 'var(--radius-pill)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 100,
        padding: '0 4px',
      }}
    >
      {NAV_TABS.map((tab, i) => {
        const isActive = activeNav === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-label={`${tab.label}, tab ${i + 1} of 3`}
            onClick={() => handleTab(tab.id)}
            style={{
              flex: 1,
              height: 48,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              borderRadius: 'var(--radius-pill)',
              minWidth: 48,
            }}
          >
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                style={{
                  position: 'absolute',
                  inset: 4,
                  background: 'var(--color-yellow)',
                  borderRadius: 'var(--radius-pill)',
                  zIndex: 0,
                }}
              />
            )}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Icon
                size={22}
                strokeWidth={1.75}
                color={isActive ? 'var(--color-text-dark)' : 'var(--color-grey)'}
              />
            </div>
            {isActive && (
              <span style={{
                position: 'relative',
                zIndex: 1,
                fontSize: 9,
                fontWeight: 600,
                color: 'var(--color-text-dark)',
                lineHeight: 1,
              }}>
                {tab.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
