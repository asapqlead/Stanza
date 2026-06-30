import { useEffect, useState } from 'react';
import { TopBar } from '../components/TopBar/TopBar';
import { DayFolder } from '../components/DayFolder/DayFolder';
import { AddTaskSheet } from '../components/AddTaskSheet/AddTaskSheet';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types/database.types';

interface HomeProps {
  onAvatarTap: () => void;
  onDateTap: () => void;
}

export const Home = ({ onAvatarTap, onDateTap }: HomeProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (data) setProfile(data);
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden' }}>
      <TopBar
        onAvatarTap={onAvatarTap}
        onDateTap={onDateTap}
        displayName={profile?.display_name ?? undefined}
        avatarUrl={profile?.avatar_url}
      />
      <DayFolder />
      <AddTaskSheet />
    </div>
  );
};
