import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Load credentials
const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
const supabaseUrl = envConfig.VITE_SUPABASE_URL;
const supabaseKey = envConfig.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSchema() {
    console.log('Attempting to list tables in public schema...');

    // Note: listing information_schema might fail with RLS.
    // If this fails, we will ask the user for the table name directly.
    const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

    if (error) {
        console.error('Could not list tables automatically (likely permission restricted).');
        console.error('Error:', error.message);
    } else {
        if (data.length === 0) {
            console.log('No tables found in "public" schema (or permission denied to list them).');
        } else {
            console.log('Found tables:', data.map(t => t.table_name));
        }
    }
}

inspectSchema();
