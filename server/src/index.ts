import fastify from 'fastify';
import api from './routes/api.js';
import fastifyHelmet from 'fastify-helmet';
import fastifyPostgres from 'fastify-postgres';
import fastifySensible from 'fastify-sensible';
import fastifyStatic from 'fastify-static';
import path from 'path';

const PORT = process.env.PORT || 8080;
const PG_CONNECTION_STRING =
  process.env.PG_CONNECTION_STRING ||
  'postgresql://brick_store_user:y*_dwYx7CkTbaQQ!@localhost:5432/brick_store_coursework';
const app = fastify();

app.register(fastifyHelmet, {contentSecurityPolicy: false});
app.register(fastifyPostgres, {
  connectionString: PG_CONNECTION_STRING,
});
app.register(fastifySensible);
app.register(fastifyStatic, {
  prefix: '/public/',
  root: path.join(__dirname, '../../dist/public'),
});

app.get('*', (request, reply) => {
  reply.sendFile('index.html');
});

app.register(api, {prefix: '/api'});

app.listen(PORT, (err, address) => {
  if (err) {
    console.debug(err);
    return;
  }

  console.debug(`Listening at ${address}`);
});
