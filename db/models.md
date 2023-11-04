# Application models

## Currency

Table `currencies`
- `id` INTEGER PRIMARY KEY
- `iso_code` TEXT

Обозначает валюту

## Account

Table `accounts`
- `id` INTEGER PRIMARY KEY
- `title` TEXT
- `currency_id` INTEGER
- `created_at` TEXT

Обозначает счёт

## AccountDateBalance

Table `account_date_balances`
- `id` INTEGER PRIMARY KEY
- `account_id` INTEGER
- `at_date` TEXT
- `value` REAL

Данные об остатке на счету в заданную дату

## OneTimePayment

Table `one_time_payments`
- `id` INTEGER PRIMARY KEY
- `account_id` INTEGER
- `at_date` TEXT
- `amount` REAL
- `description` TEXT

Запланированный платёж (в случае положительного `amount`) или доход (отрицательный `amount`)
