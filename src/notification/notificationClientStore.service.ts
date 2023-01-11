import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class NotificationClientStoreService {
  private _store: { [id: number]: Set<Socket> } = {};

  get store() {
    return this._store;
  }

  client(id: number) {
    this.store[id];
  }

  async add(clientId: number, client: Socket) {
    if (!this._store[clientId]) {
      this._store[clientId] = new Set();
    }
    this._store[clientId].add(client);
  }

  async remove(clientId: number, client: Socket) {
    const result = this._store[clientId].delete(client);
    if (this._store[clientId].size == 0) {
      delete this._store[clientId];
    }
    return result;
  }
}
