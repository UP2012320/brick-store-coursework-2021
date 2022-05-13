import path from 'node:path';
// eslint-disable-next-line
import fastifyAuth0Verify from 'fastify-auth0-verify';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyMultipart from '@fastify/multipart';
import fastifyPostgres from '@fastify/postgres';
import fastifySensible from '@fastify/sensible';
import fastifyStatic from '@fastify/static';
import fastifySwagger from '@fastify/swagger';
import ajvErrors from 'ajv-errors';
import fastify from 'fastify';
import config from './config';
import api from './routes/api';

const ADDRESS = config.address;
const PORT = config.port;
const PG_USER = config.pgUser;
const PG_PASSWORD = config.pgPass;
const PG_PORT = config.pgPort;
const PG_ADDRESS = config.pgAddress;
const PG_CONNECTION_STRING = `postgresql://${PG_USER}:${PG_PASSWORD}@${PG_ADDRESS}:${PG_PORT}/brick_store_coursework`;

const app = fastify({ajv: {
  customOptions: {
    allErrors: true,
    jsonPointers: true,
  },
  // eslint-disable-next-line
  plugins: [ajvErrors],
}});

(async () => {
  await app.register(fastifySwagger, {
    exposeRoute: true,
    routePrefix: '/documentation',
    swagger: {
      info: {
        description: 'API for Brick Store',
        title: 'Brick Store API',
        version: '1.0.0',
      },
    },
  });
  await app.register(fastifyHelmet, {contentSecurityPolicy: false});
  await app.register(fastifyCors, {origin: config.dev ? 'http://localhost:8080' : 'http://localhost:8085'});
  await app.register(fastifyPostgres, {
    connectionString: PG_CONNECTION_STRING,
  });
  await app.register(fastifyAuth0Verify, {
    audience: config.audience,
    domain: config.domain,
  });

  await app.register(fastifyMultipart, {
    limits: {
      fileSize: 10 * 1_024 * 1_024,
    },
  });
  await app.register(fastifySensible);
  await app.register(fastifyStatic, {
    prefix: '/public/',
    root: path.join(__dirname, '../../dist/public'),
  });

  app.get('*', async (request, reply) => {
    await reply.sendFile('index.html');
  });

  await app.register(api, {prefix: '/api/v1'});

  try {
    await app.listen(PORT, ADDRESS);
  } catch (error) {
    console.debug(error);
    return;
  }

  console.debug(`Listening at http://${ADDRESS}:${PORT}`);
})();
