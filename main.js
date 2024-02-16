const { app, BrowserWindow } = require('electron');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql')

app.whenReady().then(() => {
    //Create a window
    const mainWindow = new BrowserWindow({
            autoHideMenuBar: true,
            width: 1280,
            height: 720,
            minWidth: 1280,
            minHeight: 720,
            icon: 'logo.ico',
            webPreferences:{
                nodeIntegration: true
            }
        });
        // mainWindow.webContents.openDevTools();
        mainWindow.loadFile('./app/build/index.html');
        // mainWindow.loadURL('http://localhost:3000');
})

const api = express();
const port = 5000

api.use(cors());
api.use(bodyParser.json());


//middleware
api.use(cors());
api.use(bodyParser.json());

api.post('/connect', (req, res) => {

    let {host, user, password} = req.body
    // console.log(host);
    // console.log(user);
    // console.log(password);

// try connection with details recived
    const connection = mysql.createConnection({
        host,
        user,
        password,
    })

    connection.connect()
    connection.query('SHOW DATABASES', function(error, result, fields){
        if (error) {
            res.send('false')
        }
        else{
            res.send('true')
        }
    })
})


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

        // console.log(tables);
        res.send(tables);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


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

        const showTableRowsQuery = 'SELECT * FROM'+' '+table;
        const tableRows = await new Promise((resolve, reject) => {
            connection.connect();
            connection.query(showTableRowsQuery, (error, result, fields) => {
                if (error) {
                    console.error(error);
                    reject('Error retrieving rows from the table');
                } else {
                    // Get field names from the table structure
                    const fieldNames = fields.map(field => field.name);

                    // Mapping result rows to objects with dynamic field names
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
                    reject('Error retrieving tables from the database');
                } else {
                    resolve(result);
                }
                connection.end();
            });
        });

        // console.log(tables);
        res.send(tables);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



// Start the server
api.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });