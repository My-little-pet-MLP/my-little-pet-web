import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Package ,WalletCards} from "lucide-react"
interface CardDashboardProps {
    title:string;
    description:string;
    content:string;
}
export function CardDashboardVendas({title,description,content}:CardDashboardProps){
    return(
        <Card className="flex pt-4 sm:pt-8 px-2 sm:px-4 flex-col gap-1">
                    <CardTitle className="flex flex-row items-center gap-4">
                        <Package className="text-oragetheme hidden sm:flex"/>
                        <span className="w-full text-center sm:text-start">{title}</span>
                    </CardTitle>
                    <CardDescription className="w-full text-center sm:text-start">{description}</CardDescription>
                    <CardContent className="flex items-center justify-center h-24">
                        <span className="text-sm text-center sm:text-start sm:text-base">{content}</span>
                    </CardContent>
                </Card>
    )
}
export function CardDashboardFaturamento({title,description,content}:CardDashboardProps){
    return(
        <Card className="flex pt-4 sm:pt-8 px-2 sm:px-4 flex-col gap-1">
                    <CardTitle className="flex flex-row items-center gap-4">
                        <WalletCards className="text-oragetheme hidden sm:flex"/>
                        <span className="w-full text-center sm:text-start">{title}</span>
                    </CardTitle>
                    <CardDescription className="w-full text-center sm:text-start">{description}</CardDescription>
                    <CardContent className="flex items-center justify-center h-24">
                        <span  className="text-sm text-center sm:text-start sm:text-base">{content}</span>
                    </CardContent>
                </Card>
    )
}