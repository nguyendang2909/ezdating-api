import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log(__dirname);
  //   return knex.raw(
  //     readFileSync((path.join(__dirname, './sql/countries.sql'), 'utf8')),
  //   );
}

export async function down(knex: Knex): Promise<void> {}
