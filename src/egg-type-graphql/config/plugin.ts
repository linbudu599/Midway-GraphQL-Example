import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  static: true,
  typeGraphQL: {
    enable: true,
    package: 'egg-type-graphql',
  },
};

export default plugin;
