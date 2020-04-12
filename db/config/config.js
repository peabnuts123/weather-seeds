module.exports = {
  [process.env.NODE_ENV]: {
    "username": process.env['POSTGRES_USER'],
    "password": process.env['POSTGRES_PASSWORD'],
    "database": process.env['POSTGRES_DB'],
    "host": 'localhost',
    "dialect": "postgres"
  },
}
