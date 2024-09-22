import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface uploadResponse {
    publicUrl: string | null;
    error: Error | null;
}

// Lista de extensões de imagem permitidas
const validImageExtensions = ['.png', '.jpg', '.jpeg','.svg'];

// Função para verificar a extensão do arquivo
function isImageFile(fileName: string): boolean {
    const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    return validImageExtensions.includes(extension);
}

// Função auxiliar para verificar as dimensões da imagem
function checkImageDimensions(file: File, expectedWidth: number, expectedHeight: number): Promise<void> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = function (e) {
            img.onload = function () {
                if (img.width === expectedWidth && img.height === expectedHeight) {
                    resolve();
                } else {
                    reject(new Error(`A imagem deve ter as dimensões ${expectedWidth}x${expectedHeight}.`));
                }
            };
            img.onerror = reject;
            if (e.target) {
                img.src = e.target.result as string;
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export async function uploadBanner(file: File, folder: string): Promise<uploadResponse> {
    if (!isImageFile(file.name)) {
        return { publicUrl: null, error: new Error("O arquivo deve ser uma imagem válida.") };
    }

    try {
        await checkImageDimensions(file, 913, 344);
    } catch (error) {
        if (error instanceof Error){
            return { publicUrl: null, error };
        }
    }

    const fileName = `${Date.now()}_${file.name}`;
    return uploadToSupabase(file, folder, fileName);
}

export async function uploadProductImage(file: File, folder: string): Promise<uploadResponse> {
    if (!isImageFile(file.name)) {
        return { publicUrl: null, error: new Error("O arquivo deve ser uma imagem válida.") };
    }

    try {
        await checkImageDimensions(file, 200, 200);
    } catch (error) {
        if(error instanceof Error){
            return { publicUrl: null, error };
        }
       
    }

    const fileName = `${Date.now()}_${file.name}`;
    return uploadToSupabase(file, folder, fileName);
}

async function uploadToSupabase(file: File, folder: string, fileName: string): Promise<uploadResponse> {
    const { data, error } = await supabase.storage
        .from(folder)
        .upload(`${folder}/${fileName}`, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        return { publicUrl: null, error: new Error("Erro ao fazer upload da imagem.") };
    }

    const responseUrl = supabase.storage
        .from(folder)
        .getPublicUrl(`${folder}/${fileName}`);

    if (!responseUrl.data.publicUrl) {
        console.error('Erro ao obter URL pública:');
        return { publicUrl: null, error: new Error("Erro ao obter URL pública.") };
    }

    return { publicUrl: responseUrl.data.publicUrl, error: null };
}
