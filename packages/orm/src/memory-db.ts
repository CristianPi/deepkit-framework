import {DatabaseSession} from './database-session';
import {DatabaseQueryModel, Entity, GenericQuery, GenericQueryResolver} from './query';
import {ClassSchema, getClassSchema} from '@deepkit/type';
import {ClassType} from '@deepkit/core';
import {DatabaseAdapter, DatabaseAdapterQueryFactory, DatabasePersistence, DatabasePersistenceChangeSet} from './database';

export class MemoryDatabaseAdapter extends DatabaseAdapter {
    async migrate(classSchemas: Iterable<ClassSchema>) {
    }

    createPersistence(): DatabasePersistence {
        class Persistence extends DatabasePersistence {
            async remove<T extends Entity>(classSchema: ClassSchema<T>, items: T[]): Promise<void> {
                return Promise.resolve(undefined);
            }

            async insert<T extends Entity>(classSchema: ClassSchema<T>, items: T[]): Promise<void> {
                return Promise.resolve(undefined);
            }

            async update<T extends Entity>(classSchema: ClassSchema<T>, changeSets: DatabasePersistenceChangeSet<T>[]): Promise<void> {
                return Promise.resolve(undefined);
            }

            async release() {

            }
        }

        return new Persistence;
    }

    disconnect(force?: boolean): void {
    }

    getName(): string {
        return 'memory';
    }

    getSchemaName(): string {
        return '';
    }

    queryFactory(databaseSession: DatabaseSession<this>): DatabaseAdapterQueryFactory {
        return new class {
            createQuery(classType: ClassType<any>) {
                class Resolver<T> extends GenericQueryResolver<T> {
                    async count(model: DatabaseQueryModel<T>): Promise<number> {
                        return Promise.resolve(0);
                    }

                    async deleteMany(model: DatabaseQueryModel<T>): Promise<number> {
                        return Promise.resolve(0);
                    }

                    async deleteOne(model: DatabaseQueryModel<T>): Promise<number> {
                        return Promise.resolve(0);
                    }

                    async find(model: DatabaseQueryModel<T>): Promise<T[]> {
                        return Promise.resolve([]);
                    }

                    async findOneOrUndefined(model: DatabaseQueryModel<T>): Promise<T | undefined> {
                        return Promise.resolve(undefined);
                    }

                    async has(model: DatabaseQueryModel<T>): Promise<boolean> {
                        return Promise.resolve(false);
                    }

                    async patchMany(model: DatabaseQueryModel<T>, value: { [p: string]: any }): Promise<number> {
                        return Promise.resolve(0);
                    }

                    async patchOne(model: DatabaseQueryModel<T>, value: { [p: string]: any }): Promise<number> {
                        return Promise.resolve(0);
                    }

                    async updateOne(model: DatabaseQueryModel<T>, value: {}): Promise<boolean> {
                        return Promise.resolve(false);
                    }
                }

                class Query<T> extends GenericQuery<T> {
                    protected resolver = new Resolver<T>(this.classSchema, databaseSession);
                }

                return new Query(getClassSchema(classType), databaseSession);
            }
        };
    }
}
