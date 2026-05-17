import {Database} from "better-sqlite3";
import {AccountBalance} from "@/types";

export function getBalancesBetween(db: Database, dateStart: string, dateEnd: string) {
  const stmt = db.prepare<any, AccountBalance>(`
    SELECT adb.account_id, adb.at_date as atDate, adb.value
    FROM account_date_balances adb
    WHERE adb.at_date BETWEEN ? AND ?
    ORDER BY adb.at_date
  `);

  return stmt.all([dateStart, dateEnd]);
}

export function selectBalanceBeforeDate(db: Database, accountId: number, beforeDate: string): AccountBalance {
  const stmt = db.prepare<any, AccountBalance>(`
    SELECT adb.account_id, adb.value, adb.at_date as atDate
    FROM account_date_balances adb
    WHERE adb.account_id = ?
      AND adb.at_date < ?
    ORDER BY adb.at_date DESC
    LIMIT 1
  `);

  const result: AccountBalance | undefined = stmt.get([accountId, beforeDate]);
  const defaultBalance = {value: 0, account_id: accountId, atDate: undefined}
  return (result? result : defaultBalance);
}

export function saveBalance(db: Database, accountId: number, atDate: string, value: number) {
  const stmt = db.prepare(`
    INSERT INTO account_date_balances (account_id, at_date, value)
    VALUES (?, ?, ?)
    ON CONFLICT ( account_id, at_date ) 
        DO UPDATE 
    SET value = ?
    WHERE account_id = ? and at_date = ?
  `);
  stmt.run([accountId, atDate, value, value, accountId, atDate]);
}
