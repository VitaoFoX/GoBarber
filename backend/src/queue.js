import 'dotenv/config';
// carrega todas as variaves embiante para process.env

import Queue from './lib/Queue';

Queue.processQueue();

// é executado fora do processo principal. -> Ver o package.json
