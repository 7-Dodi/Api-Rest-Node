import express from 'express';
import { v4 as uuidv4, validate as validateUuid } from 'uuid';
import { User, Technologies } from './user/types'; //Importando os tipos
import { updateData, getdataBaseArray } from './data/database';
import { checkExistsUserAccount } from './middleware/checkExistsUserAccount'; //Importando o Middleware
import { prisma } from './user/repositoryUser';

const app = express();
app.use(express.json());

//Metódo get: (User)
app.get("/users", async (req, res) => {
    res.status(200).json(await prisma.user.findMany()); //Irá retornar todos os usuários
});

//Método post: (User)
app.post("/users", async (req, res) => {
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
});

//Método get: (Technologies)
app.get("/technologies", checkExistsUserAccount, async (req, res) => {
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
});

//Método post: (Technologies)
app.post("/technologies", checkExistsUserAccount, async (req, res) => {
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
});

//Método put: (Technologies)
app.put("/technologies/:id", checkExistsUserAccount, async (req, res) => {
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
});

//Método patch: (Technologies)
app.patch("/technologies/:id/studied", checkExistsUserAccount, async (req, res) => {
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
});

//Método delete: (Technologies)
app.delete("/technologies/:id", checkExistsUserAccount, async (req, res) => {
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
});

app.listen(5000, () => {
    console.log("Servidor funcionando na porta 5000");
})