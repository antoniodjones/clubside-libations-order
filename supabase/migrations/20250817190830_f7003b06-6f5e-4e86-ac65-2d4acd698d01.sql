-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create cron job to run abandoned cart reminders every 2 minutes
SELECT cron.schedule(
  'send-abandoned-cart-reminders',
  '*/2 * * * *', -- every 2 minutes for testing (change to */5 for production)
  $$
  SELECT
    net.http_post(
        url:='https://zkhawnmbfmbnzspfgkje.supabase.co/functions/v1/send-abandoned-cart-reminders',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpraGF3bm1iZm1ibnpzcGZna2plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0ODU5MzYsImV4cCI6MjA2NDA2MTkzNn0.-qUB2hiqWuUaesE0ik0YI-Clb9_9dKM3h59AuyGeoDo"}'::jsonb,
        body:='{"trigger": "cron"}'::jsonb
    ) as request_id;
  $$
);