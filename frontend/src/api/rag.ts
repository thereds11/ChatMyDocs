import { api } from "./client";

export type RAGSource = { source: string; page?: number };

export async function getStats(): Promise<{ documents: number }> {
    const { data } = await api.get("/stats");
    return data;
}

export async function ingestFiles(files: File[]) {
    const form = new FormData();

    for (const f of files) form.append("files", f);
    const { data } = await api.post("/ingest", form, {
        headers: { "Content-Type": "multipart/form-data" }
    });

    return data as { added_chunks: number, total_documents: number };
}

export async function queryDocs(question: string): Promise<{ answer: string; sources: RAGSource[] }> {
    const { data } = await api.post("/query", { question });
    return data;
}

export async function resetStore(): Promise<{ ok: boolean; message: string }> {
    const { data } = await api.post("/reset");
    return data;
}
