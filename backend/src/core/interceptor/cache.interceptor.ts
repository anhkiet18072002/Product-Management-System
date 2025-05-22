import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private productCacheKeys = new Set<string>();

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private getCacheKey(request: any): string {
    return `cache:${request.originalUrl}`;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    if (request.method === 'GET') {
      const key = this.getCacheKey(request);
      const cached = await this.cacheManager.get(key);
      if (cached) {
        return of(cached);
      }

      return next.handle().pipe(
        tap((data) => {
          if (data) {
            this.cacheManager.set(key, data, { ttl: 60 });

            // Add cache in list of delete
            if (request.url.startsWith('/products')) {
              this.productCacheKeys.add(key);
            }
          }
        }),
      );
    }

    if (
      request.url.startsWith('/products') &&
      ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)
    ) {
      for (const key of this.productCacheKeys) {
        await this.cacheManager.del(key);
      }

      this.productCacheKeys.clear();
    }

    return next.handle();
  }
}
