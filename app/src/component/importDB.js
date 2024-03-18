import React, { useState } from 'react';
import axios from 'axios';

export default function ImportDB() {
    const [file, setFile] = useState(null);
    const [query, setQuery] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const host = sessionStorage.getItem('host');
    const user = sessionStorage.getItem('user');
    const password = sessionStorage.getItem('password');
    const database = sessionStorage.getItem('currentDatabase');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (!file) {
            alert('Please select a file.');
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            const fileContent = event.target.result;
            console.log(fileContent);
            setQuery(fileContent);
        };

        reader.readAsText(file);
    };

    const uploadToServer = () => {
        if (!host || !user || !database || !query) {
            setErrorMessage('Missing parameters for database import.');
            return;
        }

        const queryData = {
            host,
            user,
            password,
            database,
            Query: query,
        };

        axios.post('http://localhost:5000/database-import', queryData)
            .then(response => {
                setSuccessMessage(response.data.message);
                setErrorMessage(null);
            })
            .catch(error => {
                if (error.response) {
                    setErrorMessage(error.response.data);
                } else if (error.request) {
                    setErrorMessage('No response received from server.');
                } else {
                    setErrorMessage('Error processing request.');
                }
                setSuccessMessage(null);
            });
    };

    return (
        <div>
            <h1>Import Database</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <button onClick={uploadToServer}>Import Database</button>
            {errorMessage && <p>Error: {errorMessage}</p>}
            {successMessage && <p>{successMessage}</p>}
        </div>
    );
}
