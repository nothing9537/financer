import { FILTERS_KEY, SAVE_FILTERS_OVER_SESSION_KEY } from '../consts/local-storage-keys';

export type Filters = Record<string, string>;

export class FiltersLocalStorageAbstract {
  private static getItem<T = string>(key: string, parse?: boolean): T | null {
    try {
      const item = localStorage.getItem(key);

      if (parse && item) {
        return JSON.parse(item) as T;
      }

      if (!parse && item) {
        return item as T;
      }

      return null;

    } catch {
      return null;
    }
  }

  private static setItem<T>(key: string, value: T, shouldStringify?: boolean): void {
    try {
      localStorage.setItem(key, shouldStringify ? JSON.stringify(value) : value as string);
    } catch (error) {
      console.error(`Error saving item to localStorage (key: ${key}):`, error);
    }
  }

  static saveFiltersFlag(flag: boolean): void {
    this.setItem(SAVE_FILTERS_OVER_SESSION_KEY, flag);
  }

  static getFiltersFlag(): boolean | null {
    return this.getItem<boolean>(SAVE_FILTERS_OVER_SESSION_KEY);
  }

  static saveFilters(queryPath: string): void {
    this.setItem(FILTERS_KEY, queryPath, false);
  }

  static getFilters(): string | null {
    return this.getItem<string>(FILTERS_KEY);
  }
}