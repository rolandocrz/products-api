import { Controller, Get, Post, Body, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, RawHeaders } from './decorators/';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    // @Req() request: Express.Request,
    @GetUser() user: User,
    // @GetUser('email') userEmail: string,
    @RawHeaders() rawHeader: string[],
  ) {
    // console.log({ user });
    return {
      ok: true,
      message: `Succesfull`,
      user,
      // userEmail,
      rawHeader,
    };
  }

  // @SetMetadata('roles', ['admin', 'super-user'])
  @Get('private2')
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivateRout2(@GetUser() user: User) {
    return {
      ok: true,
      message: `Succesfull`,
      user,
    };
  }
}
