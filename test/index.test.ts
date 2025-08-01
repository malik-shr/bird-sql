import { describe, it, expect } from 'bun:test';
import { QueryBuilder, ref } from '../src';
import { Database } from 'bun:sqlite';
import { MAX } from '../src/utils/sqlFunctions';

describe('should', () => {
  const db = new Database(':memory:');
  const bb = new QueryBuilder(db);

  it('Select', () => {
    const statement = bb
      .select(MAX('id').as('YEAH'))
      .from('data')
      .where(['name', '=', ref('data.name')])
      .sql();
    const expected =
      'SELECT MAX("id") AS "YEAH" FROM "data" WHERE "name" = "data"."name"';

    expect(statement).toBe(expected);
  });
  it('Insert and Select', () => {
    bb.raw(
      'CREATE TABLE users(id TEXT PRIMARY KEY NOT NULL, username TEXT UNIQUE NOT NULL, email TEXT NOT NULL)'
    ).run();

    class User {
      id!: string;
      username!: string;
      email!: string;
    }

    const stmt1 = bb
      .insertInto('users')
      .values({ id: '1', username: 'bird', email: 'bird@email.com' });

    stmt1.run();

    const stmt2 = bb
      .select('id', 'username', 'email')
      .from('users')
      .castTo(User);
    const result = stmt2.get();

    expect(result.id).toBe('1');
  });
  it('Select Subquery', () => {
    const QueryWithsubquery = bb
      .select(
        bb.select('id').from('users').where(['id', '=', '123']).as('subquery'),
        MAX('id').as('max_id')
      )
      .from('users')
      .where(['id', '=', '3'])
      .sql();

    const expected =
      'SELECT (SELECT "id" FROM "users" WHERE "id" = $1) AS "subquery", MAX("id") AS "max_id" FROM "users" WHERE "id" = $2';

    expect(QueryWithsubquery).toBe(expected);
  });
  it('Where Subquery', () => {
    const QueryWithsubquery = bb
      .select(
        'id',
        bb.select('name').from('users').where(['id', '=', '13']).as('subquery')
      )
      .from('users')
      .where([bb.select('name').from('users'), '=', '0'], ['age', '>', 18])
      .sql();

    const expected =
      'SELECT "id", (SELECT "name" FROM "users" WHERE "id" = $1) AS "subquery" FROM "users" WHERE (SELECT "name" FROM "users") = $2 AND "age" > $3';

    expect(QueryWithsubquery).toBe(expected);
  });
  it('Like', () => {
    const likeQuery = bb
      .select()
      .from('users')
      .where(['users.id', 'LIKE', '%pattern'])
      .sql();

    const expected = `SELECT * FROM "users" WHERE "users"."id" LIKE '%pattern'`;

    expect(likeQuery).toBe(expected);
  });
  it('IS NULL', () => {
    const notNullQuery = bb
      .select()
      .from('users')
      .where(['users.id', 'IS NOT NULL'])
      .sql();

    const expected = `SELECT * FROM "users" WHERE "users"."id" IS NOT NULL`;

    expect(notNullQuery).toBe(expected);
  });
  it('IN', () => {
    const notNullQuery = bb
      .select()
      .from('users')
      .where(['users.id', 'IN', ['1', '2', '3']])
      .sql();

    const expected = `SELECT * FROM "users" WHERE "users"."id" IN ($0, $1, $2)`;

    expect(notNullQuery).toBe(expected);
  });

  it('Delete', () => {
    const deleteStmt = bb.deleteFrom('users').where(['id', '=', '1']);
    deleteStmt.run();

    const getStmt = bb.select().from('users');
    const result = getStmt.all();

    expect(result?.length).toBe(1);
  });
});
