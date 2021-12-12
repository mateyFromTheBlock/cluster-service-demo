import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
// import agendash from './routes/agendash';
import geo from '@/api/routes/geo';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  auth(app);
  user(app);
  // agendash(app);
  geo(app);

  return app;
};
