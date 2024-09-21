import { ListCategories } from "@/hooks/categories/list-categories";
import { useQuery } from "@tanstack/react-query";
import { QUERYKEYS } from "./query-is";

export const useListCategories = () =>{
    

    return useQuery({
        queryKey: [QUERYKEYS.listCategories],
        queryFn: () => ListCategories(),
    });

}