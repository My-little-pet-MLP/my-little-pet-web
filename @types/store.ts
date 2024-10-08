export interface Store {
    id: string;
    imageUrl: string;
    title: string;
    description: string;
    cnpj: string;
    userId: string;
    isActive: boolean;
    createdAt: string; // Pode ser tipado como Date se for convertido para Date em algum ponto
    updatedAt: string; // Pode ser tipado como Date se for convertido para Date em algum ponto
  }