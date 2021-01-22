import * as path from 'path';
import { Provide, Config, App } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayKoaApplication } from '@midwayjs/koa';

import { ApolloServer, ServerRegistration } from 'apollo-server-koa';
import { buildSchemaSync } from 'type-graphql';

// some extra config
type ApolloMwConfig = { [key: string]: any } & ServerRegistration;

@Provide('GraphQLMiddleware')
export class GraphqlMiddleware implements IWebMiddleware {
  @Config('apollo')
  config: ApolloMwConfig;

  @App()
  app: IMidwayKoaApplication;

  resolve() {
    console.log('Apollo Config', this.config);
    const server = new ApolloServer({
      schema: buildSchemaSync({
        resolvers: [path.resolve('./src', 'resolver/*')],
        container: this.app.getApplicationContext(),
      }),
    });
    console.log('Apollo-GraphQL Invoke');

    return server.getMiddleware(this.config);
  }
}
