import dotenv from 'dotenv';
import app from './server';

const { NODE_ENV } = process.env;

dotenv.config();

const PORT = process.env.PORT || 8080;

if (NODE_ENV !== 'test')
    app.listen(PORT, () => console.log(`Server running on port ${PORT} :)`));
