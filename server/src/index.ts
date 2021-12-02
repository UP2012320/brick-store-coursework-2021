import fastify from 'fastify';
import api from './routes/api.js';

const PORT = 8080;
const app = fastify();

app.register(api, {prefix: '/api'});

app.listen(PORT, (err, address) => {
  console.debug(`Listening at ${address}`);
});
