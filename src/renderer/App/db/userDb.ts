import Dexie, { Table } from 'dexie';

export class UserDB extends Dexie {
  boards!: Table<{ id: string; label: string; isFullSize: boolean }, number>;

  browsers!: Table<
    {
      id: string;
      boardId: string;
      url: string;
      width: number;
      height: number;
      top: number;
      left: number;
    },
    number
  >;

  settings!: Table<{
    key: string;
    val: unknown;
  }>;

  constructor() {
    super('user');
    this.version(5).stores({
      boards: 'id, label, isFullSize',
      browsers: 'id, boardId, url, width, height, top, left',
      settings: 'key, val',
    });
    navigator.storage.persist();
  }
}

export const userDb = new UserDB();
