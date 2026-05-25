import {Database} from "better-sqlite3";
import {NextApiRequest, NextApiResponse} from "next";

import {generateScheduleDates} from "@/domain";
import {createScheduledPayment} from "@/sqlite/payments";
import {connect} from "@/utils/database";
import {dateToSql} from "@/utils/dates";

let db: Database = null

export default async (req: NextApiRequest, rep: NextApiResponse) => {
  if (req.method === 'POST') {
    handleCreate(req, rep);
  }
}

function handleCreate(req: NextApiRequest, res: NextApiResponse) {
  console.log('POST /api/payments/with_schedule');
  const {description, amount, schedule} = req.body;

  db = connect(db);

  // для создания расписания надо завести следом его первый экземпляр
  const scheduleParams = {...schedule, date_start: dateToSql(new Date())}
  const exemplarDate = (generateScheduleDates(scheduleParams, undefined, 1))[0];

  createScheduledPayment(db, {description, amount, at_date: dateToSql(exemplarDate)}, scheduleParams);

  res.status(200).json(JSON.stringify({status: "OK"}));
}
