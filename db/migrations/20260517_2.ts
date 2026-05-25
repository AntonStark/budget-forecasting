import {Database} from "better-sqlite3";

export default (db: Database) => {
  db.exec(`
      ALTER TABLE payment_schedules ADD COLUMN date_start TEXT;
      ALTER TABLE payment_schedules ADD COLUMN date_end TEXT;
  `)
  console.log('Added columns to payment_schedules');
};
