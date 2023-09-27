
//Construindo os tipos:
export type Technologies = {
    id: string;
    title: string;
    studied: boolean;
    deadline: Date;
    created_at: Date;
}

export type User = {
    id: string;
    name: string;
    userName: string;
    technologies: Technologies[];
}