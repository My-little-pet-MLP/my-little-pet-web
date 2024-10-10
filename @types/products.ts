export interface ProductProps {
    id: string;
    title: string;
    imageUrl: string;
    priceInCents: number;
    stock: number;
}
export interface ProductsData {
    products: ProductProps[];
    totalPages: number;
    currentPage: number;
}
export interface ProductComplete {
    id: string;
    title: string;
    slug: string;
    imageUrl: string;
    description: string;
    priceInCents: number;
    stock: number;
    categoryId: string;
    storeId: string;
    isActive: boolean;
    createdAt: string; 
    updatedAt: string; 
}