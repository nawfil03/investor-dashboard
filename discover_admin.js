
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
const serviceKey = envConfig.VITE_SUPABASE_SERVICE_KEY;
const supabaseUrl = envConfig.VITE_SUPABASE_URL;

const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function listTables() {
    console.log('Scanning database schema...');

    // We can try to fetch from standard tables first.
    // Since we don't have direct SQL access without a library, we'll try to discover what we can.
    // 1. Try to fetch from 'information_schema.tables' via a clever trick if enabled,
    //    or just brute force common names if that fails.
    //    Note: PostgREST usually exposes information_schema if configured, but often not.

    const potentialTables = [
        'deals', 'transactions', 'projects', 'investments', 'notifications',
        'subscriptions', 'profiles', 'users_public', 'analytics', 'logs',
        'payments', 'orders', 'products', 'categories'
    ];

    const foundTables = [];

    for (const table of potentialTables) {
        process.stdout.write(`Checking '${table}'... `);
        const { data, error } = await supabaseAdmin.from(table).select('*').limit(1);

        if (!error) {
            console.log('FOUND!');
            let columns = [];
            if (data.length > 0) {
                columns = Object.keys(data[0]);
                console.log(' -> Columns:', columns.join(', '));
            } else {
                console.log(' -> (Empty table)');
            }
            foundTables.push({ name: table, columns });
        } else {
            // console.log(error.message); // usually "relation ... does not exist"
            console.log('Not found.');
        }
    }

    // Also try to get `auth.users` schema from the first user
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
    if (users.length > 0) {
        console.log('\nAuth.Users Schema (inferred from first user):');
        console.log(Object.keys(users[0]).join(', '));
    }

    console.log('\n--- Discovery Complete ---');
    console.log('Found tables:', foundTables.map(t => t.name).join(', '));
}

listTables();
