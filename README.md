# Midway-GraphQL-Example

> This Project aims to help getting familiar working with **Midway.Js** and **GraphQL** at the same time.
>
> Basic Knowledge On **TypeScript** & **GraphQL SDL(Schema Define Language)** is required.

## UnCaught Resistance

- ~~`TypeGraphQL` 与 `TYpeORM` 容器无法识别~~, 借助`Egg-Type-GraphQL`解决. 但暂不清楚能否完全像在 Apollo 中丝滑的使用.

## Current Implement

### 基本的 Egg-GraphQL

> [示例](src/egg-graphql), 基本原理是按照约定的目录及文件名, 收集`schema.graphql`以及`connector` `resolver`, 并在内部启动一个 Apollo-Server. 同时在路由层面拦截`/graphql`下的请求进行解析.

与`Egg`中使用的方式类似, `Egg-GraphQL`的源码解析可以看[这里](https://github.com/linbudu599/Source-Code/tree/master/Egg-GraphQL).

分别建立 `mutation` `query` `token`文件夹, 在其下使用`schema.graphql`书写 SDL, 注意多个文件夹下的会被自动收集, 所在在一个文件夹中定义的标量和类型可以直接在另外一个中使用.

拆分`connector`和`resolver`的方式也并无区别(**connector 负责调取 ORM 的 API, resolver 负责接收查询上下文并调用对应的 connector.xxx**)

以 mutation 举例来说:

mutation/schema.graphql

```graphql
type MutationCommonRes {
  success: Boolean
  message: String
}
type Mutation {
  # Token表
  createToken(input: CreateTokenReq): MutationCommonRes
  updateToken(input: UpdateTokenReq): MutationCommonRes
  deleteToken(input: DeleteTokenReq): MutationCommonRes
}
```

(输入类型`CreateTokenReq`定义在 token 文件夹下的 schema)

token/resolver.Js

```Js
module.exports = {
  Mutation: {
    createToken: (root, args, ctx) => {
      const params = args.input;
      return ctx.connector.token.createToken(params);
    },
    updateToken: (root, args, ctx) => {
      const params = args.input;
      return ctx.connector.token.updateToken(params);
    },
    deleteToken: (root, args, ctx) => {
      const params = args.input;
      return ctx.connector.token.deleteToken(params);
    },
  },
};

```

可以看到这里的逻辑是很简洁的, 从参数(`args`)中取出 input 并交由`connector`, 这里有一个地方需要注意, 在`Egg-GraphQL`
的源码实现中, 直接将 Koa(Egg)的上下文交给了`Apollo-Server-Koa`来启动服务. 所以这里的 ctx.connector 实际上就是经过扩展的
产物. 如果不想看源码, 只需要知道各个文件夹下的 connecotr 会被以文件夹名称作为键值挂载到`ctx.connector`下.

token/connector.js

```Js
class TokenConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.requestContext = this.ctx.requestContext;
  }

  async createToken() {
    return {
      success: true,
      message: "ok",
    };
  }

  // ...more methods

  async getTokenById() {
    // 获取 ioc 容器中的对象
    // 注意，这里必须实时拿取 userService 实例，每个请求周期的实例都不同
    const userService = await this.requestContext.getAsync("userService");
    const data = await userService.getUserList();
    return {
      success: true,
      message: "get service data " + JSON.stringify(data),
      data: { id: "1" },
    };
  }

}
```

可以看到这里实际上才是处理返回数据的地方, 和 Egg 的使用方式没有什么区别. 需要注意的一点是`getTokenById`方法, 如果
在`connector`中, 想要去调用 service, 需要`this.requestContext.getAsync(<provided name>)`, 来实时拿取实例.

TS 支持, 如果在 Egg-GraphQL 中新增如果是`.ts`文件就先编译再搜集可以吗?

### 使用 `TypeGraphQL`

> 需要借助[Egg-Type-GraphQL](https://github.com/forsigner/egg-type-graphql), 但由于不是 Egg/Midway 官方维护, 不清楚是否完全一致.

> 本示例中不包含 Directive 的使用

[示例](src/egg-type-graphql)

同样体现约定式以及模块化, 参考示例`/app/recipe`目录下, 但是我很好奇它是怎么做到的, 排除掉`controller`等等以外的文件夹名吗? 在 recipe 目录下, 又分为`type`/`service`/`resolver`三个模块, 与`Egg-GraphQL`的例子中类似(`service`负责去调用 ORM, 也就是前面的`connector`).

```typescript
// recipe.type.ts

import { Resolver, Field, ObjectType } from "type-graphql";

// 定义对象类型, 示例比较简单没有用到输入类型(InputObject)
@ObjectType({ description: "Object representing cooking recipe" })
export class Recipe {
  @Field({ nullable: true })
  title: string;

  @Field({
    nullable: true,
    description: "The recipe description with preparation info",
  })
  description?: string;

  @Field({
    nullable: true,
    description: "created date",
  })
  createdAt: Date;
}

// recipe.service.ts 这里直接返回数据哈
import { Service } from "typedi";

// 待尝试: 直接使用Injection来搞注入?

@Service()
export class RecipeService {
  getRecipe() {
    return {
      title: "hello~*",
      description: "desc......",
      createdAt: new Date(),
    };
  }
}

// recipe.resolver.ts
import { Resolver, Query } from "type-graphql";
import { Recipe } from "./recipe.type";
import { RecipeService } from "./recipe.service";

@Resolver(() => Recipe)
export class RecipeResolver {
  constructor(private recipeService: RecipeService) {}

  @Query(() => Recipe, { nullable: true })
  async recipe(): Promise<Recipe> {
    return this.recipeService.getRecipe();
  }
}
// 即查询recipe字段时对应的解析器
// 疑惑: 是不是这个插件自己做了依赖注入与收集的操作?
```

(这里的 API 需要查看`Type-GraphQL`官方文档, 不做讲解)

## Dependences 💡

- [Midway.Js](https://github.com/midwayjs/midway)
- [GraphQL-JS](https://github.com/graphql/graphql-js)
- [TypeGraphQL](https://github.com/MichalLytek/type-graphql)
- [TypeORM](https://github.com/typeorm/typeorm)
- [Apollo-Server](https://github.com/apollographql/apollo-server)

## Plan

- [x] Provide Basic **CRUD** Functions.
- [ ] Deployment Supported By **ALi Clound Function Compute**.
- [ ] ~~Unit Test~~.
