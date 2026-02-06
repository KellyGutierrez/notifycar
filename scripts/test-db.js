const { Client } = require('pg');
const connectionString = "postgresql://notifycaruser:notifycarpass@localhost:5432/notifycar";

async function testConnection() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log("Connected successfully");
        const res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'Vehicle'");
        console.log("Columns in Vehicle table:", res.rows.map(r => r.column_name));
        await client.end();
    } catch (err) {
        console.error("Connection error", err.stack);
    }
}

testConnection();
