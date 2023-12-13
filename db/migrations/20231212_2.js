const main = (db) => {
    const insertSql = `
        INSERT INTO accounts_group_by_currency(id, order_number, currency_id) 
        VALUES (?, ?, ?)
    `;
    const values1 = [1, 1, 1]
    const values2 = [2, 2, 2]
    const insertErrorHandler = function (err) {
        if (err) {
            return console.error(err.message);
        }
        const id = this.lastID; // get the id of the last inserted row
        console.log(`Rows inserted, ID ${id}`);
    }

    db.run(insertSql, values1, insertErrorHandler)
    db.run(insertSql, values2, insertErrorHandler)
}

module.exports = main
