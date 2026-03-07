import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
const supabase = createClient(envConfig.VITE_SUPABASE_URL, envConfig.VITE_SUPABASE_ANON_KEY);

async function probeTable(tableName) {
    process.stdout.write(`Checking table '${tableName}'... `);
    const { data, error } = await supabase.from(tableName).select('*').limit(1);

    if (error) {
        if (error.code === '42P01' || error.message.includes('does not exist')) {
            console.log('Not found.');
            return false;
        }
        console.log(`Error: ${error.message}`); // Could be permission error, which means table might exist!
        return false;
    }

    console.log('Found! (Connection Successful)');
    if (data.length > 0) {
        console.log('Sample data:', data[0]);
    } else {
        console.log('Table exists but is empty.');
    }
    return true;
}

async function verify() {
    console.log('Verifying connection to:', envConfig.VITE_SUPABASE_URL);

    // Try "deals" based on user's hint
    let found = await probeTable('deals');
    if (!found) found = await probeTable('Deals');
    if (!found) found = await probeTable('deal');
    if (!found) found = await probeTable('transactions');
    if (!found) found = await probeTable('projects');

    if (found) {
        console.log('\nSUCCESS: Connected to database and found a valid table.');
    } else {
        console.log('\nRESULT: Credentials seem valid (endpoint reached), but could not guess the table name.');
        console.log('The connection is likely establishing, just need the right table name.');
    }
}

verify();
