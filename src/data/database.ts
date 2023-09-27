//Importanto os tipos de dados:
import { User, Technologies } from "../user/types";

//Criando a database
let dataBaseArray: User[] = [
    {
        id: "kkkk",
        name: "dougl",
        userName: "dodi",
        technologies: []
    }
];

//Função para atualizar o dataBase
export const updateData = (newData: User) => {
    dataBaseArray.push(newData);
}; 

//Função para imprimir o dataBase
export const getdataBaseArray = () => {
    return dataBaseArray;
} 