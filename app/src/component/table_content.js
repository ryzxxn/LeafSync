import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import axios from 'axios';

export default function Table() {
  const [key, setKey] = useState(0);
  const isInitialMount = useRef(true);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  const host = sessionStorage.getItem('host');
  const user = sessionStorage.getItem('user');
  const password = sessionStorage.getItem('password');
  const currentDatabase = sessionStorage.getItem('currentDatabase');
  const currentTable = sessionStorage.getItem('currentTable');

  const connectionData = useMemo(() => ({
    host,
    user,
    password,
    database: currentDatabase,
    table: currentTable,
  }), [host, user, password, currentDatabase, currentTable]);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.post('http://localhost:5000/database-tables-rows', connectionData);
      setTableData(response.data);
    } catch (error) {
      console.error('Error fetching database Tables:', error);
      setTableData([]);
    }
  }, [connectionData]);

  const fetchDataWithDelay = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // Add a delay of 100ms
      fetchData();
    } catch (error) {
      console.error('Error fetching database Tables:', error);
    }
  }, [fetchData]);

  useEffect(() => {
    if (!isInitialMount.current) {
      fetchDataWithDelay();
    } else {
      isInitialMount.current = false;
    }
  }, [currentDatabase, currentTable, key, fetchDataWithDelay]);

  useEffect(() => {
    const handleStorageChange = () => {
      setKey(prevKey => prevKey + 1);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleRefresh = () => {
    setKey(prevKey => prevKey + 1);
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(Math.ceil(tableData.length / rowsPerPage));
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  return (
    <div className='sql_container'>
      <h4 className='table_title'>{sessionStorage.getItem('currentTable')}</h4>
      
      <div className='pagnition_container'>
        <button className='pagnition_button' onClick={handleRefresh}>Refresh</button>
        <button className='pagnition_button' onClick={handleFirstPage} disabled={currentPage === 1}>
          First
        </button>
        <button className='pagnition_button' onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button className='pagnition_button' onClick={handleNextPage} disabled={endIndex >= tableData.length}>
          Next
        </button>
        <button className='pagnition_button' onClick={handleLastPage} disabled={currentPage === Math.ceil(tableData.length / rowsPerPage)}>
          Last
        </button>
      </div>

      {tableData.length > 0 && (
        <div>
          <table>
            <thead>
              <tr>
                {Object.keys(tableData[0]).map(columnName => (
                  <th key={columnName}>{columnName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.slice(startIndex, endIndex).map((row, index) => (
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
    </div>
  );
}
