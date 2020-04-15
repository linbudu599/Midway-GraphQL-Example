# Midway-GraphQL-Example

> This Project aims to help getting familiar working with **Midway.Js** and **GraphQL** at the same time.
>
> Basic Knowledge On **TypeScript** & **GraphQL SDL(Schema Define Language)** is required.

## Progress 🎬

**5%, Initial Project Category & Plan.**

## UnCaught Resistance

`Midway` 和 `GraphQL`的协作没有想象的容易, 体现在**无法手动启动服务**, 如使用`Apollo-Server-Koa`的方式, 而是需要在配置中设置`apolloServerOptions`.

同时, 虽然官方提供了[Egg-GraphQL](https://github.com/eggjs/egg-graphql)插件支持, 但是这个插件似乎与`TypeGraphQL`共存时存在一定问题, 体现在服务成功运行后`GraphIQL`界面报错, 并且`schema`与`resolver`无法识别.

猜测的原因: 这个插件规定将`GraphQL`相关文件均放置在`app/graphql`目录下, 并且识别方式是`.graphql`扩展名的文件(**GraphQL 官方提供了`GraphQL-Tools`来解析 schema**), 而我的使用方式是从`schema.ts`与`resolver.ts`生成应用级别的`schema`, 再交由`Apollo-Server`处理.

理想的使用方式应该是将`/graphql`的请求打到单独运行的`Apollo-Server`下, 同时不对目录进行规范, 允许自定义是否手动生成 schema.

考虑更改插件源码?

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
