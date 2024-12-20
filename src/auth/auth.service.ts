import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/api/users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async validateUser(email: string, pass: string): Promise<UserInfo | null> {
        const user = await this.usersService.findEmailAndPass(email);
        if (user && bcrypt.compareSync(pass, user.password)) {
            const { password, id, timezone } = user
            return { userId: id, timezone }
        }
        return null;
    }
}
