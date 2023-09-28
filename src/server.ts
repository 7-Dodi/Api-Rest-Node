import express from 'express';
import {v4 as uuidv4} from 'uuid';
import {User, Technologies} from './user/types'; //Importando os tipos
import { updateData, getdataBaseArray } from './data/database';
import { checkExistsUserAccount, CustomRequest } from './middleware/checkExistsUserAccount'; //Importando o Middleware
const app = express();
app.use(express.json());

//Metódo get: (User)
app.get("/users", (req, res)=>{
    res.status(200).json(getdataBaseArray());
});

//Método post: (User)
app.post("/users", (req, res)=>{
    const {name, username} = req.body;
    const userNameExist = getdataBaseArray().some((item) => item.userName === username);
    //Confirmando se o userName já existe ou não:
    if(userNameExist){
        res.status(400).json({"error": "Existing UserName"});
    }else{
        //Criando User:
        const newUser:User = {
            id: uuidv4(),
            name : name,
            userName: username,
            technologies: [],
        }
        //Atualizando o dataBase:
        updateData(newUser);
        res.status(201).json(newUser);
    }
});

//Método get: (Technologies)
app.get("/technologies", checkExistsUserAccount, (req: CustomRequest, res)=>{
    const {user} = req; //Retorna o username
    const userName = getdataBaseArray().find((item) => item.userName === user?.username);
    //Confirmando se o userName exista ou não:
    if(!userName){
        res.status(400).json({"error": "This UserName does not exist"});
    }else{
        res.status(200).json(userName.technologies);
    }
});

//Método post: (Technologies)
app.post("/technologies", checkExistsUserAccount, (req:CustomRequest, res)=>{
    const {user} = req;
    const {title, deadline} = req.body;

    const userNameExist = getdataBaseArray().find((item) => item.userName === user?.username);
    //Confirmando se o userName já existe ou não:
    if(!userNameExist){
        res.status(400).json({"error": "This UserName does not exist"});
    }else{
        const newTecnology: Technologies = {
            id: uuidv4(),
            title : title,
            studied : false,
            deadline: new Date(deadline),
            created_at: new Date(),
        }
    
        userNameExist.technologies.push(newTecnology);
        res.status(201).json(newTecnology);
    }
});

app.listen(5000, ()=>{
    console.log("Servidor funcionando na porta 5000");
})