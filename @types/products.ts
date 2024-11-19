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
    category: {
        id: string;
        title: string;
        slug: string;
    };
    store: {
        id: string;
        imageUrl: string;
        title: string;
        description: string;
        cnpj: string;
        userId: string;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
    };
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}