
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(envConfig.VITE_SUPABASE_URL, envConfig.VITE_SUPABASE_SERVICE_KEY);

async function listAllTables() {
    console.log("--- FULL DATABASE AUDIT ---");

    // Check known tables from previous context, plus generic discovery
    const tables = ['profiles', 'study_sessions', 'courses', 'user_stats', 'daily_stats', 'goals', 'notes', 'exams'];

    for (const table of tables) {
        const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        if (error) {
            // Table might not exist
            // console.log(`${table}: [Not Found or Error] ${error.message}`);
        } else {
            console.log(`${table}: ${count} rows`);

            // If rows exist, show columns
            if (count > 0) {
                const { data } = await supabase.from(table).select('*').limit(1);
                if (data && data.length > 0) {
                    console.log(`   Columns: ${Object.keys(data[0]).join(', ')}`);
                }
            }
        }
    }
    console.log("---------------------------");
}

listAllTables();
