-- ============================================================
-- CosmoFactory MES - 초기 스키마
-- ============================================================

-- 로봇 테이블
CREATE TABLE IF NOT EXISTS robots (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('industrial','cobot')),
  zone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'idle' CHECK(status IN ('running','maintenance','idle','error')),
  efficiency INTEGER DEFAULT 0,
  uptime REAL DEFAULT 0,
  speed INTEGER DEFAULT 0,
  load REAL DEFAULT 0,
  unit TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 생산 라인 테이블
CREATE TABLE IF NOT EXISTS production_lines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  product TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'running',
  count INTEGER DEFAULT 0,
  target INTEGER DEFAULT 0,
  speed INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 시간대별 생산량
CREATE TABLE IF NOT EXISTS hourly_production (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hour TEXT NOT NULL,
  count INTEGER DEFAULT 0,
  date TEXT NOT NULL
);

-- 오늘 생산 통계
CREATE TABLE IF NOT EXISTS today_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  total INTEGER DEFAULT 0,
  target INTEGER DEFAULT 50000,
  defect INTEGER DEFAULT 0,
  defect_rate REAL DEFAULT 0,
  efficiency REAL DEFAULT 0,
  date TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 알람 테이블
CREATE TABLE IF NOT EXISTS alarms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  time TEXT NOT NULL,
  level TEXT NOT NULL CHECK(level IN ('error','warning','info')),
  robot TEXT NOT NULL,
  message TEXT NOT NULL,
  zone TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- MES 주문 테이블
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  product TEXT NOT NULL,
  qty INTEGER DEFAULT 0,
  type TEXT NOT NULL CHECK(type IN ('mass','limited','custom')),
  line TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('running','pending','completed','paused')),
  progress INTEGER DEFAULT 0,
  due_date TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- PLC 탱크 테이블
CREATE TABLE IF NOT EXISTS plc_tanks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'idle' CHECK(status IN ('mixing','idle','cleaning','error')),
  temperature REAL DEFAULT 0,
  pressure REAL DEFAULT 0,
  agitation_speed INTEGER DEFAULT 0,
  fill_level REAL DEFAULT 0,
  recipe TEXT DEFAULT '',
  phase TEXT DEFAULT '',
  time_remaining INTEGER DEFAULT 0,
  batch_id TEXT DEFAULT '',
  operator TEXT DEFAULT '',
  start_time TEXT DEFAULT '',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- PLC 센서 로그
CREATE TABLE IF NOT EXISTS plc_sensor_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tank_id TEXT NOT NULL,
  temperature REAL,
  pressure REAL,
  agitation_speed INTEGER,
  fill_level REAL,
  ph REAL,
  viscosity REAL,
  recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tank_id) REFERENCES plc_tanks(id)
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_hourly_date ON hourly_production(date);
CREATE INDEX IF NOT EXISTS idx_alarms_level ON alarms(level);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_sensor_tank ON plc_sensor_log(tank_id);
CREATE INDEX IF NOT EXISTS idx_sensor_time ON plc_sensor_log(recorded_at);
