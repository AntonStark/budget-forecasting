import {Database} from "better-sqlite3";
import {AccountShortData} from "@/types";

export function listAccounts(db: Database) {
  const stmt = db.prepare<[], AccountShortData>(`
        SELECT acc.*, cur.iso_code FROM accounts acc
        JOIN currencies cur on acc.currency_id = cur.id
        ORDER BY acc.order_number
    `);

  const accountShortData = stmt.all();
  return accountShortData;
}
