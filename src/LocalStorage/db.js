import Dexie from 'dexie';

const db = new Dexie('PoMELO_DB');
db.version(1).stores({ observations: '++id' });

export default db;