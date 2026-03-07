
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(envConfig.VITE_SUPABASE_URL, envConfig.VITE_SUPABASE_SERVICE_KEY);

async function auditData() {
    console.log("--- DATA QUALITY AUDIT ---");

    // 1. Profiles (Growth Chart)
    const { count: totalProfiles } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { data: profiles, error: pErr } = await supabase.from('profiles').select('created_at').limit(50);

    const validDates = profiles?.filter(p => p.created_at).length || 0;
    console.log(`Profiles: ${totalProfiles} total.`);
    console.log(`Sample valid created_at: ${validDates}/50`);
    if (profiles && profiles.length > 0) console.log("Sample Date:", profiles[0].created_at);

    // 2. Sessions (Heatmap & Activity)
    const { count: totalSessions } = await supabase.from('study_sessions').select('*', { count: 'exact', head: true });
    const { data: sessions, error: sErr } = await supabase.from('study_sessions').select('actual_start, actual_duration').limit(50);

    const validStarts = sessions?.filter(s => s.actual_start).length || 0;
    console.log(`\nSessions: ${totalSessions} total.`);
    console.log(`Sample valid actual_start: ${validStarts}/50`);
    if (sessions && sessions.length > 0) console.log("Sample Start:", sessions[0].actual_start);

    // 3. Courses (Pie Chart)
    const { count: totalCourses } = await supabase.from('courses').select('*', { count: 'exact', head: true });
    const { data: sessionCourses } = await supabase.from('study_sessions').select('course_id').not('course_id', 'is', null).limit(50);

    console.log(`\nCourses: ${totalCourses} total.`);
    console.log(`Sessions with course_id: ${sessionCourses?.length}/50`);

    console.log("--------------------------");
}

auditData();
