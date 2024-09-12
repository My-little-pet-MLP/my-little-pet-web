import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
interface uploadProductImageResponse {
    publicUrl: string | null;
    error: Error | null;
}
export async function uploadProductImage(file: File, folder: string): Promise<uploadProductImageResponse> {

    const fileName = `${Date.now()}_${file.name}`;


    const { data, error } = await supabase.storage
        .from('my-little-pet-products')
        .upload(`${folder}/${fileName}`, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        return { publicUrl: null, error: new Error("Erro ao fazer upload da imagem") };
    }

    // Obtém a URL pública do arquivo
    const responseurl = supabase.storage
        .from('my-little-pet-products') // Substitua pelo nome do seu bucket
        .getPublicUrl(`${folder}/${fileName}`);

    if (!responseurl.data.publicUrl) {
        console.error('Erro ao obter URL pública:');
        return { publicUrl: null, error: new Error("Erro ao obter URL pública") };
    }

    return { publicUrl: responseurl.data.publicUrl, error: null };
}