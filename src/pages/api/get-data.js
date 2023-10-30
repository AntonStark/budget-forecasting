export default (req, res) => {
    res.status(200).json({
        dates: ['2023-10-11', '2023-10-12', '2023-10-13', '2023-10-15'],
        accounts: [
            {
                name: 'rub',
                balances: [100, 90, 70, 60],
            },
            {
                name: 'usd',
                balances: [50, 48, 45, 44],
            }
        ]
    })
}
