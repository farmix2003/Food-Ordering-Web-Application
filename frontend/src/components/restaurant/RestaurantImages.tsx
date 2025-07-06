import { Trash2 } from 'lucide-react'


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
  interface RestaurantImageProps{
    restaurant: Restaurant;
    handleDeleteImage: (imageId: number) => void;
  }

const RestaurantImages = ({restaurant, handleDeleteImage}:RestaurantImageProps) => {
  return (
    <div>
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
    </div>
  )
}

export default RestaurantImages