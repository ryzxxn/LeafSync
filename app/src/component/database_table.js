import axios from 'axios';
import React, { useState, useEffect } from 'react';

export default function Database_table() {
  const [databaseTable, setDatabaseList] = useState([]);
  let curTable = sessionStorage.getItem('currentTable')

  setTimeout(
  useEffect(() => {
    fetchData();
  }, [curTable, databaseTable])
  ,1000)

  async function fetchData() {
    // Fetch database list
    let connectionData = {
      host: sessionStorage.getItem('host'),
      user: sessionStorage.getItem('user'),
      password: sessionStorage.getItem('password'),
      database: sessionStorage.getItem('currentDatabase'),
    };

    try {
      const response = await axios.post('http://localhost:5000/database-tables', connectionData);
      setDatabaseList(response.data);
    } catch (error) {
      console.error('Error fetching database Tables:', error);
    }
  }

  function setCurrent(table) {
    sessionStorage.setItem('currentTable', table);
  }

  return (
    <>
      <div className='module_container'>
        {databaseTable.length > 0 ? (
          databaseTable.map((databaseName, index) => (
            <p
              onClick={() => setCurrent(databaseName)}  // Wrap in an arrow function
              className='database_list_element'
              key={index}
            >
              {databaseName}
            </p>
          ))
        ) : (
          <p className='database_list_element'>No tables found.</p>
        )}
      </div>
    </>
  );
}
