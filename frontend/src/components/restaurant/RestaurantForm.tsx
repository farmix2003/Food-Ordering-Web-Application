import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Edit } from "lucide-react";
import { Save, Trash2 } from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

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
    restaurant: Restaurant & { newImages?: File[] };
    setRestaurant: React.Dispatch<React.SetStateAction<Restaurant & { newImages?: File[] } | null>>;
    onSave: () => Promise<void>;
    onDelete: () => void;
    isOpen:boolean;
    setIsOpen: (value: boolean) => void;
    handleDeleteImage: (id:number) => void;
  }
  

const RestaurantForm = ({ restaurant, setRestaurant, setIsOpen, isOpen, onSave,onDelete, handleDeleteImage }: RestaurantFormProps) => {
  if (!restaurant) return null;

  return (
    <>
    {/* Restaurant Info Section */}
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Edit className="h-5 w-5 mr-2" />
          Restaurant Information
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
<Label htmlFor="image">Upload New Images</Label>
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
{restaurant.images?.length > 0 && (
<div className="mt-4 grid grid-cols-2 gap-4">
{restaurant.images.map((img) => (
<div key={img.id} className="relative group">
  <img
    src={img.url}
    alt={img.fileName}
    className="w-full h-32 object-cover rounded-lg border"
  />
  <p className="text-sm text-gray-600 mt-1">{img.fileName}</p>

  {/* Delete Icon on Hover */}
  <button
    onClick={() => handleDeleteImage(img.id)}
    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
  >
    <Trash2 className="w-4 h-4" />
  </button>
</div>
))}
</div>
)}

        <div>
          <Label htmlFor="cuisine">Cuisine Type</Label>
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
          <Label htmlFor="streetName">Street Name</Label>
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
          <Label htmlFor="cityName">City Name</Label>
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
          <Label htmlFor="phoneNumber">Phone Number</Label>
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
          <Label htmlFor="whatsAppNumber">WhatsApp Number</Label>
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
          <Label htmlFor="openingHours">Opening Hours</Label>
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
          <Label htmlFor="closingHours">Closing Hours</Label>
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
          <Label htmlFor="description">Description</Label>
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
Save Restaurant Info
</Button>

<Button
variant="destructive"
onClick={() => setIsOpen(true)}
className="w-full border-2 border-red-500 hover:bg-red-600 text-red-500 hover:text-white hover:border-red-600"
>
<Trash2 className="h-4 w-4 mr-2" />
Delete Restaurant
</Button>
</div>
        <Dialog
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <DialogContent className="sm:max-w-[400px] bg-white text-black">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this restaurant? This action cannot be undone.
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={onDelete}
                className="w-full border-2 border-red-500 hover:bg-red-600 text-red-500 hover:text-white hover:border-red-600"
              >
                Delete Restaurant
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
