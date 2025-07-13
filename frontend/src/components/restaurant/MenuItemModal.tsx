import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Trash2, Plus, Save, X } from "lucide-react";
import { addImage, updateMenuItem } from "../../server/server";
import { toast } from "../../hooks/use-toast"; // Assuming toast is imported

interface Image {
  id: number;
  url: string;
  fileName: string;
}

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: File | null;
  description: string;
  extras: { id: number; name: string; price: number }[];
}

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<MenuItem, "id"> & { extrasIds: number[]; categoryId: number | null }) => void;
  editingItem: MenuItem | null;
  extras: { id: number; name: string }[];
  categories: { id: number; categoryName: string }[];
  onAddExtra: (name: string, price: number) => Promise<number>;
  onAddCategory: (name: string) => Promise<number>;
  existingImages: Image[];
  onDeleteExtra: (id: number) => void;
  onDeleteImage: (menuId: number, imageId: number, existingImages: Image[]) => void;
  onRefreshMenuItems: () => Promise<void>; // Added as per previous suggestion
}

const MenuItemModal = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  categories,
  onAddExtra,
  onAddCategory,
  existingImages,
  onDeleteExtra,
  onDeleteImage,
  onRefreshMenuItems,
}: MenuItemModalProps) => {
  const isEditMode = !!editingItem;

  // Define the Extra type explicitly to include optional id
  interface Extra {
    id?: number;
    name: string;
    price: number;
  }

  const [formData, setFormData] = useState<{
    name: string;
    price: number;
    image: File | null;
    description: string;
    extras: Extra[];
  }>({
    name: "",
    price: 0,
    image: null,
    description: "",
    extras: [{ name: "", price: 0 }],
  });

  const [selectedExtrasIds, setSelectedExtrasIds] = useState<number[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setFormData({
          name: editingItem.name,
          price: editingItem.price,
          image: null,
          description: editingItem.description,
          extras: editingItem.extras.length > 0
            ? editingItem.extras.map((extra) => ({ id: extra.id, name: extra.name, price: extra.price }))
            : [{ name: "", price: 0 }],
        });
        setSelectedExtrasIds(editingItem.extras.map((extra) => extra.id));
      } else {
        setFormData({
          name: "",
          price: 0,
          image: null,
          description: "",
          extras: [{ name: "", price: 0 }],
        });
        setSelectedExtrasIds([]);
      }
      setSelectedCategoryId(null);
      setNewCategoryName("");
    }
  }, [isOpen, editingItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validExtras = formData.extras.filter((e) => e.name && e.price);
    const newExtraIds: number[] = [];

    for (const extra of validExtras) {
      if (!extra.id) {
        const id = await onAddExtra(extra.name, extra.price);
        newExtraIds.push(id);
      } else {
        newExtraIds.push(extra.id);
      }
    }

    let categoryIdToUse = selectedCategoryId;
    if (!selectedCategoryId && newCategoryName.trim()) {
      categoryIdToUse = await onAddCategory(newCategoryName.trim());
    }

    const extrasIds = [...selectedExtrasIds, ...newExtraIds];

    if (isEditMode && editingItem) {
      try {
        if (formData.image) {
          await addImage(editingItem.id, formData.image);
        }
       
        await updateMenuItem(
          editingItem.id,
          formData.name,
          formData.description,
          formData.price,
          categoryIdToUse || 0,
          extrasIds
        );


        toast({
          title: "Menu Item Updated",
          description: "The menu item has been updated successfully.",
        });

        // Refresh menu items
        await onRefreshMenuItems();
      } catch (error) {
        console.error("Failed to update menu item:", error);
        toast({
          title: "Error",
          description: "Failed to update menu item.",
          variant: "destructive",
        });
      }
    } else {
      // Add new menu item
      onSave({
        name: formData.name,
        price: formData.price,
        image: formData.image,
        description: formData.description,
        extras: [],
        extrasIds,
        categoryId: categoryIdToUse,
      });
    }

    setFormData({ name: "", price: 0, image: null, description: "", extras: [{ name: "", price: 0 }] });
    setSelectedExtrasIds([]);
    setSelectedCategoryId(null);
    setNewCategoryName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle>{isEditMode ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Item Name *</Label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div>
              <Label>Price *</Label>
              <Input
                required
                type="number"
                value={formData.price}
                onChange={(e) => setFormData((p) => ({ ...p, price: Number(e.target.value) }))}
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <Label>Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData((p) => ({ ...p, image: e.target.files?.[0] || null }))}
            />
            {formData.image && <p className="text-sm mt-1">{formData.image.name}</p>}
            {isEditMode &&
              existingImages.map((img) => (
                <div key={img.id} className="relative group mt-2">
                  <img src={img.url} alt={img.fileName} className="w-full h-32 object-cover rounded-lg border" />
                  <p className="text-sm text-gray-600 mt-1">{img.fileName}</p>
                  <button
                    type="button"
                    onClick={() => onDeleteImage(editingItem!.id, img.id, existingImages)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 cursor-pointer rounded-full opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          {/* Extras */}
          <div>
            <Label>Extras</Label>
            <Card>
              <CardContent className="space-y-3 p-4">
                {formData.extras.map((extra, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Name"
                      value={extra.name}
                      onChange={(e) => {
                        const extras = [...formData.extras];
                        extras[index].name = e.target.value;
                        setFormData((p) => ({ ...p, extras }));
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      value={extra.price}
                      onChange={(e) => {
                        const extras = [...formData.extras];
                        extras[index].price = parseFloat(e.target.value) || 0;
                        setFormData((p) => ({ ...p, extras }));
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={async () => {
                        // Only attempt to delete from backend if extra has an id
                        if (extra.id !== undefined) {
                          try {
                            await onDeleteExtra(extra.id);
                            setSelectedExtrasIds((prev) => prev.filter((id) => id !== extra.id));
                            toast({
                              title: "Extra Deleted",
                              description: "The extra has been deleted successfully.",
                            });
                          } catch (error) {
                            console.error("Failed to delete extra:", error);
                            toast({
                              title: "Error",
                              description: "Failed to delete the extra.",
                              variant: "destructive",
                            });
                            return;
                          }
                        }

                        // Remove the extra from formData.extras
                        const updatedExtras = [...formData.extras];
                        updatedExtras.splice(index, 1);
                        setFormData((prev) => ({ ...prev, extras: updatedExtras }));
                      }}
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setFormData((p) => ({ ...p, extras: [...p.extras, { name: "", price: 0 }] }))
                  }
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Extra
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <select
              className="w-full mt-1 border rounded px-3 py-2"
              value={selectedCategoryId ?? ""}
              onChange={(e) => setSelectedCategoryId(Number(e.target.value) || null)}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
            <div className="mt-2">
              <Label>Or Add New Category</Label>
              <Input
                placeholder="New Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-orange-600 text-white hover:bg-orange-700">
              <Save className="w-4 h-4 mr-2" />
              {isEditMode ? "Update Item" : "Add Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemModal;