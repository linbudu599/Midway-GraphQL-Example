import "reflect-metadata";
import chalk from "chalk";
// import { ApolloServer } from "apollo-server";
import { Container } from "typedi";
import * as TypeORM from "typeorm";
// import { buildSchema } from "type-graphql";

TypeORM.useContainer(Container);

// async function connectDB(
//   db: string,
//   username: string,
//   pwd: string
// ): Promise<void> {
//   await TypeORM.createConnection({
//     type: "mysql",
//     database: db,
//     username: username,
//     password: pwd,
//     port: 3306,
//     host: "localhost",
//     // entities: [User, Article],
//     // synchronize: true,
//     logger: "advanced-console",
//     logging: "all",
//     // dropSchema: true,
//     cache: true,
//   });
// }

class InitApp {
  app: any;
  constructor(app: any) {
    console.log(chalk.green("=== Application Initialzing ==="));
    this.app = app;
  }

  didLoad() {
    console.log(chalk.green("=== Config Loaded ==="));
    console.log(this.app.config.test);
  }
}

export default InitApp;
