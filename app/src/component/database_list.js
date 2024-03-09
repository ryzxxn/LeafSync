import axios from 'axios';
import React, { useState, useEffect } from 'react';

export default function Database_list() {
  const [databaseList, setDatabaseList] = useState([]);
  let curDatabase = sessionStorage.getItem('currentDatabase');
  let tables = null

  useEffect(() => {
    fetchData();
  }, [curDatabase, tables]);

  async function fetchData() {
    // Fetch database list
    let connectionData = {
      host: sessionStorage.getItem('host'),
      user: sessionStorage.getItem('user'),
      password: sessionStorage.getItem('password'),
      database: sessionStorage.getItem('currentDatabase'),
    };

    try {
      const response = await axios.post('http://localhost:5000/database-list', connectionData);
      setDatabaseList(response.data);
    } catch (error) {
      console.error('Error fetching database list:', error);
    }
  }

  async function setCurrent(database) {
    sessionStorage.setItem('currentDatabase', database);

    // Fetch tables for the current database
    try {
      const response = await axios.post('http://localhost:5000/database-tables', {
        host: sessionStorage.getItem('host'),
        user: sessionStorage.getItem('user'),
        password: sessionStorage.getItem('password'),
        database: database,
      });

      tables = response.data;
      // console.log(tables[0]);
      sessionStorage.setItem('currentTable', tables[0]);
    } catch (error) {
      console.error('', error);
    }
  }

  return (
    <>
      <div className='module_container'>
        {databaseList.length > 0 ? (
          databaseList.map((databaseName, index) => (
            <p
              onClick={() => setCurrent(databaseName)}
              className='database_list_element'
              key={index}
            >
              {databaseName}
            </p>
          ))
        ) : (
          <p className='database_list_element'>No databases found.</p>
        )}
      </div>
    </>
  );
}
