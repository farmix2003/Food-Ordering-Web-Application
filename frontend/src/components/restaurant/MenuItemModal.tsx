import { useEffect, useState } from "react";
import { Plus, Save, Trash2, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface Image{
  id:number;
  url:string;
  fileName:string
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: File | null;
  description: string;
  extras: { name: string; price: number }[];
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
  existingImages:Image[]
}

const MenuItemModal = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  extras,
  categories,
  onAddExtra,
  onAddCategory,
  existingImages
}: MenuItemModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    image: null as File | null,
    description: "",
    extras: [{ name: "", price: 0 }],
  });
  const [selectedExtrasIds, setSelectedExtrasIds] = useState<number[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        price: editingItem.price,
        image: editingItem.image as File | null,
        description: editingItem.description,
        extras: editingItem.extras,
      });
    } else {
      setFormData({ name: "", price: 0, image: null, description: "", extras: [{ name: "", price: 0 }] });
    }
    setSelectedExtrasIds([]);
    setSelectedCategoryId(null);
    setNewCategoryName("");
  }, [editingItem, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validExtras = formData.extras.filter((e) => e.name && e.price);
    const newExtraIds: number[] = [];

    for (const extra of validExtras) {
      const id = await onAddExtra(extra.name, extra.price);
      newExtraIds.push(id);
    }

    let categoryIdToUse = selectedCategoryId;
    if (!selectedCategoryId && newCategoryName.trim()) {
      categoryIdToUse = await onAddCategory(newCategoryName.trim());
    }

    onSave({
      name: formData.name,
      price: formData.price,
      image: formData.image,
      description: formData.description,
      extras:[],
      extrasIds: [...selectedExtrasIds, ...newExtraIds],
      categoryId: categoryIdToUse,
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle>{editingItem ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Item Name *</Label>
              <Input value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <Label>Price *</Label>
              <Input type="number"  value={formData.price} onChange={(e) => setFormData((p) => ({ ...p, price: Number(e.target.value) }))} required />
            </div>
          </div>

          <div>
            <Label>Image</Label>
            <Input type="file" accept="image/*" onChange={(e) => setFormData((p) => ({ ...p, image: e.target.files?.[0] || null }))} />
            {formData.image && <p className="text-sm mt-1">{formData.image.name}</p>}
            {existingImages.map((img)=>(
              <div key={img.id} className="relative group mt-2">
              <img
                src={img.url}
                alt={img.fileName}
                className="w-full h-32 object-cover rounded-lg border"
              />
              <p className="text-sm text-gray-600 mt-1">{img.fileName}</p>
      
              {/* Delete Icon on Hover */}
              <button
                // onClick={() => handleDeleteImage(img.id)}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            ))}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea rows={3} value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} />
          </div>

          <div>
            <Label>Extras</Label>
            <Card>
              <CardContent className="space-y-3 p-4">
                {formData.extras.map((extra, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input placeholder="Name" value={extra.name} onChange={(e) => {
                      const newExtras = [...formData.extras];
                      newExtras[index].name = e.target.value;
                      setFormData((p) => ({ ...p, extras: newExtras }));
                    }} />
                    <Input type="number" placeholder="Price" value={extra.price} onChange={(e) => {
                      const newExtras = [...formData.extras];
                      newExtras[index].price = parseFloat(e.target.value);
                      setFormData((p) => ({ ...p, extras: newExtras }));
                    }} />
                    <Button type="button" variant="ghost" onClick={() => {
                      const newExtras = formData.extras.filter((_, i) => i !== index);
                      setFormData((p) => ({ ...p, extras: newExtras }));
                    }}><X className="w-4 h-4 text-red-600" /></Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => setFormData((p) => ({ ...p, extras: [...p.extras, { name: "", price: 0 }] }))}>
                  <Plus className="w-4 h-4 mr-1" /> Add Extra
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <Label>Attach Existing Extras</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {extras.map((extra) => (
                <label key={extra.id} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={selectedExtrasIds.includes(extra.id)}
                    onChange={() =>
                      setSelectedExtrasIds((prev) =>
                        prev.includes(extra.id) ? prev.filter((id) => id !== extra.id) : [...prev, extra.id]
                      )
                    }
                  />
                  {extra.name}
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label>Category</Label>
            <select
              className="w-full mt-1 border rounded px-3 py-2"
              value={selectedCategoryId ?? ""}
              onChange={(e) => setSelectedCategoryId(Number(e.target.value) || null)}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
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

          <div className="flex gap-2 pt-4">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-orange-600 text-white hover:bg-orange-700">
              <Save className="w-4 h-4 mr-2" /> {editingItem ? "Update Item" : "Add Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemModal;
