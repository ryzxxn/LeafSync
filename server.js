const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const api = express();
const port = 5000;

// Middleware
api.use(cors());
api.use(bodyParser.json());
api.use(express.json());

// Route to connect to MySQL database
api.post('/connect', (req, res) => {
    let { host, user, password } = req.body;

    const connection = mysql.createConnection({
        host,
        user,
        password,
    });

    connection.connect();
    connection.query('SHOW DATABASES', function (error, result, fields) {
        if (error) {
            res.send('false');
        } else {
            res.send('true');
        }
        connection.end();
    });
});

// Route to fetch list of databases
api.post('/database-list', (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    let { host, user, password } = req.body;
    const connection = mysql.createConnection({
        host,
        user,
        password,
    });

    connection.connect();
    let showDatabasesQuery = 'SHOW DATABASES';
    let ignoredDatabases = ['performance_schema', 'mysql', 'information_schema', 'phpmyadmin', 'test'];
    let RESULT = [];

    connection.query(showDatabasesQuery, function (error, result, fields) {
        if (error) {
            console.log(error);
            res.status(500).send('Error retrieving databases from the server');
        } else {
            result.forEach(row => {
                let databaseName = row.Database;
                if (!ignoredDatabases.includes(databaseName)) {
                    RESULT.push(databaseName);
                }
            });
            res.send(RESULT);
        }
        connection.end();
    });
});

// Route to fetch tables of a database
api.post('/database-tables', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    try {
        const { host, user, password, database } = req.body;
        const connection = mysql.createConnection({
            host,
            user,
            password,
            database,
        });

        const showTablesQuery = 'SHOW TABLES';
        const tables = await new Promise((resolve, reject) => {
            connection.connect();
            connection.query(showTablesQuery, (error, result, fields) => {
                if (error) {
                    console.error(error);
                    reject('Error retrieving tables from the database');
                } else {
                    const tableNames = result.map(row => row[Object.keys(row)[0]]);
                    resolve(tableNames);
                }
                connection.end();
            });
        });

        res.send(tables);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to fetch rows of a table
api.post('/database-tables-rows', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    try {
        const { host, user, password, database, table } = req.body;
        const connection = mysql.createConnection({
            host,
            user,
            password,
            database,
        });

        const showTableRowsQuery = `SELECT * FROM ${table}`;
        const tableRows = await new Promise((resolve, reject) => {
            connection.connect();
            connection.query(showTableRowsQuery, (error, result, fields) => {
                if (error) {
                    console.error(error);
                    reject('Error retrieving rows from the table');
                } else {
                    const fieldNames = fields.map(field => field.name);
                    const formattedRows = result.map(row => {
                        const formattedRow = {};
                        fieldNames.forEach(fieldName => {
                            formattedRow[fieldName] = row[fieldName];
                        });
                        return formattedRow;
                    });
                    resolve(formattedRows);
                }
                connection.end();
            });
        });

        res.send(tableRows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to execute custom SQL query
api.post('/database-query', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    try {
        const { host, user, password, database, query } = req.body;
        const connection = mysql.createConnection({
            host,
            user,
            password,
            database
        });

        const tables = await new Promise((resolve, reject) => {
            connection.connect();
            connection.query(query, (error, result, fields) => {
                if (error) {
                    console.error(error);
                    reject('Error executing query on the database');
                } else {
                    resolve(result);
                }
                connection.end();
            });
        });

        res.send(tables);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



api.post('/database-import', (req, res) => {
    // Ensure that the necessary parameters are provided in the request body
    const { host, user, password, database, Query } = req.body;
    if (!host || !user || !database || !Query) {
        return res.status(400).send('Missing parameters for database import.');
    }

    // Create a MySQL connection
    const connection = mysql.createConnection({
        host,
        user,
        password,
        database
    });

    // Connect to the database
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL server:', err);
            return res.status(500).send('Error connecting to MySQL server.');
        }

        // Split the SQL query into individual statements
        const statements = Query.split(';');

        // Execute each statement individually
        statements.forEach((statement) => {
            // Execute only non-empty statements
            if (statement.trim() !== '') {
                connection.query(statement.trim(), (error, result) => {
                    if (error) {
                        console.error('Error executing SQL statement:', error);
                        res.status(500).send('Error executing SQL statement.');
                    }
                });
            }
        });

        // Database import successful
        res.status(200).send('Database imported successfully.');

        // Close the database connection
        connection.end();
    });
});



// Start the server
api.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
