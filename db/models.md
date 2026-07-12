# Application models

## Currency

Table `currencies`
- `id` INTEGER PRIMARY KEY
- `iso_code` TEXT
- `symbol` TEXT

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
- `order_number` INTEGER

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


## PaymentSchedule

Table `payment_schedules`
- `id` INTEGER PRIMARY KEY
- `type` TEXT
- `number` INTEGER
- `applied_until` TEXT
- `date_start` TEXT
- `date_end` TEXT

Повторяющиеся платежи. Порождает конкретные в заданных числах, привязанные к нему


## PaymentCategory

Table `payment_categories`
- `id` INTEGER PRIMARY KEY
- `name` TEXT
- `color` TEXT
- `n_order` INTEGER

Категории платежей


## Payment

Table `payments`
- `id` INTEGER PRIMARY KEY
- `description` TEXT
- `at_date` TEXT
- `amount` REAL
- `currency_id` INTEGER
- `account_id` INTEGER
- `schedule_id` INTEGER REFERENCES payment_schedules(id)
- `category_id` INTEGER REFERENCES payment_categories(id)

Запланированный платёж (в случае положительного `amount`) или доход (отрицательный `amount`)
