import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useToast } from "../../hooks/use-toast";
import { Save } from "lucide-react";
import { validateUserForm } from "../../utils/validation";
import { useLocation, useNavigate } from "react-router-dom";
import { editUser } from "../../server/server";

interface UserData {
  username: string;
  email: string;
  phoneNumber: string;
  whatsAppNumber: string;
}

const EditUser = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const user = location.state.userData;

  const [userData, setUserData] = useState<UserData>(user);
  const [errors, setErrors] = useState<Partial<UserData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const hasChanges = JSON.stringify(userData) !== JSON.stringify(user);

  const isFormValid = Object.keys(validateUserForm(userData)).length === 0;

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateUserForm(userData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    try {
      await editUser(
        user.id,
        userData.username,
        userData.phoneNumber,
        userData.whatsAppNumber
      );
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        duration: 3000,
      });
      navigate("/user/profile");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUserData(user);
    setErrors({});
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
        <p className="text-gray-600">
          Manage your personal information and preferences
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl text-gray-800">
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details below. All fields are required.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700"
                >
                  Full Name *
                </Label>
                <Input
                  id="username"
                  value={userData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  placeholder="Enter your full name"
                  className={`transition-colors ${
                    errors.username
                      ? "border-red-500 focus:border-red-500"
                      : "focus:border-blue-500"
                  }`}
                />
                {errors.username && (
                  <p className="text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phoneNumber"
                  className="text-sm font-medium text-gray-700"
                >
                  Phone Number *
                </Label>
                <Input
                  id="phoneNumber"
                  value={userData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  placeholder="05481234567"
                  className={`transition-colors ${
                    errors.phoneNumber
                      ? "border-red-500 focus:border-red-500"
                      : "focus:border-blue-500"
                  }`}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-600">{errors.phoneNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="whatsAppNumber"
                  className="text-sm font-medium text-gray-700"
                >
                  WhatsApp Number *
                </Label>
                <Input
                  id="whatsAppNumber"
                  value={userData.whatsAppNumber}
                  onChange={(e) =>
                    handleInputChange("whatsAppNumber", e.target.value)
                  }
                  placeholder="05481234567"
                  className={`transition-colors ${
                    errors.whatsAppNumber
                      ? "border-red-500 focus:border-red-500"
                      : "focus:border-blue-500"
                  }`}
                />
                {errors.whatsAppNumber && (
                  <p className="text-sm text-red-600">
                    {errors.whatsAppNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button
                  variant={"outline"}
                  onClick={() => navigate("/user/profile")}
                  className="order-2 sm:order-1 text-black"
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={!hasChanges || isLoading}
                  className="order-2 sm:order-1"
                  type="button"
                >
                  Reset Changes
                </Button>
                <Button
                  type="submit"
                  disabled={!hasChanges || !isFormValid || isLoading}
                  className="order-1 sm:order-2 bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
              {!hasChanges && (
                <p className="text-sm text-gray-500 mt-3 text-center">
                  No changes to save
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default EditUser;
