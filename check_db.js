import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env.local manually since dotenv usually looks for .env
const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
for (const k in envConfig) {
    process.env[k] = envConfig[k];
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDb() {
    console.log('Connecting to Supabase...');
    console.log(`URL: ${supabaseUrl}`);

    const { data, error } = await supabase
        .from('dashboard_stats')
        .select('*');

    if (error) {
        console.error('Error connecting to DB:', error.message);
    } else {
        console.log('Successfully connected!');
        console.log('Current Data in "dashboard_stats":');
        console.table(data);
    }
}

checkDb();
