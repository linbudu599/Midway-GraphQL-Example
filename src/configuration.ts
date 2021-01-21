import { Configuration } from '@midwayjs/decorator';

@Configuration({
  imports: ['./lib/orm'],
  importConfigs: ['./config'],
})
export class ContainerConfiguration {}
