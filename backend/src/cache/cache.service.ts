import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { CacheEntry } from './interfaces/cache-entry.interface';

export const CACHE_DEFAULT_TTL_MS = 5 * 60 * 1000;
export const CACHE_CLEANUP_INTERVAL_MS = 60 * 1000;

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private readonly store = new Map<string, CacheEntry<unknown>>();
  private cleanupTimer?: NodeJS.Timeout;

  private readonly defaultTtlMs = CACHE_DEFAULT_TTL_MS;
  private readonly cleanupIntervalMs = CACHE_CLEANUP_INTERVAL_MS;

  onModuleInit(): void {
    this.cleanupTimer = setInterval(
      () => this.cleanup(),
      this.cleanupIntervalMs,
    );
    this.cleanupTimer.unref?.();
  }

  onModuleDestroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) {
      this.logger.debug(`MISS ${key}`);
      return null;
    }
    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      this.logger.debug(`EXPIRED ${key}`);
      return null;
    }
    this.logger.debug(`HIT ${key}`);
    return entry.value as T;
  }

  set<T>(key: string, value: T): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + this.defaultTtlMs,
    });
    this.logger.debug(`SET ${key}`);
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  private cleanup(): void {
    const now = Date.now();
    let removed = 0;
    for (const [key, entry] of this.store) {
      if (entry.expiresAt <= now) {
        this.store.delete(key);
        removed++;
      }
    }
    if (removed > 0) {
      this.logger.log(`Cleanup: removed ${removed} expired entrie(s)`);
    }
  }
}
