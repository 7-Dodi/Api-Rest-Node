import { getdataBaseArray } from "../data/database";
import { Request, Response, NextFunction } from "express";
import { Technologies } from "../user/types";

// Define uma nova interface que representa a sua definição personalizada da requisição (Request)
export interface CustomRequest extends Request {
    user?: { username: string; technologies: Technologies[] }; // Define a propriedade 'user' como opcional e do tipo desejado
}

const checkUserName = (useName: string):boolean =>{
    const searchUser = getdataBaseArray().some((item)=> item.userName === useName); 
    return searchUser;
};

export function checkExistsUserAccount (req: CustomRequest, res:Response, next:NextFunction){
    // Obtém o username do cabeçalho da requisição
    const username = req.header('username');
    if(!username || !checkUserName(username)){
        res.status(400).json({"error":"Existing UserName"});
        return; 
    }

    // Armazena o username dentro de req.user
    req.user = { username: username, technologies: [] };

    next();
};

