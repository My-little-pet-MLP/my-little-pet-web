import { Coupon, listCouponsByStoreId } from "@/hooks/coupon/list-all-by-stored-id";
import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { QUERYKEYS } from "./query-is";
import { registerCoupon, RegisterCouponPayload } from "@/hooks/coupon/register-coupon";


export const useListAllCouponsByStoreId = (
  storeId: string
): UseQueryResult<Coupon[]> => {
  return useQuery<Coupon[]>({
      queryKey: [QUERYKEYS.couponsByStore], // Chave única para cache
      queryFn: () => listCouponsByStoreId(storeId), // Função para buscar cupons
      enabled: !!storeId, // Apenas ativa a consulta se o ID da loja existir
  });
};

export const usePostCoupon = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (payload: RegisterCouponPayload) => registerCoupon(payload),
      onSuccess: () => {
        console.log('Cupom registrado com sucesso!');
        queryClient.invalidateQueries({ queryKey: [QUERYKEYS.couponsByStore] });
      },
      onError: (error: any) => {
        console.error('Erro ao registrar cupom:', error.message || error);
      },
    });
  };