import * as path from 'path';
import { Provide, Config } from '@midwayjs/decorator';
import { IMidwayWebNext, IWebMiddleware } from '@midwayjs/web';

import { Context } from 'egg';

import { ApolloServer, ServerRegistration } from 'apollo-server-koa';
import { buildSchemaSync } from 'type-graphql';

type Test = { [key: string]: any } & ServerRegistration;

// 这个命名受到大小写/驼峰的影响， 最好是provide时显式指定token...
// 需要在中间件内部手动调用app.use

@Provide()
export class GraphqlMiddleware implements IWebMiddleware {
  @Config('graphql')
  config: Test;

  resolve() {
    console.log('graphql config', this.config);
    return async (ctx: Context, next: IMidwayWebNext) => {
      const server = new ApolloServer({
        schema: buildSchemaSync({
          resolvers: [path.resolve(ctx.app.baseDir, 'resolver/*.ts')],
          container: ctx.app.applicationContext,
        }),
      });
      ctx.app.use(
        server.getMiddleware({
          path: '/graphql',
        })
      );
      await next();

      return server.getMiddleware({
        path: '/graphql',
      });
    };
  }
}
