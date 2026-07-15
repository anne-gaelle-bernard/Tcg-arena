import pool from './config/db';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error';
}

async function checkPrivileges() {
  const sql = `
    SELECT
      current_user,
      current_database(),
      has_database_privilege(current_user, current_database(), 'CREATE') AS can_create_db,
      has_schema_privilege(current_user, 'public', 'USAGE') AS public_usage,
      has_schema_privilege(current_user, 'public', 'CREATE') AS public_create
  `;

  const aclSql = `
    SELECT
      n.nspname,
      pg_get_userbyid(n.nspowner) AS schema_owner,
      n.nspacl
    FROM pg_namespace n
    WHERE n.nspname = 'public'
  `;

  const dbOwnerSql = `
    SELECT datname, pg_get_userbyid(datdba) AS db_owner
    FROM pg_database
    WHERE datname = current_database()
  `;

  try {
    const result = await pool.query(sql);
    const aclResult = await pool.query(aclSql);
    const dbOwnerResult = await pool.query(dbOwnerSql);
    console.log(result.rows[0]);
    console.log(dbOwnerResult.rows[0]);
    console.log(aclResult.rows[0]);
  } catch (error: unknown) {
    console.error(getErrorMessage(error));
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

checkPrivileges();

export {};
