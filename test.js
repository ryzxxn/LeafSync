const idsToDelete = [1, 2, 3];
let placeholders = '';

// Create a placeholder string for the IDs
for (let index = 0; index < idsToDelete.length; index++) {
    placeholders += idsToDelete[index];

    // Add a comma if it's not the last element
    if (index < idsToDelete.length - 1) {
        placeholders += ',';
    }
}

// SQL query to delete rows with matching IDs
const sql = `DELETE FROM your_table WHERE id IN (${placeholders})`;
console.log(sql);
