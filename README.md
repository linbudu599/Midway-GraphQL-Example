# Midway-GraphQL-Example

> This Project aims to help getting familiar working with **Midway.Js** and **GraphQL** at the same time.
>
> Basic Knowledge On **TypeScript** & **GraphQL SDL(Schema Define Language)** is required.

## UnCaught Resistance

`Midway` 和 `GraphQL`的协作没有想象的容易, 体现在**无法手动启动服务**, 如使用`Apollo-Server-Koa`的方式, 而是需要在配置中设置`apolloServerOptions`.

同时, 虽然官方提供了[Egg-GraphQL](https://github.com/eggjs/egg-graphql)插件支持, 但是这个插件似乎与`TypeGraphQL`共存时存在一定问题, 体现在服务成功运行后`GraphIQL`界面报错, 并且`schema`与`resolver`无法识别.

猜测的原因: 这个插件规定将`GraphQL`相关文件均放置在`app/graphql`目录下, 并且识别方式是`.graphql`扩展名的文件(**GraphQL 官方提供了`GraphQL-Tools`来解析 schema**), 而我的使用方式是从`schema.ts`与`resolver.ts`生成应用级别的`schema`, 再交由`Apollo-Server`处理.

理想的使用方式应该是在应用初始化(`app.ts`)时去初始化`TypeDI`容器以及`TypeGraphQL`的`buildSchema()`操作, 而后交由插件(`Egg-GraphQL`似乎不能支持)处理启动一个`/graphql`下的 apollo 服务. 我个人认为如果`GraphQL`更受重视如使用在业务中, `Midway`和`TypeGraphQL`的协作会给开发进程带来很大程度的"愉悦感".

当前的实现去掉了`TypeGraphQL`, 而改为`Egg-GraphQL`提供的示例写法, 及使用`schema.graphql`来定义范式, 如果要实现原本规划的效果, 可能需要整个`Midway-TypeGraphQL`来进行支持. 类似于`Egg-GraphQL`的思路, 内部使用`Apollo-Server-Koa`起一个服务, 并作为主应用的中间件和插件进行拦截`/graphql`的请求并处理.(话是这么说但是我还真写不出来现在).

## Dependences 💡

- [Midway.Js](https://github.com/midwayjs/midway)
- [GraphQL-JS](https://github.com/graphql/graphql-js)
- [TypeGraphQL](https://github.com/MichalLytek/type-graphql)
- [TypeORM](https://github.com/typeorm/typeorm)
- [Apollo-Server](https://github.com/apollographql/apollo-server)

## Plan

- [ ] Provide Basic **CRUD** Functions.
- [ ] Deployment Supported By **ALi Clound Function Compute**.
- [ ] Unit Test.
- [ ] CI/CD.

## Category

```text
| /src     主要资源目录
|
| --- /app     主应用
| ------- /controller     控制器
| ------- /public     公共资源
| ------- /middleware     中间件
|
| --- /config     应用配置
| --- /service     [GraphQL Resolver]及逻辑处理
| --- /schema     GraphQL Schema
| --- /util     工具函数等
```
