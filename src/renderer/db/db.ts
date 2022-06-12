import Dexie, { Table } from 'dexie';

export class DataDB extends Dexie {
  navigate!: Table<{ id: string; url: string; date: Date }, number>;

  constructor() {
    super('data');
    this.version(1).stores({
      navigate: '++id, url, date',
    });
    navigator.storage.persist();
  }

  deleteNavigate(navigateId: number) {
    return this.transaction('rw', this.navigate, () => {
      this.navigate.where({ id: navigateId }).delete();
    });
  }
}

export const db = new DataDB();
