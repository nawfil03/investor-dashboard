
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(envConfig.VITE_SUPABASE_URL, envConfig.VITE_SUPABASE_SERVICE_KEY);

async function listAllTables() {
    let log = "--- FULL DATABASE AUDIT ---\n";

    // Check known tables from previous context, plus generic discovery
    const tables = ['profiles', 'study_sessions', 'courses', 'user_stats', 'daily_stats', 'goals', 'notes', 'exams'];

    for (const table of tables) {
        const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        if (error) {
            log += `${table}: [Not Found or Error] ${error.message}\n`;
        } else {
            log += `${table}: ${count} rows\n`;

            // If rows exist, show columns
            if (count > 0) {
                const { data } = await supabase.from(table).select('*').limit(1);
                if (data && data.length > 0) {
                    log += `   Columns: ${Object.keys(data[0]).join(', ')}\n`;
                }
            }
        }
    }
    log += "---------------------------\n";
    fs.writeFileSync('audit_full_results.txt', log);
    console.log("Audit written to audit_full_results.txt");
}

listAllTables();
