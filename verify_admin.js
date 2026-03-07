
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
const serviceKey = envConfig.VITE_SUPABASE_SERVICE_KEY;
const supabaseUrl = envConfig.VITE_SUPABASE_URL;

if (!serviceKey) {
    console.error('Error: VITE_SUPABASE_SERVICE_KEY is missing in .env.local');
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function verifyAdmin() {
    console.log('Verifying Admin Access...');

    // 1. Try to list users (requires admin)
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
        console.error('Admin Access Failed:', error.message);
    } else {
        console.log('SUCCESS: Admin access confirmed!');
        console.log(`Found ${users.length} users.`);
        if (users.length > 0) {
            console.log('First user created at:', users[0].created_at);
        }
    }

    // 2. Try to list tables by querying information_schema directly
    // This might still be restricted by API configuration, but worth a try with admin key
    // Usually admin key bypasses RLS on tables, but information_schema is special.
    // We will just try to fetch from 'deals' again but with admin power.
}

verifyAdmin();
