require('dotenv').config()
module.exports = {
  "development": {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,  // Default to port 5432 if not set
    dialect: 'postgres',
    logging: false
  },
  "test": {
    username: process.env.DB_USERNAME_TEST,
    password: process.env.DB_PASSWORD_TEST,
    database: process.env.DB_NAME_TEST,
    host: process.env.DB_HOST_TEST,
    port: process.env.DB_PORT_TEST || 5432,  // Default to port 5432 if not set
    dialect: 'postgres',
    logging: false
  },
  "production": {
    username: process.env.DB_USERNAME_PROD,
    password: process.env.DB_PASSWORD_PROD,
    database: process.env.DB_NAME_PROD,
    host: process.env.DB_HOST_PROD,
    port: process.env.DB_PORT_PROD || 5432,  // Default to port 5432 if not set
    dialect: 'postgres',
    logging: true
  }
}