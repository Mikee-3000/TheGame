CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  start_rl_timestamp BIGINT NOT NULL,
  end_rl_timestamp BIGINT,
  result VARCHAR(255)
);

CREATE TABLE exchanges (
  id SERIAL PRIMARY KEY,
  game_id INTEGER REFERENCES games(id) NOT NULL
);

CREATE TABLE system_prompts (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  exchange_id INTEGER REFERENCES exchanges(id) NOT NULL,
  system_prompt_id INTEGER REFERENCES system_prompts(id),
  rl_timestamp BIGINT NOT NULL,
  gt_timestamp BIGINT NOT NULL,
  role VARCHAR(255) NOT NULL,
  content TEXT,
  message_json JSONB NOT NULL
);

CREATE TABLE metrics (
  id SERIAL PRIMARY KEY,
  message_id INTEGER REFERENCES messages(id) NOT NULL,
  population INTEGER NOT NULL,
  consumption FLOAT NOT NULL,
  investment FLOAT NOT NULL,
  net_export FLOAT NOT NULL,
  government_income FLOAT NOT NULL,
  government_debt FLOAT NOT NULL,
  money_supply FLOAT NOT NULL,
  aggregate_demand FLOAT NOT NULL
);

CREATE TABLE policy_settings (
  id SERIAL PRIMARY KEY,
  message_id INTEGER REFERENCES messages(id) NOT NULL,
  interest_rate FLOAT NOT NULL,
  government_spending FLOAT NOT NULL,
  open_market_operations FLOAT NOT NULL,
  individual_income_tax FLOAT NOT NULL,
  corporate_income_tax FLOAT NOT NULL
);