import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import MenuItemCard from './MenuItem'

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
  extrasList: {id:number; name: string; price: number }[];
  available:boolean;
  categoryName:string;
  restaurantId:number;
  }
interface MenuItemCardProps {
    menuItems: MenuItem[];
    handleAddMenuItem: () => void;
    handleEditMenuItem: (item: MenuItem) => void;
    handleDeleteMenuItem: (id: number) => void;
  }
const MenuManagement = ({menuItems, handleAddMenuItem, handleEditMenuItem, handleDeleteMenuItem}:MenuItemCardProps) => {
 
  return (
    <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  Menu Items ({menuItems.length})
                </CardTitle>
                <Button
                  onClick={handleAddMenuItem}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {menuItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onEdit={handleEditMenuItem}
                    onDelete={handleDeleteMenuItem}
                  />
                ))}
                {menuItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No menu items yet. Add your first item to get started!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
  )
}

export default MenuManagement