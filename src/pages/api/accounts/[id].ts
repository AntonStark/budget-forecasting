import {Database} from "sqlite";
import {NextApiRequest, NextApiResponse} from "next";

import {connect} from "@/utils/database";
import {accountToJsonShort} from "@/schema/account";

let db: Database = null

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log(req)
    const { id } = req.query
    const {in_use} = req.body
    console.log(`${req.method} /api/account/${id}/`, req.body)

    db = await connect(db)

    if (req.method === "PATCH") {
        await db.run(`
            UPDATE accounts
            SET in_use = ?
            WHERE id = ?
        `, [in_use, id]
        ).then(async (result) => {
            await db.all(`
                SELECT * FROM accounts
                JOIN currencies on accounts.currency_id = currencies.id
                WHERE accounts.id = ?
            `, [id]
            ).then((accounts) => {
                if (accounts.length > 0) {
                    res.status(200).json(accountToJsonShort(accounts[0]))
                }
                else {
                    res.status(404).json({error: true})
                }
            }, (err) => {
                console.error(err.message)
                res.status(500).json({error: true})
                throw err
            })
        })
    }
}
