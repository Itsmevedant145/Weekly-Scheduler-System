export async function up(knex) {
  await knex.schema.createTable('recurring_slots', (table) => {
    table.increments('id').primary();
    table.integer('day_of_week').notNullable(); // 0=Sunday ... 6=Saturday
    table.time('start_time').notNullable();
    table.time('end_time').notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable('slot_exceptions', (table) => {
    table.increments('id').primary();
    table.integer('recurring_slot_id').unsigned().references('id').inTable('recurring_slots').onDelete('CASCADE');
    table.date('date').notNullable();
    table.time('start_time').nullable();
    table.time('end_time').nullable();
    table.boolean('is_deleted').defaultTo(false);
    table.timestamps(true, true);
    table.unique(['recurring_slot_id', 'date']);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('slot_exceptions');
  await knex.schema.dropTableIfExists('recurring_slots');
}
