import axios from 'axios';

// Defina a variável apenas uma vez
const URL_API_PRODUCT = process.env.URL_API_PRODUCT!;
console.log("URL_API_PRODUCT:", URL_API_PRODUCT);

// Criação do axiosInstance com baseURL padrão
const axiosInstance = axios.create({
    baseURL: "https://product-microservice-mlp.onrender.com/api/store", // Coloque a base URL aqui
    headers: {
        'Content-Type': 'application/json',
    },
});

// Função para registrar uma nova loja (POST)
export async function registerStore(storeData: Record<string, any>) {
    try {
        const response = await axiosInstance.post('/', storeData);
        return response.data;
    } catch (error) {
        console.error('Erro ao registrar loja:', error);
        throw error;
    }
}

// Função para obter loja pelo ID do usuário (GET)
export async function getStoreByUserId(user_id: string) {
    try {
        console.log('ID do usuário:', user_id);
        const response = await axiosInstance.get(`/userid/${user_id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar loja pelo ID do usuário:', error);
        throw error;
    }
}

// Função para registrar um novo produto (POST)
export async function registerProduct(productData: {
    title: string;
    image_url?: string;
    description: string;
    price_in_cents: number;
    stock: number;
    category_id: string;
    store_id: string;
}) {
    try {
        const response = await axiosInstance.post('/product', productData);
        return response.data;
    } catch (error) {
        console.error('Erro ao registrar produto:', error);
        throw error;
    }
}

// Função para listar produtos por ID da loja com paginação (GET)
export async function listProductsByStoreId(store_id: string, page: number = 1, size: number = 8) {
    try {
        const response = await axiosInstance.get('/product/listproductbystoreid', {
            params: {
                store_id,
                page,
                size
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        throw error;
    }
}

// Função para obter produto específico pelo ID (GET)
export async function getProductById(id: string) {
    try {
        const response = await axiosInstance.get(`/product/id/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar produto por ID:', error);
        throw error;
    }
}
export type CategoryModel = {
    id: string;
    title: string;
    slug: string;
};
// Função para listar todas as categorias de produtos (GET)
export async function listCategories(): Promise<CategoryModel[]> {
    try {
        const response = await axiosInstance.get('/product/category');
        return response.data as CategoryModel[]; // Tipando o retorno
    } catch (error) {
        console.error('Erro ao listar categorias:', error);
        throw error;
    }
}

// Função para registrar uma nova categoria de produto (POST)
export async function registerCategory(categoryData: Record<string, any>) {
    try {
        const response = await axiosInstance.post('/product/category', categoryData);
        return response.data;
    } catch (error) {
        console.error('Erro ao registrar categoria:', error);
        throw error;
    }
}
