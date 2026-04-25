import {Database} from "better-sqlite3";
import {PaymentData, PaymentInSchema} from "@/types";

export function createOneTimePayment(db: Database, item: PaymentInSchema) {
  const insert = db.prepare(
    "INSERT INTO one_time_payments (amount, description, at_date) VALUES (?, ?, ?);"
  );
  insert.run(item.amount, item.description, item.at_date);
}

export function listOneTimePayments(db: Database, {dateStart, dateEnd}) {
  const stmt = db.prepare<any, PaymentData>(`
    SELECT otp.id, otp.description, otp.at_date, otp.amount, otp.account_id, cur.iso_code as currency_iso_code, cur.symbol as currency_symbol
    FROM one_time_payments otp
    LEFT JOIN currencies cur on otp.currency_id = cur.id
    WHERE otp.at_date IS NULL OR otp.at_date BETWEEN ? AND ?
    ORDER BY otp.at_date NULLS FIRST, otp.amount NULLS LAST
  `);
  const payments = stmt.all([dateStart, dateEnd]);
  return payments;
}
