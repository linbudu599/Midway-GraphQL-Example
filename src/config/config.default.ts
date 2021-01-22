import { ServerRegistration } from 'apollo-server-koa';
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import { ConnectionOptions } from '../lib/orm';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_{{keys}}';

  // eggjs版本的全局中间件还是要在这里开启
  config.middleware = ['eggraphql'];

  config.orm = {
    type: 'sqlite',
    name: 'default',
    database: 'db.sqlite',
    synchronize: true,
    dropSchema: true,
    logger: 'advanced-console',
    entities: ['/src/entities/*.ts'],
  } as ConnectionOptions;

  config.apollo = {
    path: '/graphql',
  } as ServerRegistration;

  config['eggraphql'] = {
    path: '/eggraphql',
  };

  config.security = {
    csrf: false,
  };

  return config;
};
