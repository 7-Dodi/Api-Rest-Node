import express from 'express';
import {v4 as uuidv4} from 'uuid';
const app = express();
app.use(express.json());

app.listen(5000, ()=>{
    console.log("Servidor funcionando na porta 5000");
})