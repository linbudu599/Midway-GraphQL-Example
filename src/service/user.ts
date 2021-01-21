import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel, InjectConnection, InjectManager } from '../lib/orm';
import { User } from '../entities/User.entity';
import { Connection, Repository, EntityManager } from 'typeorm';

@Provide()
export class UserService {
  @InjectEntityModel(User)
  userModel: Repository<User>;

  @InjectConnection()
  connection: Connection;

  @InjectManager()
  manager: EntityManager;

  async getUser(): Promise<User[]> {
    return await this.userModel.find();
  }

  async createUser(): Promise<User> {
    return await this.userModel.save({
      name: '林不渡',
    });
  }
}
