# Where

## Simple Where

```typescript
const query = bb.select().from('users').where(['age', '>=', 18]);
```

## Column Reference

```typescript
import { ref, whereRef } from 'bird-sql';

const query = bb
  .select()
  .from('users')
  .where(['age', '>=', ref('verified_users.age')]);

//Alternative
const query = bb
  .select()
  .from('users')
  .where(whereRef('age', '>=', 'verified_users.age'));
```

## Null condition

```typescript
const query = bb.select().from('users').where(['age', 'IS NOT NULL']);
```

## Where In

```typescript
const query = bb
  .select()
  .from('users')
  .where(['id', 'IN', ['uniqueId1', 'uniqueId2', 'uniqueId3']]);
```

## Subquery Condition

```typescript
const query = bb
  .select(
    'id',
    bb.select('name').from('users').where(['id', '=', '13']).as('subquery')
  )
  .from('users')
  .where([bb.select('name').from('users'), '=', 'Anton']);
```

## Nested Conditions

```typescript
const query = bb
  .select(
    'id',
    bb.select('name').from('users').where(['id', '=', '13']).as('subquery')
  )
  .from('users')
  .where(or(['name', '=', 'Anton'], ['age', '>=', 18]));
```
