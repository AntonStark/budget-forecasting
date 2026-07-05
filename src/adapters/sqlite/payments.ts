import {Database} from "better-sqlite3";

import {PaymentCategorySchema, PaymentData, PaymentInSchema, PaymentSchedule, ScheduleShortSchema} from "@/types";
import {dateToSql} from "@/utils/dates";
import {generateScheduleDates} from "@/domain";


export function createPayment(db: Database, item: PaymentInSchema) {
  const insert = db.prepare(
    `INSERT INTO payments (amount, description, at_date, schedule_id, category_id) VALUES (?, ?, ?, ?, ?);`
  );
  insert.run(item.amount, item.description, item.at_date, item.schedule_id || null, item.categoryId || null);
}

export function updatePayment(
  db: Database,
  amount: number | undefined,
  description: string | undefined,
  at_date: string | undefined,
  categoryId: number | undefined,
  id: number
) {
  if (amount === undefined && description === undefined && at_date === undefined) {
    return;
  }

  const setClauseParts: string[] = [];
  const runArgs: (string | number | null)[] = [];
  if (amount !== undefined) {
    setClauseParts.push('amount = ?');
    runArgs.push(amount);
  }
  if (description !== undefined) {
    setClauseParts.push('description = ?');
    runArgs.push(description);
  }
  if (categoryId !== undefined) {
    setClauseParts.push('category_id = ?');
    runArgs.push(categoryId > 0 ? categoryId : null);
  }
  if (at_date !== undefined) {
    setClauseParts.push('at_date = ?');
    runArgs.push(at_date);
  }

  db.prepare(`UPDATE payments SET ${setClauseParts.join(', ')} WHERE id = ?;`).run(...runArgs, id);
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
    if (!scheduleRes) {
      return;
    }
    // console.log('scheduleRes', scheduleRes);
    createPayment(db, {...paymentParams, schedule_id: scheduleRes.id});
    setScheduleApplied(db, paymentParams.at_date, scheduleRes.id);
  })();
}

export function listPayments(db: Database, dateStart: string, dateEnd: string): PaymentData[] {
  const stmt = db.prepare<any, PaymentData>(`
    SELECT 
        p.id, p.description, p.at_date, p.amount, p.account_id, 
        cat.id as category_id, cat.name as category_name, cat.color as category_color,
        cur.iso_code as currency_iso_code, cur.symbol as currency_symbol,
        ps.type as schedule_type, ps.number as schedule_number, ps.date_start as schedule_date_start
    FROM payments p
    LEFT JOIN payment_categories cat on p.category_id = cat.id
    LEFT JOIN currencies cur on p.currency_id = cur.id
    LEFT JOIN payment_schedules ps on p.schedule_id = ps.id
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
        p.description, p.at_date, p.amount, p.schedule_id
    FROM payments p
    WHERE p.schedule_id = ?
    ORDER BY p.at_date DESC 
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
    if (!exemplarPayment) {
      throw Error(`Not found exemplarPayment for schedule.id=${schedule.id}`);
    }
    db.transaction(() => {
      for (const date of dates) {
        createPayment(db, {...exemplarPayment, at_date: dateToSql(date)});
      }
      setScheduleApplied(db, untilDate, schedule.id);
    })();
  }
}


export function listPaymentCategories(db: Database): PaymentCategorySchema[] {
  const stmt = db.prepare<[], PaymentCategorySchema>(`
    SELECT cat.id, cat.name, cat.color FROM payment_categories cat;
  `);
  const categories = stmt.all();
  return categories;
}
