import { EggAppConfig, EggAppInfo, PowerPartial } from "midway";
// import { buildSchema } from "type-graphql";
// import UserResolver from "../app/graphql-past/resolver";

// async function initialize() {
//   const schema = await buildSchema({
//     resolvers: [UserResolver],
//   });
//   return schema;
// }

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
  const config = <DefaultConfig>{};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_{{keys}}";

  // add your config here
  config.middleware = ["graphql"];

  config.test = {
    key1: "1",
    key2: "2",
  };

  config.graphql = {
    router: "/graphql",
    app: true,
    graphiql: true,
    // apolloServerOptions: {
    //   schema: initialize(),
    //   // playground: true,
    // },
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  return config;
};
