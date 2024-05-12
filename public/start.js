// start.js (Worker)

self.addEventListener('message', function(event) {
  if (event.data && event.data.action === 'start') {
      // Inicia o servidor
      const { exec } = require('child_process');
      const serverProcess = exec('node server.js');

      // Registra saída do servidor no console do worker
      serverProcess.stdout.on('data', (data) => {
          self.postMessage({ type: 'log', data: data.toString() });
      });

      serverProcess.stderr.on('data', (data) => {
          self.postMessage({ type: 'error', data: data.toString() });
      });
  }
});

