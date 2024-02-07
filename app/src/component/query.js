import React, { useState } from 'react';
import axios from 'axios';

export default function Query() {
  const [queryResult, setQueryResult] = useState(null);
  const [error, setError] = useState(null);

  let host = sessionStorage.getItem('host');
  let user = sessionStorage.getItem('user');
  let password = sessionStorage.getItem('password');
  let table = sessionStorage.getItem('currentTable');
  let database = sessionStorage.getItem('currentDatabase');
  let query = null;

  function captureQuery(event) {
    query = event.target.value;
  }

  function runQuery() {
    let QueryData = {
      host,
      user,
      password,
      database,
      query,
    };

    axios.post('http://localhost:5000/database-query', QueryData)
      .then(response => {
        setQueryResult(response.data);
        setError(null);
      })
      .catch(error => {
        setError('Error executing the query');
        setQueryResult(null);
      });
  }

  return (
    <div className='sql_container'>
      <div>
        <p id='server_user'>{user + "@" + host + "://" + database}</p>
        <textarea onChange={captureQuery} className='sql_query_box' placeholder='Type Query here'></textarea>
      </div>

      <div>
        <button onClick={runQuery}>Go</button>
      </div>

      {queryResult && (
        <div>
          <h4>Output</h4>
          <table>
            <thead>
              <tr>
                {/* Assuming the response is an array of objects with keys as column names */}
                {Object.keys(queryResult[0]).map(columnName => (
                  <th key={columnName}>{columnName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queryResult.map((row, index) => (
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
