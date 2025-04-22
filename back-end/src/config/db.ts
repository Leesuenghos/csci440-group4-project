// sets up a connection to postgres using a connection pool

import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'threatdb'
});

export default pool;


/*
-- connect to postgres database
psql 

-- create a new user with password
alter user postgres with password 'NewStrongPass123';

-- create a new database
create database threatdb;

-- connect to the new database
\c threatdb

-- create tables for threat detection and DDoS simulation
create table if not exists threat_events (
  id serial primary key,
  type varchar(50) not null,
  source_ip varchar(50),
  dest_ip varchar(50),
  severity varchar(20),
  event_time timestamp default now()
);

create table if not exists ddos_simulations (
  id serial primary key,
  target_ip varchar(50) not null,
  port integer not null,
  method varchar(20) not null,
  threads integer not null,
  duration integer not null, -- in seconds
  start_time timestamp default now(),
  end_time timestamp
);


*/