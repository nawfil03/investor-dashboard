
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env.local manually since we are running in node
const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.VITE_SUPABASE_URL;
const serviceKey = envConfig.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !serviceKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function inspectData() {
    console.log("--- Diagnosing Data Vacancy ---");

    // 1. Check Profiles (User Growth)
    const { count: profileCount, error: profileError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

    if (profileError) console.error("Profile Error:", profileError.message);
    console.log(`Total Profiles: ${profileCount}`);

    // 2. Check Study Sessions (Engagement, Heatmap, Deep Work)
    const { data: sessions, error: sessionError } = await supabase
        .from('study_sessions')
        .select('id, created_at, actual_start, actual_duration, focus_score')
        .limit(5);

    const { count: sessionCount } = await supabase
        .from('study_sessions')
        .select('*', { count: 'exact', head: true });

    if (sessionError) console.error("Session Error:", sessionError.message);
    console.log(`Total Sessions: ${sessionCount}`);
    console.log("Sample Sessions:", sessions);

    // 3. Check Courses (Subjects)
    const { count: courseCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });
    console.log(`Total Courses: ${courseCount}`);

    console.log("-------------------------------");
}

inspectData();
