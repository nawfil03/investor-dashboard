
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
const serviceKey = envConfig.VITE_SUPABASE_SERVICE_KEY;
const supabaseUrl = envConfig.VITE_SUPABASE_URL;

const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function inspectProfiles() {
    console.log('Inspecting "profiles" table...');
    const { data, error } = await supabaseAdmin.from('profiles').select('*').limit(1);

    if (error) {
        console.error('Error:', error.message);
    } else {
        if (data.length === 0) {
            console.log('Table exists but is empty.');
            // We can't see columns if empty without querying system catalogs, which requires SQL.
            // But we can guess standard ones or just handle empty state.
        } else {
            console.log('Columns found:', Object.keys(data[0]).join(', '));
            console.log('Sample Data:', data[0]);
        }
    }
}

inspectProfiles();
