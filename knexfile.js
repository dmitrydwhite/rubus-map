// Update with your config settings.

module.exports = {

  development: {
    client: 'postgres',
    connection: {
      database: 'rubus'
    }
  },

  production: {
    client: 'postgres',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'postresql'
    }
  }

};
