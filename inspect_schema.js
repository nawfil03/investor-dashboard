
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(envConfig.VITE_SUPABASE_URL, envConfig.VITE_SUPABASE_SERVICE_KEY);

async function inspectSchema() {
    const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Error:", error.message);
    } else if (data && data.length > 0) {
        console.log("Study Sessions Keys:", Object.keys(data[0]));
        console.log("Sample Row:", data[0]);
    } else {
        console.log("Study Sessions table is empty or not accessible with current key.");
    }
}

inspectSchema();
