import {Database} from "better-sqlite3";

export default (db: Database) => {
  db.exec(`ALTER TABLE one_time_payments RENAME TO 'payments';`);
  console.log('Table one_time_payments -> payments altered');

  db.exec(`
CREATE TABLE IF NOT EXISTS payment_schedules (
    id INTEGER PRIMARY KEY,
    type TEXT,
    number INTEGER,    
    applied_until TEXT    
);
  `)
  console.log('Created payment_schedules table.')

  db.exec(`ALTER TABLE payments ADD COLUMN payment_schedule_id INTEGER REFERENCES payment_schedules(id);`)
  console.log('Added column payments.payment_schedule_id')
};
