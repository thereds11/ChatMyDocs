export type Role = "user" | "assistant";

export type Message = {
    id: string;
    role: Role;
    content: string;
    createdAt?: number;
};

export type Source = { source: string; page?: number };
