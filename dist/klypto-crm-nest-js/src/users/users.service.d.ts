import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client/crm';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOneByEmail(email: string): Promise<any>;
    findOneById(id: string): Promise<any>;
    create(data: Prisma.UserCreateInput): Promise<any>;
}
