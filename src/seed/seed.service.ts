import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.insertNewProducts(adminUser);
    return `Seed Executed`;
  }

  private async deleteTables() {
    await this.productService.deleteAllProduct();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach((user) => {
      const password = bcrypt.hashSync(user.password, 10);
      users.push(
        this.userRepository.create({
          ...user,
          password,
        }),
      );
    });

    const dbUsers = await this.userRepository.save(users);

    return dbUsers[0];
  }

  private async insertNewProducts(adminUser: User) {
    await this.productService.deleteAllProduct();

    const products = initialData.products;
    const insertPromise: Promise<unknown>[] = [];

    products.forEach((product) => {
      insertPromise.push(this.productService.create(product, adminUser));
    });

    await Promise.all(insertPromise);
    return true;
  }
}
