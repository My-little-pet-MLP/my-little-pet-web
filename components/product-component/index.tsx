import Image from "next/image";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ProductProps } from "@/app/dashboard/produtos/[pageNumber]/page";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { uploadProductImage } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@clerk/nextjs";
import { useGetProductById, useUpdateProduct } from "@/lib/react-query/products-queries-and-mutations";
import { useListCategories } from "@/lib/react-query/categories-queries-and-mutation";
import { useForm } from "react-hook-form";
import { UpdateProductSchema, UpdateProductSchemaType } from "@/lib/schemas";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { set } from "zod";
import { UpdateProductDialog } from "./update-product-dialog";

export function ProductComponent(product: ProductProps) {




  const formatCurrency = (valueInCents: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valueInCents / 100);
  };




  return (
    <Card key={product.id} className="h-80 w-full max-w-xs flex flex-col justify-between shadow-md">
      <CardContent className="flex flex-col items-center gap-2 lg:gap-4 p-4">
        <Image
          src={product.imageUrl}
          alt={product.title}
          width={144}
          height={144}
          className="object-contain w-36 h-36"
          priority
        />
        <CardTitle className="w-full text-center text-sm sm:text-base whitespace-nowrap overflow-hidden text-ellipsis">
          {product.title}
        </CardTitle>
        <div className="grid grid-cols-1 w-full text-center">
          <CardDescription className="text-sm font-semibold">{formatCurrency(product.priceInCents)}</CardDescription>
          <CardDescription className="text-xs sm:text-sm">Estoque: {product.stock}</CardDescription>
        </div>
        <div className="w-full mt-auto">
          <UpdateProductDialog id={product.id} title={product.title} imageUrl={product.imageUrl} priceInCents={product.priceInCents} stock={product.stock} key={product.id} />
        </div>
      </CardContent>
    </Card>
  );
}
