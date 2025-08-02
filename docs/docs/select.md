## Initialize

```typescript
import { Database } from 'bun:sqlite';
import { QueryBuilder } from 'bird-sql';

const db = new Database(':memory:');
const bb = new QueryBuilder(db);
```

## Simple select

```typescript
bb.select('id').from('users');
```

## Select with sql functions

```typescript
import { COUNT, SUM, MIN, MAX, AVG, UPPER, LOWER, LENGTH } from 'bird-sql';

bb.select(COUNT('age'), 'id').from('users');
```

## Select with Subquery

```typescript
const subquery = bb.select('id').from('verifiedUsers');

bb.select(subquery.as('subquery'), 'username').from('users');
```
