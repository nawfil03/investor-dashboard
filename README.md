# 📈 Aqademiq Investor Dashboard (v1)

The first version of an **investor dashboard for Aqademiq**, connected to the Aqademiq **Supabase** database. It includes a React + Vite front-end setup and a set of Node.js scripts used to discover the database schema, audit data quality and verify the investor metrics.

> ℹ️ A newer, rebuilt version lives in **[investor-dashboard-new](https://github.com/nawfil03/investor-dashboard-new)**.

---

## 🛠️ Tech stack

React · Vite · Tailwind CSS · Recharts · Framer Motion · Supabase JS · Node.js

## 🗂️ What's in this repo

| Files | Purpose |
|---|---|
| `index.html`, `vite.config.js`, `package.json` | React + Vite app setup |
| `list_tables.js`, `inspect_schema.js`, `discover_admin.js`, `run_discovery.js`, `discover_schema.sql` | Explore the Supabase schema |
| `audit_*.js`, `deep_scan.js`, `debug_*.js` | Audit and debug data quality |
| `check_*.js`, `verify_*.js`, `test_queries.js` | Verify connection, tables and queries |
| `analyze_real_data.js`, `check_investor_data.js` | Compute / sanity-check investor metrics |
| `supabase_rpc.sql`, `check_tables.sql` | SQL helpers / RPC functions |
| `*.log`, `*_results.txt` | Saved output from audit runs |

## 🚀 How to use

Requires **Node.js 18+** and access to a Supabase project.

**1. Install**

```bash
git clone https://github.com/nawfil03/investor-dashboard.git
cd investor-dashboard
npm install
```

**2. Configure Supabase** – create a `.env.local` file:

```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_SUPABASE_SERVICE_KEY=<your-service-role-key>   # only for local scripts
```

**3. Run the data scripts** (examples)

```bash
node verify_connection.js     # check the database connection
node list_tables.js           # list available tables
node audit_all_tables.js      # run a full data audit
node check_investor_data.js   # check the investor metrics
```

**4. Run the front-end**

```bash
npm run dev
```

> Note: the React `src/` folder is not included in this repository, so the dev server needs the app source added before it renders the dashboard.

## 🔐 Security

Never commit real keys. Keep `.env.local` out of Git and never expose the Supabase **service role** key in front-end code.

---

👤 **Nawfil Faraaz** · [GitHub](https://github.com/nawfil03)
