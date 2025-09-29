// test-supabase-deep-simple.ts
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
if (!URL || !KEY) throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY');

const db = createClient(URL, KEY);

const TABLES = [
  'button_config','button_setup','connect_button','event','forms','images','internal_page',
  'inventory_items','inventory_request','inventory_request_items','invitems_tags',
  'item_category','item_tag','items_images','notification','notification_group',
  'page','role','slider_image','user_devices','user_role'
];

function shortPreview(obj: any) {
  const s = JSON.stringify(obj);
  return s.length > 120 ? s.slice(0, 117) + '...' : s;
}

async function getColumnNamesBySample(table: string): Promise<string[]> {
  const sample = await db.from(table).select('*').limit(1);
  if (!sample.error && sample.data && sample.data.length) {
    return Object.keys(sample.data[0]);
  }
  const cols = await db
    .from('information_schema.columns')
    .select('column_name')
    .eq('table_schema', 'public')
    .eq('table_name', table)
    .order('ordinal_position', { ascending: true });
  if (!cols.error && cols.data?.length) {
    return cols.data.map((c: any) => c.column_name);
  }
  return [];
}

async function detectRoleTableAndColumns() {
  const tryRole = await db.from('role').select('*').limit(1);
  if (!tryRole.error) {
    const sample = tryRole.data?.[0] ?? {};
    const idCol = 'id' in sample ? 'id' : ('role_id' in sample ? 'role_id' : null);
    const nameCol = 'name' in sample ? 'name' : ('role_name' in sample ? 'role_name' : null);
    return { table: 'role', idCol, nameCol };
  }
  const tryRoles = await db.from('roles').select('*').limit(1);
  if (!tryRoles.error) {
    const sample = tryRoles.data?.[0] ?? {};
    const idCol = 'id' in sample ? 'id' : ('role_id' in sample ? 'role_id' : null);
    const nameCol = 'name' in sample ? 'name' : ('role_name' in sample ? 'role_name' : null);
    return { table: 'roles', idCol, nameCol };
  }
  return { table: null as string | null, idCol: null as string | null, nameCol: null as string | null };
}

(async () => {
  // REST ping
  const rest = await fetch(`${URL}/rest/v1/inventory_items?select=inventory_item_id&limit=1`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }
  });
  let sampleId: any = null;
  try { sampleId = (await rest.json())?.[0]?.inventory_item_id ?? null; } catch {}
  console.log(`REST: status=${rest.status} sampleId=${sampleId}`);

  // Auth ping
  const { data: sess, error: authErr } = await db.auth.getSession();
  console.log(`AUTH: session=${!!sess?.session}${authErr ? ` error=${authErr.message}` : ''}`);

  // Table checks
  console.log('\nTABLE CHECKS');
  for (const t of TABLES) {
    const { count, error } = await db.from(t).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`${t}: ERROR - ${error.message}`);
      console.log(); 
      continue;
    }

    const cols = await getColumnNamesBySample(t);
    const colsOut = cols.length ? cols.join(', ') : '(unknown; empty table)';
    console.log(`${t}: rows=${count ?? 0}  cols=[${colsOut}]`);

    if ((count ?? 0) > 0) {
      const sample = await db.from(t).select('*').limit(3);
      if (!sample.error && sample.data && sample.data.length) {
        console.log(`  sample(1): ${shortPreview(sample.data[0])}`);
      } else if (sample.error) {
        console.log(`  sample(1): ERROR - ${sample.error.message}`);
      }
    }
    console.log(); 
  }

  // Roles
  console.log('ROLES (connections via user_role)');
  const meta = await detectRoleTableAndColumns();
  if (!meta.table || !meta.idCol) {
    console.log('role read error: no role table or id column detected (looked for role/roles).');
    return;
  }
  const roleSelCols = [meta.idCol, meta.nameCol].filter(Boolean).join(',');
  const roles = await db.from(meta.table).select(roleSelCols).order(meta.idCol as string, { ascending: true });
  if (roles.error) {
    console.log(`role read error: ${roles.error.message}`);
    return;
  }

  for (const r of roles.data as Array<Record<string, any>>) {
    const roleId = r[meta.idCol as string];
    const roleName = meta.nameCol ? r[meta.nameCol] : null;
    const { count, error } = await db
      .from('user_role')
      .select('*', { count: 'exact', head: true })
      .eq('role_id', roleId);
    console.log(`${roleName ?? '(null)'} [${roleId}]: ${error ? `ERROR - ${error.message}` : (count ?? 0)}`);
  }
})().catch(e => console.error('Unexpected error:', e.message));

//Run test via: npx -y tsx -r dotenv/config scripts/test-supabase-connection.ts