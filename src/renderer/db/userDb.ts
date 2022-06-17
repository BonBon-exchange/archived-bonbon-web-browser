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

  constructor() {
    super('user');
    this.version(2).stores({
      boards: 'id, label, isFullSize',
      browsers: 'id, boardId, url, width, height, top, left',
    });
    navigator.storage.persist();
  }
}

export const userDb = new UserDB();
