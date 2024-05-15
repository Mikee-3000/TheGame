CREATE TABLE game (
  id SERIAL PRIMARY KEY,
  start_rl_timestamp BIGINT,
  end_rl_timestamp BIGINT,
  result VARCHAR(255)
);

CREATE TABLE exchange (
  id SERIAL PRIMARY KEY,
  game_id INTEGER REFERENCES game(id)
);

CREATE TABLE system_prompt (
  id SERIAL PRIMARY KEY,
  content TEXT
);

CREATE TABLE message (
  id SERIAL PRIMARY KEY,
  exchange_id INTEGER REFERENCES exchange(id),
  system_prompt_id INTEGER REFERENCES system_prompt(id),
  rl_timestamp BIGINT,
  gt_timestamp BIGINT,
  role VARCHAR(255),
  content TEXT
);

CREATE TABLE metrics (
  id SERIAL PRIMARY KEY,
  message_id INTEGER REFERENCES message(id),
  population INTEGER,
  consumption FLOAT,
  investment FLOAT,
  net_export FLOAT,
  government_income FLOAT,
  government_debt FLOAT,
  money_supply FLOAT,
  aggregate_demand FLOAT
);

CREATE TABLE policy_setting (
  id SERIAL PRIMARY KEY,
  message_id INTEGER REFERENCES message(id),
  interest_rate FLOAT,
  government_spending FLOAT,
  open_market_operations FLOAT,
  individual_income_tax FLOAT,
  corporate_income_tax FLOAT
);