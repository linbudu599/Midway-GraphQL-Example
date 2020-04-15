import { Field, ObjectType, Int } from "type-graphql";

@ObjectType()
export default class User {
  @Field((type) => Int)
  uid!: number;

  @Field()
  account!: string;
}

