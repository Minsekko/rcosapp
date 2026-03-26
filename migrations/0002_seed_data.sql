-- ============================================================
-- CosmoFactory MES - 샘플 데이터
-- ============================================================

-- 로봇 데이터
INSERT OR IGNORE INTO robots (id, name, type, zone, status, efficiency, uptime, speed, load, unit) VALUES
  ('R001', '원료 투입 로봇 A',     'industrial', '원료 혼합', 'running',     98, 99.2, 95,  180,  'kg/batch'),
  ('R002', '원료 투입 로봇 B',     'industrial', '원료 혼합', 'running',     97, 98.8, 92,  165,  'kg/batch'),
  ('R003', '델타 로봇 (병 정렬)', 'industrial', '충진 라인', 'running',     99, 99.5, 280, 0.05, '개/분'),
  ('R004', '스카라 로봇 (용기 투입)', 'industrial', '충진 라인', 'running',  98, 99.1, 240, 0.08, '개/분'),
  ('R005', '캡핑 로봇 (다관절)', 'industrial', '충진 라인', 'maintenance',  0, 97.3, 0,   0,    '개/분'),
  ('R006', '협동 로봇 - 라벨링 A', 'cobot',     '라벨링',   'running',     94, 96.5, 45,  0.3,  '개/분'),
  ('R007', '협동 로봇 - 라벨링 B', 'cobot',     '라벨링',   'running',     93, 96.2, 43,  0.3,  '개/분'),
  ('R008', '협동 로봇 - 세트 포장','cobot',     '세트 포장','running',     91, 95.8, 28,  0.5,  '개/분'),
  ('R009', '협동 로봇 - 품질 검사','cobot',     '품질 검사','running',     96, 97.1, 55,  0.2,  '개/분'),
  ('R010', '박스 적재 로봇 A',     'industrial', '팔레타이징','running',    97, 98.4, 85,  15,   '박스/분'),
  ('R011', '팔레타이징 로봇 B',   'industrial', '팔레타이징','idle',        0, 98.1, 0,   0,    '박스/분');

-- 생산 라인 데이터
INSERT OR IGNORE INTO production_lines (name, product, status, count, target, speed) VALUES
  ('스킨케어 메인 라인', '토너 200ml',     'running', 18450, 20000, 245),
  ('로션 라인',         '로션 150ml',     'running', 15870, 16000, 198),
  ('한정판 라인',       '추석 선물 세트', 'running',  8200,  9000,  28),
  ('맞춤형 소량 라인', '개인 맞춤 세럼', 'running',  5800,  5000,  12);

-- 시간대별 생산량
INSERT OR IGNORE INTO hourly_production (hour, count, date) VALUES
  ('08:00', 4820, date('now')),
  ('09:00', 5100, date('now')),
  ('10:00', 5350, date('now')),
  ('11:00', 5200, date('now')),
  ('12:00', 4600, date('now')),
  ('13:00', 5050, date('now')),
  ('14:00', 5180, date('now')),
  ('15:00', 5320, date('now')),
  ('16:00', 5180, date('now')),
  ('17:00', 2520, date('now'));

-- 오늘 통계
INSERT OR IGNORE INTO today_stats (total, target, defect, defect_rate, efficiency, date) VALUES
  (48320, 50000, 127, 0.26, 96.6, date('now'));

-- 알람 데이터
INSERT OR IGNORE INTO alarms (id, time, level, robot, message, zone) VALUES
  (1, '17:23', 'error',   'R005 캡핑 로봇',         '토크 센서 이상 감지 - 유지보수 필요',        '충진 라인'),
  (2, '16:45', 'warning', 'R006 협동로봇 라벨링 A',  '라벨 공급 잔량 15% 미만',                   '라벨링'),
  (3, '15:30', 'warning', 'R003 델타 로봇',          '속도 90% 이하로 저하 감지',                 '충진 라인'),
  (4, '14:12', 'info',    'R009 품질검사 로봇',       '불량품 10개 연속 감지 → 작업자 확인 완료', '품질 검사'),
  (5, '13:05', 'info',    'MES 시스템',              '한정판 라인 작업 지시 전환 완료',           '전체');

-- MES 주문 데이터
INSERT OR IGNORE INTO orders (id, product, qty, type, line, status, progress, due_date) VALUES
  ('ORD-2024-0891', '토너 200ml (화이트닝)',    20000, 'mass',    '스킨케어 메인 라인', 'running',   92, '오늘 18:00'),
  ('ORD-2024-0892', '로션 150ml (모이스처)',    16000, 'mass',    '로션 라인',         'running',   99, '오늘 17:30'),
  ('ORD-2024-0893', '추석 선물 세트 (5종)',      9000, 'limited', '한정판 라인',       'running',   91, '내일 09:00'),
  ('ORD-2024-0894', '개인 맞춤 세럼 (35종)',     5000, 'custom',  '맞춤형 소량 라인',  'running',  116, '오늘 16:00'),
  ('ORD-2024-0895', '크림 50ml (안티에이징)',   12000, 'mass',    '스킨케어 메인 라인','pending',    0, '내일 14:00'),
  ('ORD-2024-0896', '설 선물 세트 (3종)',        3000, 'limited', '한정판 라인',       'pending',    0, '모레 09:00');

-- PLC 탱크 데이터
INSERT OR IGNORE INTO plc_tanks (id, name, status, temperature, pressure, agitation_speed, fill_level, recipe, phase, time_remaining, batch_id, operator, start_time) VALUES
  ('TK-101', '수상 믹싱 탱크 A',     'mixing',   72.3, 1.82, 145,  79.0, 'R-TONER-WH-200', '교반 혼합',    26, 'BT-2024-0891-A', '김담당', '08:00'),
  ('TK-102', '수상 믹싱 탱크 B',     'mixing',   58.7, 1.21, 80,   41.0, 'R-LOTION-MO-150','가열 중',      71, 'BT-2024-0892-A', '이담당', '09:00'),
  ('TK-201', '유상 믹싱 탱크 A',     'idle',     80.1, 2.01, 60,  100.0, 'R-CREAM-AA-50',  '완료',          0, 'BT-2024-0893-A', '박담당', '06:30'),
  ('TK-202', '유상 믹싱 탱크 B',     'idle',     24.5, 0.00, 0,    0.0,  '—',              '대기',          0, '—',              '—',      '—'),
  ('TK-301', '균질화 탱크 (호모믹서)','mixing',  65.8, 2.45, 3200, 92.7, 'R-EMULSION-BASE','균질화 중',    46, 'BT-2024-0890-F', '최담당', '07:30');

-- PLC 센서 초기 이력 (각 탱크 10건)
INSERT OR IGNORE INTO plc_sensor_log (tank_id, temperature, pressure, agitation_speed, fill_level) VALUES
  ('TK-101', 71.8, 1.80, 143, 75.0), ('TK-101', 72.0, 1.81, 144, 76.0),
  ('TK-101', 72.1, 1.81, 145, 77.0), ('TK-101', 72.3, 1.82, 145, 78.0),
  ('TK-101', 72.4, 1.82, 146, 78.5), ('TK-101', 72.3, 1.83, 145, 79.0),
  ('TK-101', 72.2, 1.82, 145, 79.0), ('TK-101', 72.3, 1.82, 145, 79.0),
  ('TK-101', 72.4, 1.81, 146, 79.0), ('TK-101', 72.3, 1.82, 145, 79.0),
  ('TK-301', 65.2, 2.40, 3180, 90.0), ('TK-301', 65.4, 2.42, 3190, 91.0),
  ('TK-301', 65.6, 2.43, 3200, 91.5), ('TK-301', 65.8, 2.44, 3200, 92.0),
  ('TK-301', 65.9, 2.45, 3200, 92.5), ('TK-301', 65.8, 2.45, 3200, 92.7),
  ('TK-301', 65.7, 2.44, 3195, 92.7), ('TK-301', 65.8, 2.45, 3200, 92.7),
  ('TK-301', 65.9, 2.45, 3205, 92.7), ('TK-301', 65.8, 2.45, 3200, 92.7);
