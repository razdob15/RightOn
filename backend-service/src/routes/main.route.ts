import { Router, Express } from 'express';
import { getAllItems, getItemById, createItem, updateItem, deleteItem } from '../controllers/main.controller';
import { mainTest } from '../services/main.service';

const router = Router();

export const setRoutes = (app: Express) => {
  router.get("/test", mainTest)

  router.get('/items', getAllItems);
  router.get('/items/:id', getItemById);
  router.post('/items', createItem);
  router.put('/items/:id', updateItem);
  router.delete('/items/:id', deleteItem);

  app.use('/api', router);

  return router;
};

