import {Database} from "better-sqlite3";

import {PaymentData, PaymentInSchema, PaymentSchedule, ScheduleShortSchema} from "@/types";
import {dateToSql} from "@/utils/dates";
import {generateScheduleDates} from "@/domain";


export function createPayment(db: Database, item: PaymentInSchema) {
  const insert = db.prepare(
    `INSERT INTO payments (amount, description, at_date, payment_schedule_id) VALUES (?, ?, ?, ?);`
  );
  insert.run(item.amount, item.description, item.at_date, item.payment_schedule_id || null);
}

function setScheduleApplied(db: Database, untilDate: string, scheduleId: number) {
  db.prepare(`UPDATE payment_schedules SET applied_until = ? WHERE id = ?`).run([untilDate, scheduleId]);
}

export function createScheduledPayment(db: Database, paymentParams: PaymentInSchema, scheduleParams: ScheduleShortSchema) {
  db.transaction(() => {
    const insertSchedule = db.prepare<any, { id: number }>(
      `INSERT INTO payment_schedules (type, number, date_start) VALUES (?, ?, ?) RETURNING payment_schedules.id;`
    );

    const scheduleRes = insertSchedule.get([scheduleParams.type, scheduleParams.number, scheduleParams.date_start]);
    console.log('scheduleRes', scheduleRes);
    createPayment(db, {...paymentParams, payment_schedule_id: scheduleRes.id});
    setScheduleApplied(db, paymentParams.at_date, scheduleRes.id);
  })();
}

export function listPayments(db: Database, dateStart: string, dateEnd: string) {
  const stmt = db.prepare<any, PaymentData>(`
    SELECT 
        p.id, p.description, p.at_date, p.amount, p.account_id, 
        cur.iso_code as currency_iso_code, cur.symbol as currency_symbol,
        ps.type as schedule_type, ps.number as schedule_number, ps.date_start as schedule_date_start
    FROM payments p
    LEFT JOIN currencies cur on p.currency_id = cur.id
    LEFT JOIN payment_schedules ps on p.payment_schedule_id = ps.id
    WHERE p.at_date IS NULL OR p.at_date BETWEEN ? AND ?
    ORDER BY p.at_date NULLS FIRST, p.amount NULLS LAST;
  `);
  const payments = stmt.all([dateStart, dateEnd]);
  return payments;
}


export function ensureScheduledPayments(db: Database, untilDate: string) {
  const selectNotApplied = db.prepare<any, PaymentSchedule>(`
    SELECT ps.id, ps.type, ps.number, ps.applied_until, ps.date_start, ps.date_end
    FROM payment_schedules ps
    WHERE ps.applied_until < ? AND (ps.date_end IS NULL OR ps.date_end > ?);
  `);
  const notAppliedSchedules = selectNotApplied.all([untilDate, untilDate]);

  const selectExemplarPayment = db.prepare<any, PaymentInSchema>(`
    SELECT 
        p.description, p.at_date, p.amount, p.payment_schedule_id
    FROM payments p
    WHERE p.payment_schedule_id = ?
    LIMIT 1;
  `);

  for (const schedule of notAppliedSchedules) {
    const dates = generateScheduleDates(schedule, untilDate);

    // если массив пустой, то просто обновляем applied_until -> untilDate
    // иначе надо в транзакции создать платежи для дат и обновить applied_until
    if (!dates) {
      setScheduleApplied(db, untilDate, schedule.id);
      continue;
    }

    const exemplarPayment = selectExemplarPayment.get(schedule.id);
    db.transaction(() => {
      for (const date of dates) {
        createPayment(db, {...exemplarPayment, at_date: dateToSql(date)});
      }
      setScheduleApplied(db, untilDate, schedule.id);
    })();
  }
}
