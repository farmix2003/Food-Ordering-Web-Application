import { Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CurrencyLira } from "@mui/icons-material";

interface Image{
  id: number;
  url: string;
  fileName: string;
}

interface MenuItem {
  id: number;
  foodName: string;
  price: number;
  images: Image[];
  description: string;
  extrasList: {id:number, name: string; price: number }[];
  available:boolean;
  categoryName:string;
  restaurantId:number;

}

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
}

const MenuItemCard = ({ item, onEdit, onDelete }: MenuItemCardProps) => {
  // console.log("Item: ",item)
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex gap-4">
         {item?.images?.map((img, i) =>(
           <img
           key={i}
           src={img.url}
           alt={item.foodName}
           className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
         />
         ))}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{item.foodName}</h3>
                <p className="text-2xl font-bold text-orange-600 flex items-center-safe">
                  <CurrencyLira /> {item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(item)}
                  className="text-blue-600 border border-cyan-100  hover:text-blue-900 hover:bg-gray-100 hover:border-amber-100"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 border border-cyan-100 hover:text-red-700 hover:bg-gray-100 hover:border-amber-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {item.description}
            </p>
            {item.extrasList.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Extras:
                </p>
                <div className="flex flex-wrap gap-1">
                  {item.extrasList.map((extra, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {extra.name} (+${extra.price.toFixed(2)})
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;
