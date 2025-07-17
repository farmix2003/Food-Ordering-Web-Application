import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";
import {
  addUserAddress,
  editUserAddress,
  getUserByJwt,
  removeAddress,
} from "../../server/server";
import { t } from "i18next";

interface Address {
  id: number;
  streetName: string;
  apartment: string;
  cityName: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  whatsAppNumber: string;
  avatar: string;
  status: string;
  addressList: Address[];
}

const UserOverview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    apartment: "",
    streetName: "",
    cityName: "",
  });
  const [user, setUser] = useState<User | null>(null);

  const getUser = () => {
    const data = getUserByJwt();
    data.then((data) => setUser(data));
  };

  useEffect(() => {
    getUser();
  });

  const handleEditProfile = () => {
    navigate(`/user/edit`, { state: { userData: user } });
    toast({
      title: "Navigation",
      description: "Redirecting to edit profile page...",
    });
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      streetName: "",
      cityName: "",
      apartment: "",
    });
    setAddressModalOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      streetName: address.streetName,
      cityName: address.cityName,
      apartment: address.apartment,
    });
    setAddressModalOpen(true);
  };

  const handleDeleteAddress = (addressId: number) => {
    setAddressToDelete(addressId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteAddress = () => {
    if (addressToDelete) {
      console.log(`Deleting address with ID: ${addressToDelete}`);
      const data = removeAddress(addressToDelete);
      data
        .then(() => {
          getUser();
          toast({
            title: "Address Deleted",
            description: "The address has been successfully removed.",
          });
        })
        .catch((error) => {
          console.error("Error deleting address:", error);
          toast({
            title: "Error",
            description: "Failed to delete address. Please try again.",
            variant: "destructive",
          });
        });
    }
    setDeleteDialogOpen(false);
    setAddressToDelete(null);
  };

  const handleSaveAddAddress = () => {
    const data = addUserAddress(
      addressForm.streetName,
      addressForm.apartment,
      addressForm.cityName
    );
    data
      .then(() => {
        toast({
          title: "Address Added",
          description: "The new address has been successfully added.",
        });
        setAddressModalOpen(false);
        setEditingAddress(null);
        getUser();
      })
      .catch((error) => {
        console.error("Error adding address:", error);
        toast({
          title: "Error",
          description: "Failed to add address. Please try again.",
          variant: "destructive",
        });
      });
  };

  const handleSaveAddress = () => {
    if (editingAddress) {
      console.log(
        `Updating address with ID: ${editingAddress.id}`,
        addressForm
      );
     const data = editUserAddress(editingAddress.id, addressForm.streetName, addressForm.apartment, addressForm.cityName);
     console.log(data)
    } else {
      console.log("Creating new address:", addressForm);
      handleSaveAddAddress();
    }
    setAddressModalOpen(false);
    setEditingAddress(null);
  };

  const handleCancelAddress = () => {
    setAddressModalOpen(false);
    setEditingAddress(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backHome")}
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t('userOverview')}
          </h1>
          <p className="text-gray-600">{t('userManagementText')}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Profile Section */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader className="text-center pb-2">
                <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary">
                  {/* <AvatarImage src={use/r.avatar} alt={user.fullName} /> */}
                  <AvatarFallback className="text-2xl">
                    <User className="w-16 h-16" />
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl font-semibold mb-6">
                  {user?.username}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{user?.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">WhatsApp</p>
                      <p className="font-medium">{user?.whatsAppNumber}</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleEditProfile}
                  className="w-full text-white bg-blue-950 hover:text-white"
                  size="lg"
                  variant={"outline"}
                >
                  <Edit className="mr-2 w-4 h-4" />
                  {t('editProfile')}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Addresses Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center text-2xl">
                      <MapPin className="mr-2 w-6 h-6" />
                      {t("addresses",{number:user?.addressList.length})}
                    </CardTitle>
                    <CardDescription>{t('addressManagement')}</CardDescription>
                  </div>
                  <Button
                    variant={"outline"}
                    size={"lg"}
                    onClick={handleAddAddress}
                    className="flex items-center text-white bg-blue-950 hover:text-white"
                  >
                    <Plus className="mr-2 w-4 h-4" />
                    {t('addAddress')}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {user?.addressList.map((address) => (
                  <Card
                    key={address.id}
                    className="border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <p className="font-medium text-gray-900">
                          {address.streetName}, {address.apartment}
                        </p>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="p-2 border-cyan-100 hover:text-2xl"
                            onClick={() => handleEditAddress(address)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="p-2 border-red-100 text-white bg-red-600 hover:text-2xl"
                            onClick={() => handleDeleteAddress(address.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          {address.cityName}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Address Modal */}
        <Dialog open={addressModalOpen} onOpenChange={setAddressModalOpen}>
          <DialogContent className="sm:max-w-[500px] bg-white hover:bg-white">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? t('editAddress') : t('addAddress')}
              </DialogTitle>
              <DialogDescription>
                {editingAddress
                  ? t("editAddressDesc")
                  : t('addAddressDesc')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="street">{t('streetName')}</Label>
                <Input
                  id="street"
                  value={addressForm.streetName}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      streetName: e.target.value,
                    })
                  }
                  placeholder="Enter street address"
                />
              </div>
              <div className="grid gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="city">{t('cityName')}</Label>
                  <Input
                    id="city"
                    value={addressForm.cityName}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        cityName: e.target.value,
                      })
                    }
                    placeholder="Enter city"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="apartment">Apartment</Label>
                  <Input
                    id="apartment"
                    value={addressForm.apartment}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        apartment: e.target.value,
                      })
                    }
                    placeholder="Enter apartment"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelAddress}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveAddress}
                variant={"outline"}
                className="bg-green-700 text-white border-green-700"
              >
                {editingAddress ? t('updateAddress') : t('saveAddress')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('confirmAddressDeletion')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('deleteAddressConfirmDesc')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteAddress}
                className="bg-red-600 hover:bg-red-700"
              >
                {t("deleteAddress")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default UserOverview;
