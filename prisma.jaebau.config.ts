import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

type Env = {
  DATABASE_URL: string;
};

export default defineConfig({
  schema: 'prisma/db.schema.prisma',
  migrations: {
    path: 'prisma/migrations/db',
  },
  datasource: {
    url: env<Env>('DATABASE_URL'),
  },
});
