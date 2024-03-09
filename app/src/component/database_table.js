import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';

export default function DatabaseTable() {
  const [databaseTable, setDatabaseList] = useState([]);
  const [key, setKey] = useState(0); // Added key state
  const isInitialMount = useRef(true); // Ref to track initial mount

  const currentDatabase = sessionStorage.getItem('currentDatabase');
  const curTable = sessionStorage.getItem('currentTable');

  useEffect(() => {
    // Fetch data when either currentDatabase or curTable changes
    const fetchDataWithUpdatedValues = async () => {
      try {
        const response = await axios.post('http://localhost:5000/database-tables', {
          host: sessionStorage.getItem('host'),
          user: sessionStorage.getItem('user'),
          password: sessionStorage.getItem('password'),
          database: currentDatabase,
        });
        setDatabaseList(response.data);
      } catch (error) {
        console.error('Error fetching database Tables:', error);
      }
    };

    if (!isInitialMount.current) {
      fetchDataWithUpdatedValues();
    } else {
      isInitialMount.current = false;
    }
  }, [currentDatabase, curTable, key]); // Trigger the effect when either currentDatabase, curTable, or key changes

  function setCurrent(table) {
    sessionStorage.setItem('currentTable', table);
  }

  useEffect(() => {
    // Update key when session storage changes
    const handleStorageChange = () => {
      setKey(prevKey => prevKey + 1);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    // Automatically trigger a reload after 100ms
    const reloadTimeout = setTimeout(() => {
      setKey(prevKey => prevKey + 1);
    }, 100);

    return () => {
      clearTimeout(reloadTimeout);
    };
  }, [key]); // Trigger the effect when key changes

  // Conditional rendering based on the key
  if (!sessionStorage.getItem('host')) {
    return null; // Or any other placeholder when the required session storage values are not available
  }

  return (
    <div className='module_container'>
      {databaseTable.length > 0 ? (
        databaseTable.map((databaseName, index) => (
          <p
            onClick={() => setCurrent(databaseName)}
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
  );
}
