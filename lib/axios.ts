import axios from 'axios';

// Criação do axiosInstance com baseURL padrão
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3333/api/store', // Coloque a base URL aqui
    headers: {
        'Content-Type': 'application/json',
    },
});

// Função para registrar uma nova loja (POST)
export async function registerStore(storeData: object) {
    try {
        const response = await axiosInstance.post('/', storeData);
        return response.data;
    } catch (error) {
        console.error('Error registering store:', error);
        throw error;
    }
}

// Função para obter loja pelo ID do usuário (GET)
export async function getStoreByUserId(user_id: string) {
    try {
        const response = await axiosInstance.get(`/userid/${user_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching store by user ID:', error);
        throw error;
    }
}

// Função para registrar um novo produto (POST)
export async function registerProduct(productData: object) {
    try {
        const response = await axiosInstance.post('/product/', productData);
        return response.data;
    } catch (error) {
        console.error('Error registering product:', error);
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
        console.error('Error fetching products:', error);
        throw error;
    }
}

// Função para obter produto específico pelo ID (GET)
export async function getProductById(id: string) {
    try {
        const response = await axiosInstance.get(`/product/id/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        throw error;
    }
}

// Função para listar todas as categorias de produtos (GET)
export async function listCategories() {
    try {
        const response = await axiosInstance.get('/product/category');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

// Função para registrar uma nova categoria de produto (POST)
export async function registerCategory(categoryData: object) {
    try {
        const response = await axiosInstance.post('/product/category', categoryData);
        return response.data;
    } catch (error) {
        console.error('Error registering category:', error);
        throw error;
    }
}
