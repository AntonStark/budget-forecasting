import {Database} from "better-sqlite3";

export default (db: Database) => {
  db.exec('ALTER TABLE payment_categories ADD COLUMN n_order INTEGER;');
}
