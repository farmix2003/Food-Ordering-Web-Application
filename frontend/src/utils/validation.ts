interface UserData {
  username: string;
  email: string;
  phoneNumber: string;
  whatsAppNumber: string;
}

export const validateUserForm = (data: UserData): Partial<UserData> => {
  const errors: Partial<UserData> = {};

  if (!data.username.trim()) {
    errors.username = "Full name is required";
  } else if (data.username.trim().length < 2) {
    errors.username = "Full name must be at least 2 characters";
  } else if (!/^[a-zA-Z\s]+$/.test(data.username.trim())) {
    errors.username = "Full name can only contain letters and spaces";
  }

  if (!data.email.trim()) {
    errors.email = "Email address is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Please enter a valid email address";
  }
  if (!data.phoneNumber.trim()) {
    errors.phoneNumber = "Phone number is required";
  } else if (!/^\+?[\d\s\-()]+$/.test(data.phoneNumber.trim())) {
    errors.phoneNumber = "Please enter a valid phone number";
  }

  if (!data.whatsAppNumber.trim()) {
    errors.whatsAppNumber = "WhatsApp number is required";
  } else if (!/^\+?[\d\s\-()]+$/.test(data.whatsAppNumber.trim())) {
    errors.whatsAppNumber = "Please enter a valid WhatsApp number";
  }

  return errors;
};
