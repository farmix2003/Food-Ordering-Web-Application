// AddressModal.tsx
import React, { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface Address {
  id: number;
  streetName: string;
  cityName: string;
  apartment: string;
}

interface AddressInput {
  streetName: string;
  cityName: string;
  apartment: string;
}

interface AddressModalProps {
  isOpen: boolean;
  addressList: Address[];
  currentAddress: string;
  onClose: () => void;
  onSelectAddress: (address: Address) => void;
  onAddAddress: (input: AddressInput) => void;
  onEditAddress: (id: number, input: AddressInput) => void;
  onDeleteAddress: (id: number) => void;
}

const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  addressList,
  currentAddress,
  onClose,
  onSelectAddress,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState<AddressInput>({
    streetName: "",
    cityName: "",
    apartment: "",
  });

  const handleSubmit = () => {
    if (!formData.streetName || !formData.cityName || !formData.apartment) return;
    if (isEditing && editId !== null) {
      onEditAddress(editId, formData);
    } else {
      onAddAddress(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ streetName: "", cityName: "", apartment: "" });
    setShowForm(false);
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {showForm ? (isEditing ? "Edit Address" : "Add Address") : "Select Address"}
          </DialogTitle>
        </DialogHeader>

        {showForm ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street</Label>
              <Input
                id="street"
                value={formData.streetName}
                onChange={(e) => setFormData({ ...formData, streetName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.cityName}
                onChange={(e) => setFormData({ ...formData, cityName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apartment">Apartment</Label>
              <Input
                id="apartment"
                value={formData.apartment}
                onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={resetForm} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="flex-1 bg-green-600 text-white">
                {isEditing ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 py-4">
            {addressList.map((addr) => (
              <div
                key={addr.id}
                className={`p-3 border rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-50 ${
                  `${addr.apartment}, ${addr.streetName}, ${addr.cityName}` === currentAddress
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200"
                }`}
                onClick={() => onSelectAddress(addr)}
              >
                <div className="text-sm text-gray-700">
                  {addr.apartment}, {addr.streetName}, {addr.cityName}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowForm(true);
                      setIsEditing(true);
                      setEditId(addr.id);
                      setFormData({
                        apartment: addr.apartment,
                        cityName: addr.cityName,
                        streetName: addr.streetName,
                      });
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteAddress(addr.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              onClick={() => {
                setShowForm(true);
                setIsEditing(false);
                setFormData({ streetName: "", cityName: "", apartment: "" });
              }}
              variant="outline"
              className="w-full border-dashed"
            >
              <Plus className="w-4 h-4 mr-2" /> Add New Address
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddressModal;
