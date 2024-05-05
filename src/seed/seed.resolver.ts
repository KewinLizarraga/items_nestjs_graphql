import { Mutation, Resolver } from '@nestjs/graphql';
import { SeedService } from './seed.service';

@Resolver()
export class SeedResolver {
  constructor(private readonly seedService: SeedService) {}

  @Mutation(() => Boolean, {
    name: 'executeSeed',
    description: 'Ejecuta la construcción de la DB',
  })
  async executeSeed(): Promise<Boolean> {
    return this.seedService.executeSeed();
  }
}
