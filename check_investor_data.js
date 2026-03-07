
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(envConfig.VITE_SUPABASE_URL, envConfig.VITE_SUPABASE_SERVICE_KEY);

async function checkFancyMetrics() {
    console.log("--- CHECKING INVESTOR METRICS ---");

    // 1. Check Timezones (Global Reach)
    const { data: timezones, error: tzError } = await supabase
        .from('profiles')
        .select('timezone');

    if (timezones) {
        const tzCounts = {};
        timezones.forEach(row => {
            const tz = row.timezone || 'Unknown';
            tzCounts[tz] = (tzCounts[tz] || 0) + 1;
        });
        console.log("\nTimezone Distribution:", tzCounts);
    }

    // 2. Check Hours vs GPA (Efficacy Correlation)
    const { data: correlation, error: corrError } = await supabase
        .from('user_stats')
        .select('total_study_hours, average_grade_points')
        .not('average_grade_points', 'is', null);

    if (correlation) {
        console.log("\nCorrelation Data Points:", correlation.length);
        console.log("Sample (Hours -> GPA):", correlation.slice(0, 5).map(c => `${c.total_study_hours}h -> ${c.average_grade_points}`));
    }
}

checkFancyMetrics();
