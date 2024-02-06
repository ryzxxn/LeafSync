import axios from 'axios';
import React, { useState, useEffect } from 'react';

export default function Database_list() {
  const [databaseList, setDatabaseList] = useState([]);
let curDatabase = sessionStorage.getItem('currentDatabase')

  useEffect(() => {
    fetchData();
  }, [curDatabase, databaseList]);

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

  function setCurrent(database) {
    sessionStorage.setItem('currentDatabase', database);
  }

  return (
    <>
      <div className='module_container'>
        {databaseList.length > 0 ? (
          databaseList.map((databaseName, index) => (
            <p
              onClick={() => setCurrent(databaseName)}  // Wrap in an arrow function
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
