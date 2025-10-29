const userSchema = `
    CREATE TABLE IF NOT EXISTS user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255)
);
`;

module.exports = userSchema;