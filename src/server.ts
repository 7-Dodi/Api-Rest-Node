import express from 'express';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors());

import {userRouter} from './routes/userRouter';
import {userRouter as technologiesRouter} from './routes/technologiesRouter';

app.use('/users', userRouter); //Rotas da technologies
app.use('/technologies', technologiesRouter);

app.listen(5000, () => {
    console.log("Servidor funcionando na porta 5000");
})