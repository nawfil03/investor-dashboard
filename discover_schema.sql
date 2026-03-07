
-- Run this in Supabase SQL Editor.
-- This updated version fetches ALL tables and ALL column details (names & types).

create or replace function get_db_overview()
returns json
language plpgsql
security definer
as $$
declare
    result json;
begin
    select json_agg(tbl) into result
    from (
        select 
            t.table_name,
            (
                select json_agg(json_build_object('name', c.column_name, 'type', c.data_type))
                from information_schema.columns c
                where c.table_name = t.table_name
                and c.table_schema = 'public'
            ) as columns
        from information_schema.tables t
        where t.table_schema = 'public'
    ) tbl;

    return coalesce(result, '[]'::json);
end;
$$;
