
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
const supabase = createClient(envConfig.VITE_SUPABASE_URL, envConfig.VITE_SUPABASE_ANON_KEY);

async function inspect() {
    console.log('Fetching database overview...');
    const { data, error } = await supabase.rpc('get_db_overview');

    if (error) {
        console.error('Error fetching overview:', error.message);
    } else {
        console.log('Database Overview:');
        console.log(JSON.stringify(data, null, 2));
    }
}

inspect();
