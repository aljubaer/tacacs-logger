const events = require('events');
const fs = require('fs');
const readline = require('readline');
const db = require('./dbOp');

const connection = db.connection;

(async function processLineByLine() {
  try {
    const rl = readline.createInterface({
      input: fs.createReadStream('./tac_plus.acct'),
      crlfDelay: Infinity
    });

    const entryType = (entry) => {
      if (entry.includes('login-service')) {
        return 'login'
      } else if (entry.includes('cmd')) {
        return 'cmd'
      } else {
        return 'other'
      }
    }

    const getRecordFromEntry = (attrs, type) => {
      const record = {
        log_time: attrs[0],
        dest_ip: attrs[1],
        user: attrs[2],
        src_ip: attrs[4],
        type: type
      }

      attrs.forEach(r => {
        if (r.includes('service')) {
          record.service = r.split('=')[1]
        } else if (r.includes('task_id')) {
          record.task_id = r.split('=')[1]
        }
      })

      return record;
    }

    const getLoginInfo = (attrs) => {
      const record = {}

      attrs.forEach(r => {
        if (r.includes('login-service')) {
          record.login_service = r.split('=')[1]
        } else if (r.includes('protocol')) {
          record.protocol = r.split('=')[1]
        } else if (r.includes('login-ip-addr-host')) {
          record.login_ip_addr_host = r.split('=')[1]
        } else if (r.includes('login-tcp-port')) {
          record.login_tcp_port = r.split('=')[1]
        } else if (r.includes('pre-session-time')) {
          record.pre_session_time = r.split('=')[1]
        }
      })

      return record;
    }

    const getCommand = (attrs) => {
      let record;

      attrs.forEach(r => {
        if (r.includes('cmd')) {
          record = r.split('=')[1]
          const rs = record.split(' ');
          rs.pop();
          record = rs.join(' ')
        }
      })

      return record;
    }

    rl.on('line', (line) => {
      console.log(`Line from file: ${line}`);

      const attrs = line.split('\t');

      const type = entryType(line)

      const record = getRecordFromEntry(attrs, type);

      connection.query(`INSERT INTO records (log_time, dest_ip, user, src_ip, service, task_id, type) VALUES (?,?,?,?,?,?,?)`,
        [record.log_time, record.dest_ip, record.user, record.src_ip, record.service, record.task_id, record.type],
        (error, recordResults) => {
          if (error) {
            console.log(error);
            return;
          }
          console.log(recordResults);
          if (type === 'login') {

            const loginInfo = getLoginInfo(attrs);

            connection.query(`INSERT INTO login_records (record_id, login_service, protocol, login_ip_addr_host, login_tcp_port, pre_session_time) VALUES (?,?,?,?,?,?)`,
              [recordResults.insertId, loginInfo.login_service, loginInfo.protocol, loginInfo.login_ip_addr_host, loginInfo.login_tcp_port, loginInfo.pre_session_time],
              (error, results) => {
                if (error) {
                  console.log(error);
                  return;
                }
                console.log(results.insertId);
              });
          } else if (type === 'cmd') {

            const command = getCommand(attrs);

            connection.query(`INSERT INTO commands (record_id, command) VALUES (?,?)`,
              [recordResults.insertId, command],
              (error, cmdResults) => {
                if (error) {
                  console.log(error);
                  return;
                }
                console.log(cmdResults.insertId);
              });
          }
        })
    });

    await events.once(rl, 'close');

    console.log('Reading file line by line with readline done.');
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
  } catch (err) {
    console.error(err);
  }
})();
