import express from 'express';
import {v4 as uuidv4} from 'uuid';
const app = express();
app.use(express.json());

//Construindo os tipos:
type Technologies = {
    id: string;
    title: string;
    studied: boolean;
    deadline: Date;
    created_at: Date;
}

type User = {
    id: string;
    name: string;
    userName: string;
    technologies: Technologies[];
}

app.listen(5000, ()=>{
    console.log("Servidor funcionando na porta 5000");
})