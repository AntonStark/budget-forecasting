import {Database} from "better-sqlite3";
import {NextApiRequest, NextApiResponse} from "next";

import {connect} from "@/utils/database";
import {saveBalance} from "@/sqlite/balances";

let db: Database = null

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log(req)
    console.log('POST /api/balance/', req.body)
    const {account_id, at_date, value} = req.body

    db = await connect(db)

    try {
        saveBalance(db, account_id, at_date, value);
        res.status(200).json({value: value});
    }
    catch (err) {
        console.error(err);
        res.status(500).json({error: true});
        throw err;
    }
}
