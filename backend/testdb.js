const mysql = require('mysql2/promise')

async function test() {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'roys_hotel'
    })

    const conn = await pool.getConnection()

    console.log("SUCCESS")

    conn.release()
    process.exit()
}

test().catch(console.error)