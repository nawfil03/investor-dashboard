
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
const supabase = createClient(envConfig.VITE_SUPABASE_URL, envConfig.VITE_SUPABASE_ANON_KEY);

async function listTables() {
    console.log('Listing tables in public schema...');

    // There isn't a direct "list tables" in supabase-js for anon without querying system catalogs if allowed.
    // However, we can try to query a non-existent table to get a hint or if RPC is set up.
    // Or better, we can query `information_schema.tables` if we have access (often restricted for anon).
    // A more robust way for anon is to try common names.

    // Trying to fetch from information_schema (might fail with permission denied)
    // If that fails, we will brute-force check common names.

    const commonNames = ['users', 'profiles', 'accounts', 'members', 'app_users', 'players', 'clients'];

    for (const name of commonNames) {
        process.stdout.write(`Checking '${name}'... `);
        const { data, error } = await supabase.from(name).select('*').limit(1);
        if (!error) {
            console.log('FOUND!');
            if (data.length > 0) {
                console.log('Sample keys:', Object.keys(data[0]));
            } else {
                console.log('Empty table.');
            }
        } else {
            console.log('Not accessible or does not exist.');
        }
    }
}

listTables();
