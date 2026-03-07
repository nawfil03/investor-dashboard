
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://trjvrhscidqmnnpopkiv.supabase.co';
const serviceKey = process.env.VITE_SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyanZyaHNjaWRxbW5ucG9wa2l2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODQ2NjQwOSwiZXhwIjoyMDU0MDQyNDA5fQ.2T7N_yXwXjC6t5yN_k8tXjC6t5yN_k8tXjC6t5yN_k8'; // Fallback if env not set for script

const supabase = createClient(supabaseUrl, serviceKey);

async function analyzeData() {
    console.log("--- Analyzing Real Application Data ---");

    // 1. User Count (Total Addressable Market in App)
    const { count: users } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    console.log(`Total Users: ${users}`);

    // 2. Event Volume (Row Counts)
    const tables = ['study_sessions', 'goals', 'notes', 'courses', 'exams', 'tasks'];
    const counts = {};
    for (const t of tables) {
        const { count } = await supabase.from(t).select('*', { count: 'exact', head: true });
        counts[t] = count || 0;
        console.log(`Table '${t}': ${count} rows`);
    }

    // 3. Quality Metrics (Focus Score Analysis)
    const { data: sessions } = await supabase.from('study_sessions').select('focus_score, actual_duration').not('focus_score', 'is', null).limit(500);
    if (sessions && sessions.length > 0) {
        const avgScore = sessions.reduce((acc, s) => acc + s.focus_score, 0) / sessions.length;
        console.log(`Avg Focus Score: ${avgScore.toFixed(2)}`);

        const deepWork = sessions.filter(s => s.focus_score > 75).length;
        console.log(`Deep Work Ratio: ${((deepWork / sessions.length) * 100).toFixed(1)}%`);
    } else {
        console.log("No focus score data found.");
    }

    // 4. Retention / Cohorts (Created At)
    const { data: usersData } = await supabase.from('profiles').select('created_at').order('created_at', { ascending: true });

    // Quick Cohort Check
    // ... logic to group by month ...
    console.log("Data analysis complete.");
}

analyzeData();
