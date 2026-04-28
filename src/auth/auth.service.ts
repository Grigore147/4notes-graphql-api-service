import axios from 'axios';

import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import { AuthServiceInterface } from './interfaces/auth.service';
import { UserDto } from './dto/user';
import { UserFactory } from './user.factory';
import { UserInterface } from './interfaces/user.entity';

type UserData = UserDto & Record<string, any>;

@Injectable()
export class AuthService implements AuthServiceInterface {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly config: ConfigService,

        @Inject(CACHE_MANAGER)
        private readonly cache: Cache,

        @Inject(forwardRef(() => UserFactory))
        private readonly userFactory: UserFactory
    ) {}

    async getUserByToken(token: string): Promise<UserInterface | undefined> {
        const authApiUrl = this.config.get<string>('auth.api.url');

        const cacheKey = `user:${token}`;
        const cacheTtl = 10 * 60 * 1000;
        const cachedUser = await this.cache.get<UserInterface>(cacheKey);

        if (cachedUser) {
            return cachedUser;
        }

        try {
            const response = await axios.get<{ data: UserData }>(`${authApiUrl}/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const user = this.userFactory.create(new UserDto(response.data.data));

            user.setAccessToken(token);

            await this.cache.set(cacheKey, user, cacheTtl);

            return user;
        } catch (error: unknown) {
            this.logger.error('Error fetching user by token:', error);
        }
    }

    async userAuthorized(
        user: UserInterface,
        action: string,
        resource: string,
        options: object = {}
    ): Promise<boolean> {
        const authApiUrl = this.config.get<string>('auth.api.url');

        this.logger.log(`User ID: ${user.id}`);
        this.logger.log(`action: ${action}`);
        this.logger.log(`resource: ${resource}`);
        this.logger.log(`options: ${JSON.stringify(options)}`);

        try {
            const response = await axios.post<{
                data: { authorized: boolean };
            }>(
                `${authApiUrl}/access/authorize`,
                {
                    action: action,
                    resource: resource,
                    options: options
                },
                {
                    headers: {
                        Origin: 'localhost',
                        Authorization: `Bearer ${user.accessToken}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
            );

            this.logger.log('Authorization response:', response.data);

            return response.data?.data?.authorized;
        } catch (error) {
            this.logger.error('Error checking authorization:', error);
            return false;
        }
    }
}
