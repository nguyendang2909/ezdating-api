import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  //   return knex.raw(
  //     readFileSync((path.join(__dirname, './sql/states.sql'), 'utf8')),
  //   );
}

export async function down(knex: Knex): Promise<void> {}
