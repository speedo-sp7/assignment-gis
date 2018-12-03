let pg = require('pg');

let config = {
    user: "stanislav",
    password: null,
    database: "fiit_pdt_project",
    host: "localhost",
    port: 5432,
    max: 10,
    idleTimeoutMillis: 50000
};

let pool = new pg.Pool(config);

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1)
});

module.exports = pool;
