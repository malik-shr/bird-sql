import { Database } from 'bun:sqlite';
import type { SQLBuildResult, SQLParams } from '../utils/types';

// Helper type to track if a class has been set
type HasClass<T> = { __hasClass: true; __type: T };
type NoClass = { __hasClass: false; __type: any };

export abstract class QueryExecuter<
  TState extends HasClass<any> | NoClass = NoClass
> {
  protected abstract build(): SQLBuildResult;

  private castClass?: new (...args: any[]) => any;

  constructor(private db: Database) {}

  // Type-safe as() method that returns a new typed instance
  castTo<U>(asClass: new (...args: any[]) => U): QueryExecuter<HasClass<U>> {
    // Create a new instance with the same prototype and properties
    const newInstance = Object.create(
      Object.getPrototypeOf(this)
    ) as QueryExecuter<HasClass<U>>;

    // Copy all properties from the current instance
    Object.assign(newInstance, this);

    // Set the asClass property
    (newInstance as any).asClass = asClass;

    return newInstance;
  }

  // Method overloads for get()
  get(): TState extends HasClass<infer T> ? T : any;
  get() {
    const { sql, params } = this.build();

    if (!this.castClass) {
      return this.db.query(sql).get(params);
    }

    return this.db.query(sql).as(this.castClass).get(params);
  }

  // Method overloads for all()
  all(): TState extends HasClass<infer T> ? T[] : any[];
  all() {
    const { sql, params } = this.build();

    if (!this.castClass) {
      return this.db.query(sql).all(params);
    }

    return this.db.query(sql).as(this.castClass).all(params);
  }

  // run() doesn't need type safety as it returns execution results
  run() {
    const { sql, params } = this.build();

    if (!this.castClass) {
      return this.db.query(sql).run(params);
    }

    return this.db.query(sql).as(this.castClass).run(params);
  }

  sql(): string {
    const { sql } = this.build();
    return sql;
  }

  params(): SQLParams {
    const { params } = this.build();
    return params;
  }
}
