import {Database} from "better-sqlite3";

export default (db: Database) => {
  db.exec(`
CREATE TABLE IF NOT EXISTS payment_categories (
    id INTEGER PRIMARY KEY,
    name TEXT,
    color TEXT
);
  `);
  console.log('Created table payment_categories.');

  db.exec(`ALTER TABLE payments ADD COLUMN category_id INTEGER REFERENCES payment_categories(id);`);
  console.log('Added column payments.category_id');

  db.exec(`ALTER TABLE payments RENAME COLUMN payment_schedule_id TO schedule_id`);
  console.log('Rename column payments.payment_schedule_id -> schedule_id');
}
