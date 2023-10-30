import { prisma } from '../user/repositoryUser';
import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';

//Métodos de usuário
const listUser = async (req: Request, res:Response) => {
    res.status(200).json(await prisma.user.findMany()); //Irá retornar todos os usuários
};

const addUser = async (req: Request, res:Response) => {
    const { name, username } = req.body;
    const userNameExist = (await prisma.user.findMany()).some((item) => item.userName === username);
    //Confirmando se o userName já existe ou não:
    if (userNameExist) {
        res.status(404).json({ "error": "Existing UserName" });
    } else {
        //Criando User:
        const newUser = await prisma.user.create({
            data: {
                id: uuidv4(),
                name: name,
                userName: username,
            }
        })

        //Atualizando o dataBase:
        res.status(201).json(newUser);
    }
};

export{listUser, addUser};