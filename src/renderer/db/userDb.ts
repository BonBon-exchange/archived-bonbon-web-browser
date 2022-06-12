import Dexie, { Table } from 'dexie';

export class UserDB extends Dexie {
  boards!: Table<{ id: string; label: string }, number>;

  browsers!: Table<
    {
      id: string;
      boardId: string;
      url: string;
      width: number;
      height: number;
      top: number;
      left: number;
      isFullSize: boolean;
    },
    number
  >;

  constructor() {
    super('user');
    this.version(1).stores({
      boards: 'id, label',
      browsers: 'id, boardId, url, width, height, top, left, isFullSize',
    });
    navigator.storage.persist();
  }
}

export const userDb = new UserDB();
