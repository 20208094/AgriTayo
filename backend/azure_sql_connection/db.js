const sql = require('mssql');

const config = {
    user: process.env.DB_USER || 'agritayo',
    password: process.env.DB_PASSWORD || 'Irregular4',
    server: process.env.DB_SERVER || 'agritayo.database.windows.net',
    database: process.env.DB_NAME || 'AgriTayo',
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to Azure SQL Database');
        return pool;
    })
    .catch(err => {
        console.error('Database Connection Failed! Bad Config: ', err);
        throw err;
    });

module.exports = poolPromise;
