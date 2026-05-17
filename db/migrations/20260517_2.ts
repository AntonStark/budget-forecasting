import pkg from "better-sqlite3";
const {Database} = pkg;

export default (db: Database) => {
  db.exec(`
      ALTER TABLE payment_schedules ADD COLUMN date_start TEXT;
      ALTER TABLE payment_schedules ADD COLUMN date_end TEXT;
  `)
  console.log('Added columns to payment_schedules');
};
