import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private connected = false;

  async onModuleInit() {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    const client = new Redis(url, {
      maxRetriesPerRequest: 1,
      lazyConnect: true,
      connectTimeout: 1500,
      enableOfflineQueue: false,
      retryStrategy: () => null,
    });

    client.on('error', (err) => {
      if (this.connected) {
        this.logger.warn(`Redis error: ${err.message}`);
        this.connected = false;
      }
    });
    client.on('ready', () => {
      this.connected = true;
      this.logger.log('Redis connected');
    });

    try {
      await client.connect();
      this.client = client;
    } catch (err) {
      this.logger.warn(
        `Redis unavailable at ${url} — running without cache. (${(err as Error).message})`,
      );
      client.disconnect();
    }
  }

  async onModuleDestroy() {
    await this.client?.quit().catch(() => undefined);
  }

  async getJson<T>(key: string): Promise<T | null> {
    if (!this.connected || !this.client) return null;
    try {
      const raw = await this.client.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  async setJson(key: string, value: unknown, ttlSeconds = 30): Promise<void> {
    if (!this.connected || !this.client) return;
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch {
      /* swallow */
    }
  }

  async invalidate(pattern: string): Promise<void> {
    if (!this.connected || !this.client) return;
    try {
      const stream = this.client.scanStream({ match: pattern });
      const keys: string[] = [];
      for await (const found of stream) keys.push(...(found as string[]));
      if (keys.length) await this.client.del(...keys);
    } catch {
      /* swallow */
    }
  }
}
