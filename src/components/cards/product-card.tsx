import { useTranslation } from "react-i18next";
import type { Product } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProductCardProps {
  product: Product;
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

const statusVariants: Record<Product["status"], "default" | "secondary" | "destructive"> = {
  in_stock: "default",
  low_stock: "secondary",
  out_of_stock: "destructive",
};

export function ProductCard({ product, onView, onEdit, onDelete }: ProductCardProps) {
  const { t } = useTranslation();
  const variant = statusVariants[product.status];

  const statusLabels: Record<Product["status"], string> = {
    in_stock: t("products.inStock"),
    low_stock: t("products.lowStock"),
    out_of_stock: t("products.outOfStock"),
  };
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currency,
  }).format(product.price);

  const hasImage = product.images && product.images.length > 0;

  return (
    <Card
      className="group overflow-hidden transition-shadow hover:shadow-md cursor-pointer"
      onClick={() => onView?.(product)}
    >
      <div className="relative aspect-4/3 bg-muted/50 flex items-center justify-center overflow-hidden">
        {hasImage ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="size-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <Package className="size-12 text-muted-foreground/40" />
        )}
        <div className="absolute top-3 left-3">
          <Badge variant={variant}>{statusLabels[product.status]}</Badge>
        </div>
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="size-8 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(product)}>
                <Eye className="mr-2 size-4" />
                {t("common.view")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(product)}>
                <Edit className="mr-2 size-4" />
                {t("common.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(product)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 size-4" />
                {t("common.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {product.category}
          </p>
          <h3 className="font-semibold leading-snug line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center justify-between pt-2">
            <p className="text-lg font-bold">{formattedPrice}</p>
            <p className="text-sm text-muted-foreground">
              {t("products.stock", { count: product.stock })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
