"use client";

import { getProductById } from "@/lib/axios"; // Certifique-se de que esta função está configurada corretamente
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
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
  createdAt: Date;
  updatedAt: Date;
}

export default function ProductInfoPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [store, setStore] = useState();
  const [Category,setCategory] = useState();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id; // Garante que o id seja uma string

  useEffect(() => {
    async function fetchProduct(productId: string) {
      try {
        const res = await getProductById(productId); // Chama a função para buscar o produto pelo ID
        setProduct(res); // Define o produto no estado
      } catch (error) {
        console.error("Erro ao buscar o produto:", error);
      } finally {
        setLoading(false); // Para de mostrar o loading
      }
    }

    if (id) {
      fetchProduct(id); // Chama a função apenas se o 'id' existir
    }
  }, [id]);

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (!product) {
    return <p>Produto não encontrado.</p>;
  }

  return (
    <main className="sm:ml-14 grid grid-cols-2 h-screen">
      <div className="col-span-1  h-full flex items-center justify-end">
          <Image src={product.imageUrl} alt="image product" width={400} height={400}/>
      </div>
      <div className="col-span-1 h-full flex items-start justify-center flex-col">
      <h3 className="font-sans text-2xl font-bold">Titulo: {product.title}</h3>
      <p className="font-sans text-base font-normal text-gray-700 bg-gray-200 rounded p-6 min-h-72">{product.description}</p>
      <p className="font-sans text-xl font-bold">Preço R$: {(product.priceInCents / 100).toFixed(2)}</p>
      <p className="font-sans text-base font-normal">Estoque: {product.stock}</p>

      </div>
    </main>
    // <main className="sm:ml-14 p-6 sm:p-12 flex flex-col gap-4">
    //   <p>Product ID: {product.id}</p>
    //   <p>Title: {product.title}</p>
    //   <p>Description: {product.description}</p>
    //   <p>Price: R$ {(product.priceInCents / 100).toFixed(2)}</p>
    //   <p>Stock: {product.stock}</p>
    //   <p>Category ID: {product.categoryId}</p>
    //   <p>Store ID: {product.storeId}</p>
    //   <p>Status: {product.isActive ? "Ativo" : "Inativo"}</p>
    //   <p>Created At: {new Date(product.createdAt).toLocaleDateString("pt-BR")}</p>
    //   <p>Updated At: {new Date(product.updatedAt).toLocaleDateString("pt-BR")}</p>
    // </main>
  );
}
