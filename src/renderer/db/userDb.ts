import Dexie, { Table } from 'dexie';

export class UserDB extends Dexie {
  boards!: Table<{ id: string; label: string }, number>;

  browsers!: Table<{ id: string; boardId: string; url: string }, number>;

  constructor() {
    super('user');
    this.version(1).stores({
      boards: 'id, label',
      browsers: 'id, boardId, url',
    });
    navigator.storage.persist();
  }
}

export const userDb = new UserDB();
