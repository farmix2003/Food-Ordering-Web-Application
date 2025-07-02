import { useState, useEffect } from "react";
import { Plus, X, Save } from "lucide-react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  extras: { name: string; price: number }[];
}

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<MenuItem, "id">) => void;
  editingItem: MenuItem | null;
}

const MenuItemModal = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
}: MenuItemModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    extras: [{ name: "", price: "" }],
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        price: editingItem.price.toString(),
        image: editingItem.image,
        description: editingItem.description,
        extras:
          editingItem.extras.length > 0
            ? editingItem.extras.map((extra) => ({
                name: extra.name,
                price: extra.price.toString(),
              }))
            : [{ name: "", price: "" }],
      });
    } else {
      setFormData({
        name: "",
        price: "",
        image: "",
        description: "",
        extras: [{ name: "", price: "" }],
      });
    }
  }, [editingItem, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validExtras = formData.extras
      .filter((extra) => extra.name.trim() !== "" && extra.price.trim() !== "")
      .map((extra) => ({
        name: extra.name.trim(),
        price: parseFloat(extra.price),
      }));

    const menuItem = {
      name: formData.name,
      price: parseFloat(formData.price),
      image: formData.image,
      description: formData.description,
      extras: validExtras,
    };

    onSave(menuItem);
  };

  const addExtraRow = () => {
    setFormData((prev) => ({
      ...prev,
      extras: [...prev.extras, { name: "", price: "" }],
    }));
  };

  const removeExtraRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      extras: prev.extras.filter((_, i) => i !== index),
    }));
  };

  const updateExtra = (
    index: number,
    field: "name" | "price",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      extras: prev.extras.map((extra, i) =>
        i === index ? { ...extra, [field]: value } : extra
      ),
    }));
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* <DialogHeader> */}
        <DialogTitle>
          {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
        </DialogTitle>
        {/* </DialogHeader> */}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                required
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, image: e.target.value }))
              }
              className="mt-1"
            />
            {formData.image && (
              <div className="mt-3">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Extras</Label>
              <Button
                type="button"
                onClick={addExtraRow}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Extra
              </Button>
            </div>

            <Card>
              <CardContent className="p-4 space-y-3">
                {formData.extras.map((extra, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Extra name (e.g., Extra Cheese)"
                      value={extra.name}
                      onChange={(e) =>
                        updateExtra(index, "name", e.target.value)
                      }
                      className="flex-1"
                    />
                    <Input
                      placeholder="Price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={extra.price}
                      onChange={(e) =>
                        updateExtra(index, "price", e.target.value)
                      }
                      className="w-24"
                    />
                    {formData.extras.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeExtraRow(index)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {formData.extras.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-2">
                    No extras added yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 text-white bg-orange-600 hover:bg-orange-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {editingItem ? "Update Item" : "Add Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemModal;
