import { prisma } from '../user/repositoryUser';
import { Request, Response } from "express";
import { v4 as uuidv4, validate as validateUuid } from 'uuid';

//Metódos de Technologies
const listTechnologies = async (req:Request, res:Response) => {
    const { user } = req; //Retorna o username
    try {
        const userName = await prisma.user.findUnique({
            where: {
                userName: user?.userName,
            },
            include: {
                technologies: true
            }
        })
        //Confirmando se o userName exista ou não:
        if (!userName) {
            res.status(404).json({ "error": "This UserName does not exist" });
        } else {
            res.status(200).json(userName.technologies);
        }
    } catch (error) {
        res.status(500).json({ "error": "Internal server error" });
    }
};

const addTechnologies = async (req:Request, res:Response) => {
    const { user } = req;
    const { title, deadline } = req.body;

    try {
        const userNameExist = await prisma.user.findUnique({
            where: {
                userName: user?.userName,
            },
            include: {
                technologies: true
            }
        })
        //Confirmando se o userName já existe ou não:
        if (!userNameExist) {
            res.status(404).json({ "error": "This UserName does not exist" });
        } else {
            const newTecnology = await prisma.technologies.create({
                data: {
                    id: uuidv4(),
                    title: title,
                    studied: false,
                    deadline: new Date(deadline),
                    created_at: new Date(),
                    userId: userNameExist.id
                }
            })
            res.status(201).json(newTecnology);
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ "error": "Internal server error" });
    }
};

const updateTechnologies = async (req:Request, res:Response) => {
    const { user } = req;
    const { title, deadline } = req.body;
    const id = req.params.id;

    try {
        const userName = await prisma.user.findUnique({
            where: {
                userName: user?.userName
            },
            include: {
                technologies: true
            }
        })
        //Confirmando se o userName exista ou não:
        if (!userName) {
            res.status(404).json({ "error": "This UserName does not exist" });
        } else {
            // Verificando se o ID é um UUID válido
            if (!validateUuid(id)) {
                res.status(404).json({ "error": "Invalid UUID" });
                return;
            }
            //Procurando a tecnologia
            const technologyToUpdate = userName.technologies.find((tech) => tech.id === id);

            if (!technologyToUpdate) {
                res.status(404).json({ "error": "This Technology does not exist in the user's technologies" });
                return;
            }

            // Atualizando a tecnologia diretamente no array do usuário
            technologyToUpdate.title = title;
            technologyToUpdate.deadline = new Date(deadline);

            // Salvando as alterações no usuário
            const updatedUser = await prisma.user.update({
                where: {
                    userName: user?.userName
                },
                data: {
                    technologies: {
                        updateMany: userName.technologies.map((tech) => ({
                            where: { id: tech.id },
                            data: {
                                title: tech.title,
                                deadline: tech.deadline,
                            },
                        })),
                    },
                },
                include: {
                    technologies: true
                }
            });

            res.status(200).json(updatedUser.technologies);
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ "error": "Internal server error" });
    }
};

const updateStudied = async (req:Request, res:Response) => {
    const { user } = req;
    const id = req.params.id;

    //Procurando usuário:
    const userName = await prisma.user.findUnique({
        where: {
            userName: user?.userName
        },
        include: {
            technologies: true
        }
    });
    //Confirmando se o userName exista ou não:
    if (!userName) {
        res.status(404).json({ "error": "This UserName does not exist" });
    } else {
        // Verificando se o ID é um UUID válido
        if (!validateUuid(id)) {
            res.status(404).json({ "error": "Invalid UUID" });
            return;
        }
        //Procurando a tecnologia
        const technologyToUpdate = userName.technologies.find((tech) => tech.id === id);

        if (!technologyToUpdate) {
            res.status(404).json({ "error": "This Technology does not exist in the user's technologies" });
            return;
        }
        // Salvando as alterações no usuário
        const updatedUser = await prisma.user.update({
            where: {
                userName: user?.userName
            },
            data: {
                technologies: {
                    updateMany: userName.technologies.map((tech) => ({
                        where: { id: tech.id },
                        data: {
                            studied: true
                        },
                    })),
                },
            },
            include: {
                technologies: true
            }
        });
        res.status(200).json(updatedUser.technologies);
    }
};

const deleteTechnologies = async (req:Request, res:Response) => {
    const { user } = req;
    const id = req.params.id;

    //Procurando usuário:
    const userName = await prisma.user.findUnique({
        where: {
            userName: user?.userName
        },
        include: {
            technologies: true
        }
    });
    //Confirmando se o userName exista ou não:
    if (!userName) {
        res.status(404).json({ "error": "This UserName does not exist" });
    } else {
        // Verificando se o ID é um UUID válido
        if (!validateUuid(id)) {
            res.status(404).json({ "error": "Invalid UUID" });
            return;
        }
        //Procurando a tecnologia
        const technologyToRemove = userName.technologies.find((tech) => tech.id === id);

        if (!technologyToRemove) {
            res.status(404).json({ "error": "This Technology does not exist in the user's technologies" });
            return;
        }

        // Removendo a tecnologia diretamente usando o método "delete"
        await prisma.technologies.delete({
            where: {
                id: id
            }
        });

        // Atualizando o array de tecnologias do usuário para remover a tecnologia excluída
        const updatedUser = await prisma.user.update({
            where: {
                userName: user?.userName
            },
            data: {
                technologies: {
                    disconnect: [{ id: id }]
                }
            },
            include: {
                technologies: true
            }
        });
        res.status(200).json(updatedUser.technologies);
    }
};

export{listTechnologies, addTechnologies, deleteTechnologies, updateStudied, updateTechnologies};