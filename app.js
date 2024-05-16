import express from 'express';
import characterRouter from './routes/characters.router.js';
import errorHandlerMiddleware from './middlewares/error-handler.middleware.js';
import errorHandlerNormal from './middlewares/error-handler.js';
import connect from './schemas/index.js';
import itemRouter from './routes/items.router.js';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'Frontend')));




const router = express.Router();

router.get('/', (req, res)=>{
    return res.json({message:'HI'})
})


app.use('/api', [router, characterRouter, itemRouter]);
// 에러 처리 미들웨어를 등록한다.
app.use(errorHandlerMiddleware);
app.use(errorHandlerNormal);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
