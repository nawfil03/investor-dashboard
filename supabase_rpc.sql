
-- Run this script in your Supabase SQL Editor to create the function.

create or replace function get_user_stats()
returns json
language plpgsql
security definer
as $$
declare
  total_users int;
  active_users int;
  growth_data json;
begin
  -- Get total number of users
  select count(*) into total_users from auth.users;
  
  -- Get active users (users who signed in within the last 30 days)
  select count(*) into active_users 
  from auth.users 
  where last_sign_in_at > now() - interval '30 days';
  
  -- Get daily user growth for the last 30 days
  select json_agg(t) into growth_data from (
    select date_trunc('day', created_at) as date, count(*) as count
    from auth.users
    where created_at > now() - interval '30 days'
    group by date_trunc('day', created_at)
    order by date_trunc('day', created_at)
  ) t;

  -- Return the data as a JSON object
  return json_build_object(
    'total_users', total_users,
    'active_users', active_users,
    'growth', coalesce(growth_data, '[]'::json)
  );
end;
$$;
