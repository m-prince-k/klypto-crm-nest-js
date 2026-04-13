import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EventEmitter } from 'events';

type AuthEventPayload = {
  type: 'CONNECTED' | 'USER_DEACTIVATED' | 'USER_ACTIVATED';
  userId?: string;
  message?: string;
  at: string;
};

@Injectable()
export class AuthEventsService {
  private readonly emitter = new EventEmitter();

  createUserEventStream(
    userId: string,
  ): Observable<{ data: AuthEventPayload }> {
    return new Observable((subscriber) => {
      const channel = `user:${userId}`;
      const listener = (payload: AuthEventPayload) => {
        subscriber.next({ data: payload });
      };

      this.emitter.on(channel, listener);
      subscriber.next({
        data: {
          type: 'CONNECTED',
          userId,
          at: new Date().toISOString(),
          message: 'Realtime session channel connected',
        },
      });

      return () => {
        this.emitter.off(channel, listener);
      };
    });
  }

  emitUserStatusChange(userId: string, isActive: boolean) {
    this.emitter.emit(`user:${userId}`, {
      type: isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
      userId,
      at: new Date().toISOString(),
      message: isActive
        ? 'Your account has been activated by HR/Admin.'
        : 'Your account has been deactivated by HR/Admin.',
    } satisfies AuthEventPayload);
  }
}
