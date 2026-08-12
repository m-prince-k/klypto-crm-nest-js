import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { isOriginAllowed } from '../common/cors-origin.util';

function orgRoom(organizationId: string) {
  return `org:${organizationId}`;
}

@WebSocketGateway({
  namespace: '/ws/attendance',
  cors: {
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => callback(null, isOriginAllowed(origin)),
    credentials: true,
  },
})
export class AttendanceGateway implements OnGatewayConnection {
  private readonly logger = new Logger(AttendanceGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization
          ?.toString()
          .replace('Bearer ', '');

      if (!token) {
        throw new Error('Missing auth token');
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET || 'access-secret',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload?.sub },
        select: { id: true, isActive: true, organizationId: true },
      });

      if (!user || !user.isActive || !user.organizationId) {
        throw new Error('Invalid or inactive user');
      }

      await client.join(orgRoom(user.organizationId));
    } catch (error) {
      this.logger.warn(`Rejected socket connection: ${error.message}`);
      client.disconnect(true);
    }
  }

  emitAttendanceUpdated(organizationId: string, record: unknown) {
    this.server.to(orgRoom(organizationId)).emit('attendance:updated', record);
  }
}
