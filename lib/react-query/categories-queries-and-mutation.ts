import { ListCategories } from "@/hooks/categories/list-categories";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { QUERYKEYS } from "./query-is";
import { Category } from "@/@types/categories";

export const useListCategories = (): UseQueryResult<Category[]> => {
    return useQuery<Category[]>({
      queryKey: [QUERYKEYS.listCategories],
      queryFn: () => ListCategories(),
    });
  };