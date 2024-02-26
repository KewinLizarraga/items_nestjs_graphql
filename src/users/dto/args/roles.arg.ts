import { IsArray, IsString } from 'class-validator';
import { ArgsType, Field } from '@nestjs/graphql';

import { ValidRoles } from '../../../auth/enums/valid-roles.enum';

@ArgsType()
export class ValidRolesArgs {
  @Field(() => [ValidRoles], { nullable: true })
  @IsArray()
  roles: ValidRoles[] = [];
}
