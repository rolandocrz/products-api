import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    if (!user)
      throw new InternalServerErrorException('User not found (reques)');

    // Si viene argumento
    if (data) {
      if (!(data in user)) {
        throw new InternalServerErrorException(
          `Property "${data}" does not exist on user`,
        );
      }
      return user[data];
    }

    // Si no viene con argumento regresa el user completo
    return user;
  },
);
