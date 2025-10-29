const pool = require('./db');

const createTable =async (schema) => {
    try{
        const [results] = await pool.query(schema);
        return results;
    }catch(err){
        throw err;
    }
};

const checkRecordExists = async (tableName,column,value)=>{
    try{
        const [results] = await pool.query(
            `SELECT * FROM ${tableName} WHERE ${column} = ?`,
            [value]
        );
        return results.length ? results[0] : null;
    }catch(err){
        throw err;
    }
}

const insertRecord = async (tableName,record) => {
    try{
        const [results] = await pool.query(
            `INSERT INTO ${tableName} SET ?`,
            record
        );
        return results;
    }catch(err){
        throw err;
    }
}

module.exports = {
    createTable,
    checkRecordExists,
    insertRecord
}