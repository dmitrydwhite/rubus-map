// Update with your config settings.

module.exports = {

  development: {
    client: 'postgres',
    connection: {
      database: 'jsi_express'
    }
  },

  staging: {
    client: 'postgres',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'postgresql'
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
      tableName: 'postgresql'
    }
  }

};
