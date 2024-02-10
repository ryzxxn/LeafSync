import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import axios from 'axios';

export default function Table() {
  const [key, setKey] = useState(0);
  const isInitialMount = useRef(true);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsData, setSelectedRowsData] = useState([]);

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

  const handleCheckboxChange = (rowIndex) => {
    const updatedSelectedRows = [...selectedRows];
    if (updatedSelectedRows.includes(rowIndex)) {
      updatedSelectedRows.splice(updatedSelectedRows.indexOf(rowIndex), 1);
    } else {
      updatedSelectedRows.push(rowIndex);
    }
    setSelectedRows(updatedSelectedRows);

    // Update the array with selected rows data
    const updatedSelectedRowsData = updatedSelectedRows.map(index => tableData[index]);
    setSelectedRowsData(updatedSelectedRowsData);
  };

  const handleDeleteSelectedRows = () => {
    // Use selectedRowsData array for your DELETE logic
    console.log('Rows to delete:', selectedRowsData);
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  return (
    <div className='sql_container'>
      <h4 className='table_title'>{sessionStorage.getItem('currentTable')}</h4>
      
      <div className='pagination_container'>
        <button className='pagination_button' onClick={handleRefresh}>Refresh</button>
        <button className='pagination_button' onClick={handleFirstPage} disabled={currentPage === 1}>
          First
        </button>
        <button className='pagination_button' onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button className='pagination_button' onClick={handleNextPage} disabled={endIndex >= tableData.length}>
          Next
        </button>
        <button className='pagination_button' onClick={handleLastPage} disabled={currentPage === Math.ceil(tableData.length / rowsPerPage)}>
          Last
        </button>
      </div>

      {tableData.length > 0 && (
        <div>
          <button className='delete_button' onClick={handleDeleteSelectedRows} disabled={selectedRows.length === 0}>
            Delete Selected Rows
          </button>
          <table>
            <thead>
              <tr>
                <th>Actions</th>
                {Object.keys(tableData[0]).map(columnName => (
                  <th key={columnName}>{columnName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.slice(startIndex, endIndex).map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(index)}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </td>
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
