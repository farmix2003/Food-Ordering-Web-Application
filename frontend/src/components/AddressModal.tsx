import React, { useState } from "react";
import { MapPin, Plus, X } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface Address {
  id: string;
  title: string;
  fullAddress: string;
  isDefault?: boolean;
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (address: Address) => void;
  currentAddress: string;
}

const mockAddresses: Address[] = [
  {
    id: "1",
    title: "Home",
    fullAddress: "123 Main Street, Apt 4B, New York, NY 10001",
    isDefault: true,
  },
  {
    id: "2",
    title: "Work",
    fullAddress: "456 Business Ave, Suite 200, New York, NY 10002",
  },
  {
    id: "3",
    title: "Mom's House",
    fullAddress: "789 Family Lane, Brooklyn, NY 11201",
  },
];

const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  onSelectAddress,
  currentAddress,
}) => {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    title: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    additionalInfo: "",
  });

  const handleAddAddress = () => {
    if (newAddress.title && newAddress.street && newAddress.city) {
      const fullAddress = `${newAddress.street}, ${newAddress.city}, ${newAddress.state} ${newAddress.zipCode}`;
      const newAddr: Address = {
        id: Date.now().toString(),
        title: newAddress.title,
        fullAddress: fullAddress,
      };

      setAddresses([...addresses, newAddr]);
      setNewAddress({
        title: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        additionalInfo: "",
      });
      setShowAddForm(false);
    }
  };

  const handleSelectAddress = (address: Address) => {
    onSelectAddress(address);
    onClose();
  };

  if (showAddForm) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white scroll-auto mt-5 hover:bg-white">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">
                Add New Address
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Address Title</Label>
              <Input
                id="title"
                placeholder="e.g., Home, Work, etc."
                value={newAddress.title}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                placeholder="123 Main Street, Apt 4B"
                value={newAddress.street}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, street: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="New York"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="NY"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                />
              </div>
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                placeholder="10001"
                value={newAddress.zipCode}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, zipCode: e.target.value })
                }
              />
            </div> */}

            {/* <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Info (Optional)</Label>
              <Textarea
                id="additionalInfo"
                placeholder="Delivery instructions, landmarks, etc."
                value={newAddress.additionalInfo}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    additionalInfo: e.target.value,
                  })
                }
                className="resize-none"
                rows={3}
              />
            </div> */}

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddAddress}
                className="flex-1 bg-green-600 text-white hover:bg-green-700"
                disabled={
                  !newAddress.title || !newAddress.street || !newAddress.city
                }
              >
                Add Address
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white hover:bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Select Delivery Address
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                address.fullAddress === currentAddress
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200"
              }`}
              onClick={() => handleSelectAddress(address)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">
                      {address.title}
                    </span>
                    {address.isDefault && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 ml-6">
                    {address.fullAddress}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={() => setShowAddForm(true)}
            className="w-full border-dashed border-gray-300 hover:border-gray-400 py-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Address
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddressModal;
