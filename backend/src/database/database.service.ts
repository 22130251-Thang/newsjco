import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import path from 'path';
import * as fs from 'fs';
import { BaseRecord } from 'src/types/baserecord.type';
@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly memoryStore = new Map<string, BaseRecord[]>();
  private readonly logger = new Logger(DatabaseService.name);
  private readonly DATA_PATH = path.join(process.cwd(), 'data');

  onModuleInit() {
    this.loadDataIntoMemory();
  }
  private loadDataIntoMemory() {
    if (!fs.existsSync(this.DATA_PATH)) {
      this.logger.warn(`Directory not found: ${this.DATA_PATH}`);
      return;
    }
    const files = fs.readdirSync(this.DATA_PATH);
    files
      .filter((file) => path.extname(file) === '.json')
      .forEach((file) => {
        const tableName = path.basename(file).substring(0,path.basename(file).length-5);
        const filePath = path.join(this.DATA_PATH, file);
        try {
          const rawData = fs.readFileSync(filePath, 'utf-8');
          const parseData: BaseRecord[] = JSON.parse(rawData);
          if (Array.isArray(parseData)) {
            this.memoryStore.set(tableName, parseData);
            this.logger.log(
              `Loaded table ${tableName} with ${parseData.length}`,
            );
          }
        } catch (error) {
          this.logger.error(`Failed to load ${file}: ${error.message}`);
        }
      });
  }
  findAll<T extends BaseRecord>(tablename: string): T[] {
    return (this.memoryStore.get(tablename) as T[]) || [];
  }
  findById<T extends BaseRecord>(tablename: string, id: number | string) {
    const table = this.findAll<T>(tablename);
    const item = table.find((record) => record.id === id);

    if (!item) {
      throw new NotFoundException(`Record with ID:${id} not found in ${table}`);
    }
    return item;
  }

  create<T extends BaseRecord>(tablename: string, data: Omit<T, 'id'>): T {
    const table = this.findAll<T>(tablename);
    const maxId = table.reduce(
      (max, item) =>
        typeof item.id === 'number' && item.id > max ? item.id : max,
      0,
    );
    const newId = maxId + 1;
    const newRecord = {
      ...data,
      id: newId,
    } as T;
    table.push(newRecord);
    return newRecord;
  }
  update<T extends BaseRecord>(
    tableName: string,
    id: number | string,
    updatedData: Partial<T>,
  ): T {
    const table = this.findAll<T>(tableName);
    const index = table.findIndex((record) => record.id === id);
    if (index === -1) {
      throw new NotFoundException(
        `Record with ID ${id} not found in ${tableName}`,
      );
    }
    const updatedRecord = {
      ...table[index],
      ...updatedData,
      id: id,
    };
    table[index] = updatedRecord;
    return updatedRecord;
  }
  remove<T extends BaseRecord>(tableName: string, id: number | string): T {
    const table = this.findAll<T>(tableName);

    const index = table.findIndex((record) => record.id == id);

    if (index === -1) {
      throw new NotFoundException(
        `Record with ID ${id} not found in ${tableName}`,
      );
    }

    const [removedItem] = table.splice(index, 1);

    return removedItem;
  }
  findOneBy<T extends BaseRecord>(tablename: string, key: keyof T, value: any) {
    const table = this.findAll<T>(tablename);
    this.logger.log(this.memoryStore.keys())
    return table.find((record) => record[key] === value);
  }
}
