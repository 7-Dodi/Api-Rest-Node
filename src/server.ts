import express from 'express';
import {v4 as uuidv4} from 'uuid';
import {User, Technologies} from './user/types'; //Importando os tipos
import { updateData, getdataBaseArray } from './data/database';
const app = express();
app.use(express.json());

app.get("/users", (req, res)=>{
    res.status(201).json(getdataBaseArray());
});

app.listen(5000, ()=>{
    console.log("Servidor funcionando na porta 5000");
})