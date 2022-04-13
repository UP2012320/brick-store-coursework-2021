// Require the framework
import path from 'node:path';
import type {onRequestAsyncHookHandler} from 'fastify';
import Fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import fastifyHelmet from 'fastify-helmet';
import fastifyPostgres from 'fastify-postgres';
import fastifySensible from 'fastify-sensible';
import fastifyStatic from 'fastify-static';
import config from './config';
import base from '.';

const ADDRESS = config.address;
const PORT = config.port;
const PG_USER = config.pgUser;
const PG_PASSWORD = config.pgPass;
const PG_PORT = config.pgPort;
const PG_ADDRESS = config.pgAddress;
const PG_CONNECTION_STRING = `postgresql://${PG_USER}:${PG_PASSWORD}@${PG_ADDRESS}:${PG_PORT}/brick_store_coursework`;

// Instantiate Fastify with some config
const serverlessApp = Fastify({
  logger: true,
});

serverlessApp.register(fastifyHelmet, {contentSecurityPolicy: false});
serverlessApp.register(fastifyCors, {origin: config.dev ? 'http://localhost:8080' : false});
serverlessApp.register(fastifyPostgres, {
  connectionString: PG_CONNECTION_STRING,
});

serverlessApp.register(fastifySensible);
serverlessApp.register(fastifyStatic, {
  prefix: '/public/',
  root: path.join(__dirname, '../../dist/public'),
});

// Register your application as a normal plugin.
serverlessApp.register(base);

serverlessApp.listen(PORT, ADDRESS, (error, address) => {
  if (error) {
    serverlessApp.log.error(error);
    throw error;
  }

  serverlessApp.log.info(`Server listening at ${address}`);
});

const app: onRequestAsyncHookHandler = async (request, result) => {
  await serverlessApp.ready();
  serverlessApp.server.emit('request', request, result);
};

export default app;
