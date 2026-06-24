import './config/env'; 
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/database';
import { corsOptions } from './config/cors';
import { env } from './config/env';
import routes from './routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 200,
    message: { success: false, message: 'Muitas requisições. Tente novamente em breve.' },
  })
);

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true }));

if (env.isDev) app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ status: 'ok', env: env.NODE_ENV }));

app.use('/api', routes);

app.use((_req, res) => res.status(404).json({ success: false, message: 'Rota não encontrada' }));

app.use(errorMiddleware);

const start = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`🚀 Server rodando em http://localhost:${env.PORT}`);
    console.log(`📡 API: http://localhost:${env.PORT}/api`);
    console.log(`🌿 Ambiente: ${env.NODE_ENV}`);
  });
};

start();