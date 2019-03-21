exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', user => {
    user.increments('id');
    user.string('name').notNullable();
    user.string('email').unique();
    user.string('password').notNullable();
    user.string('location').notNullable();
    user.string('description').notNullable();
    user.date('subscription');
    user.string('reset_token', 1000);
    user.string('gravatar', 1000);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
