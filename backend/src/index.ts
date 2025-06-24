import express from 'express';
import { setRoutes } from './routes/main.route';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

setRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});