import * as path from 'path';
// import { Provide } from '@midwayjs/decorator';
import { IMidwayWebNext } from '@midwayjs/web';

import { Context } from 'egg';

import { ApolloServer, ServerRegistration } from 'apollo-server-koa';
import { buildSchemaSync } from 'type-graphql';

// @Provide()
// export class GraphQLMiddleware implements IWebMiddleware {
//   resolve() {
//     return async (ctx: Context, next: IMidwayWebNext) => {
//       const server = new ApolloServer({
//         schema: buildSchemaSync({
//           resolvers: [path.resolve(ctx.app.baseDir, 'resolvers/*.ts')],
//           container: ctx.app.applicationContext,
//         }),
//       });
//       ctx.app.use(server.getMiddleware());

//       const startTime = Date.now();
//       await next();
//       console.log(Date.now() - startTime);
//     };
//   }
// }

console.log(path.resolve('./', 'src', 'resolvers/*.ts'));
export default (options: ServerRegistration) => {
  return async function graphql(ctx: Context, next: IMidwayWebNext) {
    await next();
    const server = new ApolloServer({
      schema: buildSchemaSync({
        resolvers: [path.resolve('../..', 'resolvers/*.ts')],
        container: ctx.app.applicationContext,
      }),
    });
    // return
    ctx.app.use(server.getMiddleware(options));
  };
};
