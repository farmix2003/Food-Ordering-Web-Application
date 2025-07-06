import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

interface NewRestaurant {
  name: string;
  cuisineType: string;
  address: {
    streetName: string;
    cityName: string;
  };
  contactInfo: {
    email: string;
    phoneNumber: string;
    whatsApp: string;
    instagram: string;
  };
  openingHours: string;
  closingHours: string;
  image: File | null;
  description: string;
}

interface AddNewRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (restaurant: NewRestaurant) => Promise<void>;
  newRestaurant: NewRestaurant;
  setNewRestaurant: React.Dispatch<React.SetStateAction<NewRestaurant>>;
}

const AddNewRestaurantModal = ({
  isOpen,
  onClose,
  onSave,
  newRestaurant,
  setNewRestaurant,
}: AddNewRestaurantModalProps) => {
  const handleSave = async () => {
    await onSave(newRestaurant);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>Add New Restaurant</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto pr-4">
          <div className="grid gap-4 py-4">
            {/* Name & Cuisine */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[250px]">
                <Label htmlFor="name">Restaurant Name</Label>
                <Input
                  id="name"
                  value={newRestaurant.name}
                  onChange={(e) =>
                    setNewRestaurant((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="flex-1 min-w-[250px]">
                <Label htmlFor="cuisine">Cuisine Type</Label>
                <Input
                  id="cuisine"
                  value={newRestaurant.cuisineType}
                  onChange={(e) =>
                    setNewRestaurant((prev) => ({ ...prev, cuisineType: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[250px]">
                <Label htmlFor="streetName">Street Name</Label>
                <Input
                  id="streetName"
                  value={newRestaurant.address.streetName}
                  onChange={(e) =>
                    setNewRestaurant((prev) => ({
                      ...prev,
                      address: { ...prev.address, streetName: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="flex-1 min-w-[250px]">
                <Label htmlFor="cityName">City Name</Label>
                <Input
                  id="cityName"
                  value={newRestaurant.address.cityName}
                  onChange={(e) =>
                    setNewRestaurant((prev) => ({
                      ...prev,
                      address: { ...prev.address, cityName: e.target.value },
                    }))
                  }
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[250px]">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newRestaurant.contactInfo.email}
                  onChange={(e) =>
                    setNewRestaurant((prev) => ({
                      ...prev,
                      contactInfo: { ...prev.contactInfo, email: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="flex-1 min-w-[250px]">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={newRestaurant.contactInfo.phoneNumber}
                  onChange={(e) =>
                    setNewRestaurant((prev) => ({
                      ...prev,
                      contactInfo: { ...prev.contactInfo, phoneNumber: e.target.value },
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[250px]">
                <Label htmlFor="whatsAppNumber">WhatsApp Number</Label>
                <Input
                  id="whatsAppNumber"
                  value={newRestaurant.contactInfo.whatsApp}
                  onChange={(e) =>
                    setNewRestaurant((prev) => ({
                      ...prev,
                      contactInfo: { ...prev.contactInfo, whatsApp: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="flex-1 min-w-[250px]">
                <Label htmlFor="instagram">Instagram Account</Label>
                <Input
                  id="instagram"
                  value={newRestaurant.contactInfo.instagram}
                  onChange={(e) =>
                    setNewRestaurant((prev) => ({
                      ...prev,
                      contactInfo: { ...prev.contactInfo, instagram: e.target.value },
                    }))
                  }
                />
              </div>
            </div>

            {/* Hours */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[250px]">
                <Label htmlFor="openingHours">Opening Hours</Label>
                <Input
                  id="openingHours"
                  value={newRestaurant.openingHours}
                  onChange={(e) =>
                    setNewRestaurant((prev) => ({ ...prev, openingHours: e.target.value }))
                  }
                />
              </div>
              <div className="flex-1 min-w-[250px]">
                <Label htmlFor="closingHours">Closing Hours</Label>
                <Input
                  id="closingHours"
                  value={newRestaurant.closingHours}
                  onChange={(e) =>
                    setNewRestaurant((prev) => ({ ...prev, closingHours: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* Image */}
            <div className="w-full">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setNewRestaurant((prev) => ({ ...prev, image: file }));
                  }
                }}
              />
            </div>

            {/* Description */}
            <div className="w-full">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newRestaurant.description}
                onChange={(e) =>
                  setNewRestaurant((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={4}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Create Restaurant</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewRestaurantModal;
