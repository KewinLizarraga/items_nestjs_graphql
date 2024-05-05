import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { SEED_ITEMS, SEED_USERS } from './data/seed-data';

import { Item } from './../items/entities/item.entity';
import { User } from './../users/entities/user.entity';
import { UsersService } from './../users/users.service';
import { ItemsService } from './../items/items.service';

@Injectable()
export class SeedService {
  private idProd: boolean;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly itemsService: ItemsService,
    private readonly usersService: UsersService,
  ) {
    this.idProd = configService.get('STATE') === 'prod';
  }

  async executeSeed() {
    if (this.idProd) {
      throw new UnauthorizedException('We cannot run SEED on Prod');
    }

    // * Limpiar la DB todo
    await this.deleteDatabase();

    // * Crear usuarios
    const user = await this.loadUsers();

    // * Crear items
    await this.loadItems(user);

    return true;
  }

  async deleteDatabase() {
    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }

  async loadUsers(): Promise<User> {
    const users = [];
    for (const user of SEED_USERS) {
      users.push(await this.usersService.create(user));
    }
    return users[0];
  }

  async loadItems(user: User): Promise<void> {
    const itemsPromise = [];
    for (const item of SEED_ITEMS) {
      itemsPromise.push(this.itemsService.create(item, user));
    }
    await Promise.all(itemsPromise);
  }
}
