import path from 'node:path';
import config from 'config';
import fastify from 'fastify';
import fastifyHelmet from 'fastify-helmet';
import fastifyPostgres from 'fastify-postgres';
import fastifySensible from 'fastify-sensible';
import fastifyStatic from 'fastify-static';
import api from './routes/api.js';

const ADDRESS = config.address;
const PORT = config.port;
const PG_USER = config.pgUser;
const PG_PASSWORD = config.pgPass;
const PG_PORT = config.pgPort;
const PG_ADDRESS = config.pgAddress;
const PG_CONNECTION_STRING = `postgresql://${PG_USER}:${PG_PASSWORD}@${PG_ADDRESS}:${PG_PORT}/brick_store_coursework`;
const app = fastify();

(async () => {
  await app.register(fastifyHelmet, {contentSecurityPolicy: false});
  await app.register(fastifyPostgres, {
    connectionString: PG_CONNECTION_STRING,
  });

  await app.register(fastifySensible);
  await app.register(fastifyStatic, {
    prefix: '/public/',
    root: path.join(__dirname, '../../dist/public'),
  });

  app.get('*', async (request, reply) => {
    await reply.sendFile('index.html');
  });

  await app.register(api, {prefix: '/api'});

  try {
    await app.listen(PORT, ADDRESS);
  } catch (error) {
    console.debug(error);
    return;
  }

  console.debug(`Listening at http://${ADDRESS}:${PORT}`);
})();
