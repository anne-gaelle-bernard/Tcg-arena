-- Create role table
CREATE TABLE IF NOT EXISTS role (
  role_id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- Create player table
CREATE TABLE IF NOT EXISTS player (
  player_id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  mail VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255),
  level INT DEFAULT 1,
  role_id INT NOT NULL REFERENCES role(role_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_player_mail ON player(mail);
CREATE INDEX IF NOT EXISTS idx_player_role_id ON player(role_id);
