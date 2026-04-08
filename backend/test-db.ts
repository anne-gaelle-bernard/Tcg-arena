const pool = require('./config/db');

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error';
}

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW() AS server_time');
    console.log('Connexion PostgreSQL reussie.');
    console.log('Heure serveur:', result.rows[0].server_time);
  } catch (error: unknown) {
    console.error('Echec de connexion PostgreSQL:');
    console.error(getErrorMessage(error));
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

testConnection();

export {};
