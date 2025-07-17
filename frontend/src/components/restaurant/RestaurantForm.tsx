import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Edit } from "lucide-react";
import { Save, Trash2 } from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import RestaurantImages from "./RestaurantImages";
import { useTranslation } from "react-i18next";

interface Image{
    id: number;
    url: string;
    fileName: string;
  }
  
  
  interface Restaurant {
    id: number;
    name: string;
    images: Image[];
    cuisineType: string;
    description: string;
    address: {
      streetName: string;
      cityName: string;
    };
    contactInfo: {
    email: string;
    phone: string;
    whatsApp: string;
    instagram: string;
    };
    openingHours: string;
    closingHours: string;
    open: boolean;
  }
  

interface RestaurantFormProps {
    restaurant: Restaurant & { newImages?: File[] }|null;
    setRestaurant: React.Dispatch<React.SetStateAction<Restaurant & { newImages?: File[] } | null>>;
    onSave: () => Promise<void>;
    onDelete: () => void;
    isOpen:boolean;
    setIsOpen: (value: boolean) => void;
    handleDeleteImage: (id:number) => void;
  }
  

const RestaurantForm = ({ restaurant, setRestaurant, setIsOpen, isOpen, onSave,onDelete, handleDeleteImage }: RestaurantFormProps) => {
  
  const {t} = useTranslation()
  
  if (!restaurant) return null;
  
  return (
    <>
    {/* Restaurant Info Section */}
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Edit className="h-5 w-5 mr-2" />
          {t("restaurantInfo")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="name">Restaurant Name</Label>
          <Input
            id="name"
            value={restaurant.name}
            onChange={(e) =>
              setRestaurant((prev) => ({ ...prev!, name: e.target.value }))
            }
            className="mt-1"
          />
        </div>

        <div>
<Label htmlFor="image">{t("imageUpload")}</Label>
<Input
id="image"
type="file"
accept="image/*"
multiple
onChange={(e) => {
const files = Array.from(e.target.files || []);
setRestaurant((prev) => prev ? { ...prev, newImages: files } : prev);
}}
/>
</div>

{/* Preview New Images */}
{restaurant?.images?.length > 0 && (
<div className="mt-2 grid grid-cols-2 gap-4">
{restaurant.images.map((file, index) => (
<div key={index} className="text-sm text-gray-600">
  📄 {file.fileName}
</div>
))}
</div>
)}

{/* Existing Images with Delete on Hover */}
<RestaurantImages restaurant={restaurant} handleDeleteImage={handleDeleteImage} />

        <div>
          <Label htmlFor="cuisine">{t('cuisineType')}</Label>
          <Input
            id="cuisine"
            value={restaurant.cuisineType}
           onChange={(e) =>
setRestaurant((prev) =>
prev ? {
...prev,
cuisineType: e.target.value,
} : prev
)
}

            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="streetName">{t('streetName')}</Label>
          <Input
            id="streetName"
            value={restaurant.address.streetName}
           onChange={(e) =>
setRestaurant((prev) =>
prev ? {
...prev,
address: {
  ...prev.address,
  streetName: e.target.value,
},
} : prev
)
}

            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="cityName">{t('cityName')}</Label>
          <Input
            id="cityName"
            value={restaurant.address.cityName}
           onChange={(e) =>
setRestaurant((prev) =>
prev ? {
...prev,
address: {
  ...prev.address,
  cityName: e.target.value,
},
} : prev
)
}

            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={restaurant.contactInfo.email}
           onChange={(e) =>
          setRestaurant((prev) =>
prev ? {
...prev,
contactInfo: {
  ...prev.contactInfo,
  email: e.target.value,
},
} : prev
)
}

            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber">{t('phoneNumber')}</Label>
          <Input
            id="phoneNumber"
            value={restaurant.contactInfo.phone}
           onChange={(e) =>
setRestaurant((prev) =>
prev ? {
...prev,
contactInfo: {
  ...prev.contactInfo,
  phone: e.target.value,
},
} : prev
)
}

            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="whatsAppNumber">{t('whatsAppNumber')}</Label>
          <Input
            id="whatsAppNumber"
            value={restaurant.contactInfo.whatsApp}
           onChange={(e) =>
setRestaurant((prev) =>
prev ? {
...prev,
contactInfo: {
  ...prev.contactInfo,
  whatsApp: e.target.value,
},
} : prev
)
}

            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            value={restaurant.contactInfo.instagram}
            onChange={(e) =>
setRestaurant((prev) =>
prev ? {
...prev,
contactInfo: {
  ...prev.contactInfo,
  instagram: e.target.value,
},
} : prev
)
}

            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="openingHours">{t('openingHours')}</Label>
          <Input
            id="openingHours"
            value={restaurant.openingHours}
            onChange={(e) =>
              setRestaurant((prev) => ({
                ...prev!,
                openingHours: e.target.value,
              }))
            }
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="closingHours">{t('closingHours')}</Label>
          <Input
            id="closingHours"
            value={restaurant.closingHours}
            onChange={(e) =>
              setRestaurant((prev) => ({
                ...prev!,
                closingHours: e.target.value,
              }))
            }
            className="mt-1"
          />
        </div>


        <div>
          <Label htmlFor="description">{t("resDesc")}</Label>
          <Textarea
            id="description"
            value={restaurant.description}
            onChange={(e) =>
              setRestaurant((prev) => ({
                ...prev!,
                description: e.target.value,
              }))
            }
            className="mt-1"
            rows={3}
          />
        </div>

        <div className="flex flex-col gap-2">
<Button
onClick={onSave}
className="w-full text-white bg-orange-600 hover:bg-orange-700"
>
<Save className="h-4 w-4 mr-2" />
{t("saveInfo")}
</Button>

<Button
variant="destructive"
onClick={() => setIsOpen(true)}
className="w-full border-2 border-red-500 hover:bg-red-600 text-red-500 hover:text-white hover:border-red-600"
>
<Trash2 className="h-4 w-4 mr-2" />
{t('deleteInfo')}
</Button>
</div>
        <Dialog
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <DialogContent className="sm:max-w-[400px] bg-white text-black">
            <DialogHeader>
              <DialogTitle>{t('confirmation')}</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600 mb-4">
              {t('confirmationText')}
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                {t('cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={onDelete}
                className="w-full border-2 border-red-500 hover:bg-red-600 text-red-500 hover:text-white hover:border-red-600"
              >
                {"deleteRes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </CardContent>
    </Card>

  </>

  );
};

export default RestaurantForm;
