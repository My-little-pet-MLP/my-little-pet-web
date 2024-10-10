import { axiosInstanceBanners } from "@/lib/axios";

export async function RegisterAdd(data: { title: string, description: string, external_link: string, limit_date: string, credit: number, image_url: string }) {
    try {
        const response = await axiosInstanceBanners.post(`/anuncios`, {
            title: data.title,
            description: data.description,
            external_link: data.external_link,
            limit_date: data.limit_date,
            credit: data.credit,
            image_url: data.image_url
        })
        const dataresponse = response.data
        return JSON.parse(JSON.stringify(dataresponse))
    } catch (error: any) {
        console.error('Erro ao registrar o anuncio', error.message || error);
        throw new Error(error.response?.data?.message || 'Erro inesperado ao registrar o anuncio.');
    }
}