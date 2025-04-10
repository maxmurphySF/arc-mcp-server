/**
 * Repository service integration for ARC MCP Server
 */

import { DefaultCrudRepository } from '@loopback/repository';
import { inject } from '@loopback/core';

export class RepositoryService<T extends object> {
  constructor(
    @inject('repositories.MyRepository')
    private repository: DefaultCrudRepository<T, string>,
  ) {}

  async find(filter?: object): Promise<T[]> {
    return this.repository.find(filter);
  }

  async findById(id: string): Promise<T> {
    return this.repository.findById(id);
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    await this.repository.updateById(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.repository.deleteById(id);
  }
}