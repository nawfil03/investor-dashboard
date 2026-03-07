
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(envConfig.VITE_SUPABASE_URL, envConfig.VITE_SUPABASE_SERVICE_KEY);

async function inspectValues() {
    console.log("--- INSPECTING VALUES ---");

    // 1. Timezones
    const { data: profiles } = await supabase.from('profiles').select('timezone').limit(50);
    console.log("Profile Timezones (First 10):", profiles.slice(0, 10).map(p => p.timezone));

    // 2. Study Hours & GPA
    const { data: stats } = await supabase.from('user_stats').select('total_study_hours, average_grade_points').limit(20);
    console.log("User Stats (First 10):", stats.slice(0, 10));

    // 3. Exams
    const { data: exams } = await supabase.from('exams').select('name, score').limit(10);
    console.log("Exams (First 10):", exams);
}

inspectValues();
