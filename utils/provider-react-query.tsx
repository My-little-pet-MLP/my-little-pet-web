"use client"

import { queryClient } from "@/lib/react-query/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export function ProviderReactQuery({children}:{children:ReactNode}){

    return(
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}