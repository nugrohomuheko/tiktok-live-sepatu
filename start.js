// start.js
const { spawn } = require('child_process');

function run(script) {
  const proc = spawn('node', [script], { stdio: 'inherit' });
  proc.on('close', (code) => {
    console.log(`❌ ${script} berhenti dengan kode: ${code}`);
  });
}

run('obs-controller.js');
run('server.js');
run('tiktok-listener.js');
