const db = require('./dbOp');

const connection = db.connection;

// CREATE TABLE `commands` (
//     `id` int(11) NOT NULL,
//     `record_id` int(11) NOT NULL,
//     `command` varchar(255) NOT NULL
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


// CREATE TABLE `records` (
//     `id` int(20) NOT NULL,
//     `log_time` varchar(255) NOT NULL,
//     `log_date` varchar(255) NOT NULL,
//     `user` varchar(20) NOT NULL,
//     `src_ip` varchar(20) NOT NULL,
//     `dest_ip` varchar(20) NOT NULL,
//     `service` varchar(10) NOT NULL,
//     `task_id` int(6) NOT NULL,
//     `type` varchar(20) NOT NULL
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


// CREATE TABLE `login_records` (
//     `id` int(20) NOT NULL,
//     `record_id` int(20) NOT NULL,
//     `login_service` int(10) NOT NULL,
//     `protocol` varchar(20) NOT NULL,
//     `login_ip_addr_host` varchar(20) NOT NULL,
//     `login_tcp_port` int(10) NOT NULL,
//     `pre_session_time` int(10) NOT NULL
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;