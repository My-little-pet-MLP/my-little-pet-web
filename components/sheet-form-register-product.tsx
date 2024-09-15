import { PlusIcon } from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader,
  SheetTitle,
  SheetTrigger
} from "./ui/sheet";
import { Button } from "./ui/button";

export function SheetFormRegisterProduct() {


  

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <PlusIcon /><p className="hidden sm:flex"> Novo Produto</p>
        </Button>
      </SheetTrigger>

      <SheetContent className="overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Novo Produto</SheetTitle>
        </SheetHeader>
      
      
      </SheetContent>
    </Sheet>
  );
}
