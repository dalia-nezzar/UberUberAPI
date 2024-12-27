import mysql from 'mysql2/promise';

export const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Fonction pour tester périodiquement la connexion
const testConnection = async () => {
    try {
        await db.query('SELECT 1');
    } catch (error) {
        console.error('Erreur de connexion MySQL:', error);
    }
};

// Teste la connexion toutes les 5 minutes
setInterval(testConnection, 5 * 60 * 1000);

// Test initial de la connexion
testConnection().then(() => console.log('Connexion MySQL réussie')).catch(console.error);