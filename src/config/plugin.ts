import { EggPlugin } from "midway";
export default {
  static: true, // default is true
  graphql: {
    enable: true,
    package: "egg-graphql",
  },
} as EggPlugin;
