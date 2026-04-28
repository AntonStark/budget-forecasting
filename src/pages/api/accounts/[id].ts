import {Database} from "better-sqlite3";
import {NextApiRequest, NextApiResponse} from "next";

import {connect} from "@/utils/database";
import {accountToJsonShort} from "@/schema/account";

let db: Database = null

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log(req)
    const { id } = req.query;
    console.log(`${req.method} /api/account/${id}/`, req.body);

    if (req.method === "PATCH") {
        db = await connect(db)
        try {
            handleUpdateAccount(req, res, db);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({error: true});
            throw err;
        }
    }
}

function handleUpdateAccount(req: NextApiRequest, res: NextApiResponse, db: Database) {
    const { id } = req.query
    const {in_use} = req.body

    db.prepare("UPDATE accounts SET in_use = ? WHERE id = ?").run([in_use, id]);

    const account = db.prepare(`
        SELECT *
        FROM accounts
                 JOIN currencies on accounts.currency_id = currencies.id
        WHERE accounts.id = ?
    `).get([id]);

    if (account) {
        res.status(200).json(accountToJsonShort(account))
    }
    else {
        res.status(404).json({error: true})
    }
}
