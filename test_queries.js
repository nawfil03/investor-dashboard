
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(envConfig.VITE_SUPABASE_URL, envConfig.VITE_SUPABASE_SERVICE_KEY);

async function testGrowthLogic() {
    console.log("--- Testing Growth Logic ---");
    const { data, error } = await supabase
        .from('profiles')
        .select('created_at')
        .order('created_at', { ascending: true });

    if (error) console.log("Error:", error);

    console.log("Raw Data Count:", data?.length);
    console.log("First 3 rows:", data?.slice(0, 3));

    const growthMap = {};
    let cumulative = 0;

    data?.forEach(user => {
        if (!user.created_at) return; // HANDLE NULL
        const date = new Date(user.created_at).toISOString().split('T')[0];
        growthMap[date] = (growthMap[date] || 0) + 1;
    });

    const sortedDates = Object.keys(growthMap).sort();
    const result = sortedDates.map(date => {
        cumulative += growthMap[date];
        return { date, users: cumulative, newUsers: growthMap[date] };
    });

    console.log("Result Length:", result.length);
    console.log("First 3 results:", result.slice(3));
}

async function testHeatmapLogic() {
    console.log("\n--- Testing Heatmap Logic ---");
    const { data } = await supabase
        .from('study_sessions')
        .select('actual_start')
        .not('actual_start', 'is', null)
        .limit(50);

    console.log("Session Sample:", data?.slice(0, 3));

    // Logic check
    const hourMap = new Array(24).fill(0);
    data?.forEach(session => {
        const date = new Date(session.actual_start);
        const hour = date.getHours();
        hourMap[hour]++;
    });
    console.log("Hour Map Sample:", hourMap.slice(0, 10));
}

testGrowthLogic().then(testHeatmapLogic);
