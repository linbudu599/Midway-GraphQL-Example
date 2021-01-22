import * as path from 'path';
import { IMidwayWebNext } from '@midwayjs/web';

import { Context } from 'egg';

import { ApolloServer, ServerRegistration } from 'apollo-server-koa';
import { buildSchemaSync } from 'type-graphql';

export default (options: ServerRegistration) => {
  return async function graphql(ctx: Context, next: IMidwayWebNext) {
    await next();
    const server = new ApolloServer({
      schema: buildSchemaSync({
        resolvers: [path.resolve(ctx.app.baseDir, 'resolver/*.ts')],
        container: ctx.app.applicationContext,
      }),
    });
    ctx.app.use(server.getMiddleware(options));
  };
};
