import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { Auth, GetUser, RawHeaders } from './decorators';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDT: LoginUserDto) {
    return this.authService.login(loginUserDT);
  }

  @Get('check-auth-status')
  @Auth()
  chechAuthStatus(
    @GetUser() user: User
  ){

    return this.authService.checkAuthStatus(user )
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
    @Headers() header: IncomingHttpHeaders,
  ) {
    return {
      ok: true,
      message: 'Hola mundo private',
      user,
      userEmail,
    };
  }

  @Get('private2')
  @RoleProtected(ValidRoles.supeUser, ValidRoles.user)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }
}
