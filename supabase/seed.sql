-- supabase/seed.sql
-- Dev seed data — run after migrations on local Supabase instance
-- Replace 'your-user-uuid' with actual auth.users id from Supabase dashboard

-- Sample tasks for today
INSERT INTO public.tasks (user_id, title, description, urgency, due_date, due_time, sort_order)
VALUES
  ('your-user-uuid', 'Design Review', 'Review Q3 design system with the product team', 'High', CURRENT_DATE, '10:00:00', 0),
  ('your-user-uuid', 'Client Lunch', 'Lunch at noon with Acme Corp stakeholders', 'Medium', CURRENT_DATE, '12:00:00', 1),
  ('your-user-uuid', 'Code Review', 'Review pull requests from the engineering team', 'Low', CURRENT_DATE, NULL, 2),
  ('your-user-uuid', 'Team Standup', 'Daily async standup — update status', 'Medium', CURRENT_DATE, '09:00:00', 3);
