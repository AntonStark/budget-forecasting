# Application models

## Currency

Table `currencies`
- `id` INTEGER PRIMARY KEY
- `iso_code` TEXT

Обозначает валюту
Содержит:
- 1, USD
- 2, RUB
- 3, EUR

## Account

Table `accounts`
- `id` INTEGER PRIMARY KEY
- `title` TEXT
- `currency_id` INTEGER
- `created_at` TEXT
- `in_use` INTEGER DEFAULT TRUE
- `is_saving_account` INTEGER DEFAULT FALSE

Обозначает счёт

## AccountGroupsByCurrency

Table `accounts_group_by_currency`
- `id` INTEGER PRIMARY KEY
- `currency_id` INTEGER
- `order_number` INTEGER
- `in_use` INTEGER DEFAULT TRUE

Содержит дополнительную информацию для группировки счетов по валютам

## AccountDateBalance

Table `account_date_balances`
- `id` INTEGER PRIMARY KEY
- `account_id` INTEGER
- `at_date` TEXT
- `value` REAL
Index `account_date_balances_account_id_at_date on (account_id, at_date)`

Данные об остатке на счету в заданную дату

## OneTimePayment

Table `one_time_payments`
- `id` INTEGER PRIMARY KEY
- `account_id` INTEGER
- `at_date` TEXT
- `amount` REAL
- `description` TEXT

Запланированный платёж (в случае положительного `amount`) или доход (отрицательный `amount`)
