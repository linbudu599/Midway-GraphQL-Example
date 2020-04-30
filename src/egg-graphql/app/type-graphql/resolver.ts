import { Resolver, Query } from "type-graphql";

import UserSchema from "./schema";

@Resolver(() => UserSchema)
export default class UserResolver {
  @Query(() => UserSchema, { nullable: true })
  async getUser(): Promise<UserSchema> {
    return {
      uid: 599,
      account: "Penumbra",
    };
  }
}
