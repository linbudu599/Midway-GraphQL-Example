# Midway-GraphQL-Example

> This Project aims to help getting familiar working with **Midway.Js** and **GraphQL** at the same time.
>
> Basic Knowledge On **TypeScript** & **GraphQL SDL(Schema Define Language)** is required.

## UnCaught Resistance

`Midway` 和 `GraphQL`的协作没有想象的容易, 体现在**无法手动启动服务**, 如使用`Apollo-Server-Koa`的方式, 而是需要在配置中设置`apolloServerOptions`.

同时, 虽然官方提供了[Egg-GraphQL](https://github.com/eggjs/egg-graphql)插件支持, 但是这个插件似乎与`TypeGraphQL`共存时存在一定问题, 体现在服务成功运行后`GraphIQL`界面报错, 并且`schema`与`resolver`无法识别.

猜测的原因: 这个插件规定将`GraphQL`相关文件均放置在`app/graphql`目录下, 并且识别方式是`.graphql`扩展名的文件(**GraphQL 官方提供了`GraphQL-Tools`来解析 schema**), 而我的使用方式是从`schema.ts`与`resolver.ts`生成应用级别的`schema`, 再交由`Apollo-Server`处理.

理想的使用方式应该是在应用初始化(`app.ts`)时去初始化`TypeDI`容器以及`TypeGraphQL`的`buildSchema()`操作, 而后交由插件(`Egg-GraphQL`似乎不能支持)处理启动一个`/graphql`下的 apollo 服务. 我个人认为如果`GraphQL`更受重视如使用在业务中, `Midway`和`TypeGraphQL`的协作会给开发进程带来很大程度的"愉悦感".

当前的实现去掉了`TypeGraphQL`, 而改为[Midway-Example-GraphQL](https://github.com/midwayjs/midway-examples/tree/4a22e07c661a01aa05221fe56e11dce6c9bfc604/demo-plugin-egg-graphql)提供的示例写法(使用的仍然是`egg-plugin-graphql`这个插件), 即使用`schema.graphql`来定义范式, 如果要实现原本规划的效果, 可能需要整个`Midway-TypeGraphQL`来进行支持. 类似于`Egg-GraphQL`的思路, 内部使用`Apollo-Server-Koa`起一个服务, 并作为主应用的中间件和插件进行拦截`/graphql`的请求并处理.(话是这么说但是我还真写不出来现在).

## Current Implement

与`Egg`中使用的方式类似, `Egg-GraphQL`的源码解析可以看[这里](https://github.com/linbudu599/Source-Code/tree/master/Egg-GraphQL).

分别建立 `mutation` `query` `token`文件夹, 在其下使用`schema.graphql`书写SDL, 注意多个文件夹下的会被自动收集, 所在在一个文件夹中定义的标量和类型可以直接在另外一个中使用.

拆分`connector`和`resolver`的方式也并无区别(**connector负责调取ORM的API, resolver负责接收查询上下文并调用对应的connector.xxx**)

以mutation举例来说:

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

(输入类型`CreateTokenReq`定义在token文件夹下的schema)

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

可以看到这里的逻辑是很简洁的, 从参数(`args`)中取出input并交由`connector`, 这里有一个地方需要注意, 在`Egg-GraphQL`
的源码实现中, 直接将Koa(Egg)的上下文交给了`Apollo-Server-Koa`来启动服务. 所以这里的ctx.connector实际上就是经过扩展的
产物. 如果不想看源码, 只需要知道各个文件夹下的connecotr会被以文件夹名称作为键值挂载到`ctx.connector`下.

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

可以看到这里实际上才是处理返回数据的地方, 和Egg的使用方式没有什么区别. 需要注意的一点是`getTokenById`方法, 如果
在`connector`中, 想要去调用service, 需要`this.requestContext.getAsync(<provided name>)`, 来实时拿取实例.

TS支持, 如果在Egg-GraphQL中新增如果是`.ts`文件就先编译再搜集可以吗?

## Dependences 💡

- [Midway.Js](https://github.com/midwayjs/midway)
- [GraphQL-JS](https://github.com/graphql/graphql-js)
- [TypeGraphQL](https://github.com/MichalLytek/type-graphql)
- [TypeORM](https://github.com/typeorm/typeorm)
- [Apollo-Server](https://github.com/apollographql/apollo-server)

## Plan

- [x] Provide Basic **CRUD** Functions.
- [ ] Deployment Supported By **ALi Clound Function Compute**.
- [ ] Unit Test.
- [ ] CI/CD.
