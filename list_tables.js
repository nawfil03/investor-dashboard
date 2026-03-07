
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(envConfig.VITE_SUPABASE_URL, envConfig.VITE_SUPABASE_SERVICE_KEY);

async function listTables() {
    const { data, error } = await supabase
        .from('information_schema.tables')
        .select('*')
        .eq('table_schema', 'public'); // Note: This might not work via client if not exposed

    // Alternative: Just try to select 1 row from study_sessions
    const { count, error: sessionError } = await supabase
        .from('study_sessions')
        .select('*', { count: 'exact', head: true });

    console.log("Study Sessions Count:", count);
    if (sessionError) console.log("Session Error:", sessionError.message);
}

listTables();
