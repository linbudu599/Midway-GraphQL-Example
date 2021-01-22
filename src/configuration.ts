import { Configuration, App } from '@midwayjs/decorator';
import { ILifeCycle } from '@midwayjs/core';
// import { Application } from 'egg';
import { IMidwayKoaApplication } from '@midwayjs/koa';

@Configuration({
  imports: ['./lib/orm'],
  importConfigs: ['./config'],
})
export class ContainerConfiguration implements ILifeCycle {
  @App()
  app: IMidwayKoaApplication;

  async onReady() {
    console.log('onReady');
    this.app.use(await this.app.generateMiddleware('GraphQLMiddleware'));
    this.app.use(await this.app.generateMiddleware('reportMiddleware'));
  }
}
