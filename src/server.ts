import express from 'express';
import {v4 as uuidv4, validate as validateUuid} from 'uuid';
import {User, Technologies} from './user/types'; //Importando os tipos
import { updateData, getdataBaseArray } from './data/database';
import { checkExistsUserAccount } from './middleware/checkExistsUserAccount'; //Importando o Middleware
import { prisma } from './user/repositoryUser';

const app = express();
app.use(express.json());

//Metódo get: (User)
app.get("/users", async (req, res)=>{
    res.status(200).json(await prisma.user.findMany()); //Irá retornar todos os usuários
});

//Método post: (User)
app.post("/users", async (req, res)=>{
    const {name, username} = req.body;
    const userNameExist = (await prisma.user.findMany()).some((item) => item.userName === username);
    //Confirmando se o userName já existe ou não:
    if(userNameExist){
        res.status(404).json({"error": "Existing UserName"});
    }else{
        //Criando User:
        const newUser = await prisma.user.create({
            data:{
                id: uuidv4(),
                name: name,
                userName: username,               
            }
        })
        
        //Atualizando o dataBase:
        res.status(201).json(newUser);
    }
});

//Método get: (Technologies)
app.get("/technologies", checkExistsUserAccount, (req, res)=>{
    const {user} = req; //Retorna o username
    const userName = getdataBaseArray().find((item) => item.userName === user?.userName);
    //Confirmando se o userName exista ou não:
    if(!userName){
        res.status(404).json({"error": "This UserName does not exist"});
    }else{
        res.status(200).json(userName.technologies);
    }
});

//Método post: (Technologies)
app.post("/technologies", checkExistsUserAccount, (req, res)=>{
    const {user} = req;
    const {title, deadline} = req.body;

    const userNameExist = getdataBaseArray().find((item) => item.userName === user?.userName);
    //Confirmando se o userName já existe ou não:
    if(!userNameExist){
        res.status(404).json({"error": "This UserName does not exist"});
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

//Método put: (Technologies)
app.put("/technologies/:id", checkExistsUserAccount, (req, res)=>{
    const {user} = req;
    const {title, deadline} = req.body;
    const id = req.params.id;

    //Procurando usuário:
    const userName = getdataBaseArray().find((item) => item.userName === user?.userName);
    //Confirmando se o userName exista ou não:
    if(!userName){
        res.status(404).json({"error": "This UserName does not exist"});
    }else{
        // Verificando se o ID é um UUID válido
        if (!validateUuid(id)) {
            res.status(404).json({ "error": "Invalid UUID" });
            return;
        }
        //Procurando a tecnologia
        const existsTechnologies = userName.technologies.find((item)=> item.id === id);
        if(!existsTechnologies){
            res.status(404).json({"error": "This Technologies does not exist"});
            return;
        }
            existsTechnologies.title = title;
            existsTechnologies.deadline = new Date(deadline);
            res.status(200).json(existsTechnologies);
    }
});

//Método patch: (Technologies)
app.patch("/technologies/:id/studied", checkExistsUserAccount, (req, res)=>{
    const {user} = req;
    const id = req.params.id;

     //Procurando usuário:
     const userName = getdataBaseArray().find((item) => item.userName === user?.userName);
     //Confirmando se o userName exista ou não:
     if(!userName){
         res.status(404).json({"error": "This UserName does not exist"});
     }else{
         // Verificando se o ID é um UUID válido
         if (!validateUuid(id)) {
             res.status(404).json({ "error": "Invalid UUID" });
             return;
         }
         //Procurando a tecnologia
         const existsTechnologies = userName.technologies.find((item)=> item.id === id);
         if(!existsTechnologies){
             res.status(404).json({"error": "This Technologies does not exist"});
             return;
         }
             existsTechnologies.studied = true;
             res.status(200).json(existsTechnologies);
    }
});

//Método delete: (Technologies)
app.delete("/technologies/:id", checkExistsUserAccount, (req, res)=>{
    const {user} = req;
    const id = req.params.id;

    //Procurando usuário:
    const userName = getdataBaseArray().find((item) => item.userName === user?.userName);
    //Confirmando se o userName exista ou não:
    if(!userName){
        res.status(404).json({"error": "This UserName does not exist"});
    }else{
        // Verificando se o ID é um UUID válido
        if (!validateUuid(id)) {
            res.status(404).json({ "error": "Invalid UUID" });
            return;
        }
        //Procurando a tecnologia
        const existsTechnologies = userName.technologies.findIndex((item)=> item.id === id);
        if(existsTechnologies === -1){
            res.status(404).json({"error": "This Technologies does not exist"});
            return;
        }
            //Removendo do array:
            userName.technologies.splice(existsTechnologies, 1);
            res.status(200).json(userName.technologies);
    }
});

app.listen(5000, ()=>{
    console.log("Servidor funcionando na porta 5000");
})