import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function Query() {
  const [error, setError] = useState(null);

  const host = sessionStorage.getItem('host');
  const user = sessionStorage.getItem('user');
  const password = sessionStorage.getItem('password');
  const database = sessionStorage.getItem('currentDatabase');
  const currentTable = sessionStorage.getItem('currentTable');

  const [tableData, setTableData] = useState(null);

  const fetchData = useCallback(async () => {
    // Fetch database list
    let connectionData = {
      host,
      user,
      password,
      database,
      table: currentTable,
    };

    try {
      const response = await axios.post('http://localhost:5000/database-tables-rows', connectionData);
      setTableData(response.data);
    } catch (error) {
      console.error('Error fetching database Tables:', error);
      setError('Error fetching database Tables');
      setTableData(null);
    }
  }, [host, user, password, database, currentTable]);

  useEffect(() => {
    fetchData();
  }, [fetchData, tableData, tableData]);

  return (
    <div className='sql_container'>
      {tableData && (
        <div>
          <h4>{sessionStorage.getItem('currentTable')}</h4>
          <table>
            <thead>
              <tr>
                {Object.keys(tableData[0]).map(columnName => (
                  <th key={columnName}>{columnName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, colIndex) => (
                    <td key={colIndex}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && <div>{error}</div>}
    </div>
  );
}
