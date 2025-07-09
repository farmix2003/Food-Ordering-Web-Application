import axios from "./api.ts";

const loginUser = async (email: string, password: string) => {
  const response = await axios.post("/auth/signin", { email, password });
  const { jwt } = response.data;
  window.localStorage.setItem("token", jwt);
  window.localStorage.setItem("token_timestamp", Date.now().toString());
  return response.data;
};

const registerUser = async (
  email: string,
  password: string,
  username: string,
  phoneNumber: string,
  whatsAppNumber: string,
  role: string
) => {
  const response = await axios.post("/auth/signup", {
    email,
    password,
    username,
    phoneNumber,
    whatsAppNumber,
    role,
  });
  return response.data;
};

const logoutUser = async () => {
  const response = await axios.post(
    "/auth/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
};

const getUserByJwt = async () => {
  const response = await axios.get("/public/profile", {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

const editUser = async (
  id: number,
  username: string,
  phoneNumber: string,
  whatsAppNumber: string
) => {
  const response = await axios.put(
    `/public/user/edit/${id}`,
    { username, phoneNumber, whatsAppNumber },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
};

const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

const checkTokenExpiry = () => {
  const token = window.localStorage.getItem("token");
  const timestamp = window.localStorage.getItem("token_timestamp");
  if (token && timestamp) {
    const now = Date.now();
    if (now - parseInt(timestamp, 10) > TOKEN_EXPIRY_MS) {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("token_timestamp");
      window.location.href = "/login";
    }
  }
};

const addUserAddress = async (
  streetName: string,
  apartment: string,
  cityName: string
) => {
  const response = axios.post(
    "/public/user/address/add",
    { streetName, apartment, cityName },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    }
  );
  return (await response).data;
};

const editUserAddress = async (
  id: number,
  streetName: string,
  apartment: string,
  cityName: string
) => {
  const response = await axios.put(
    `/public/user/edit/address/${id}`,
    { streetName, apartment, cityName },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
};

const removeAddress = async (id: number) => {
  const response = await axios.delete("/public/user/delete/address/" + id, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  });
  return response;
};

const getAllUsers = async () => {
  const response = await axios.get("/admin/get-users", {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

const changeUserStatus = async (id: number, status: string) => {
  const response = await axios.put(
    `/admin/change-status/${id}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
};

const getAllRestaurants = async () => {
  const response = await axios.get("/public/restaurants", {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

const getRestaurantByUserId = async () => {
   
  const response = await axios.get("/admin/restaurant/user", {
    headers:{
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    }
  })
  if (response.status !== 200) {
    throw new Error("Failed to fetch restaurant data");
  }
  console.log("Restaurant data fetched successfully:", response.data);
  return response.data;

}
const createRestaurant = async (
  name: string,
  description: string,
  address: {
    streetName: string;
    cityName: string;
  },
  openingHours:string,
  closingHours: string,
  cuisineType: string,
  images: File | Blob,
  contactInfo: {
    email: string;
    phone: string;
    whatsApp: string;
    instagram: string;
  },
) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("address.streetName", address.streetName);
  formData.append("address.cityName", address.cityName);
  formData.append("openingHours", openingHours);
  formData.append("closingHours", closingHours);
  formData.append("cuisineType", cuisineType);
  formData.append("images", images);
 formData.append("contactInfo.email", contactInfo.email);
formData.append("contactInfo.phone", contactInfo.phone);
formData.append("contactInfo.whatsApp", contactInfo.whatsApp);
formData.append("contactInfo.instagram", contactInfo.instagram);

  const response = await axios.post("/admin/restaurant/add-restaurant", formData,
   {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  });
  
  return response.data;
}

const updateRestaurant = async (
  id: number,
  name: string,
  description: string,
  address: {
    streetName: string;
    cityName: string;
  },
  openingHours:string,
  closingHours: string,
  cuisineType: string,
  contactInfo: {
    email: string;
    phone: string;
    whatsApp: string;
    instagram: string;
  },
 ) => {

   const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("address.streetName", address.streetName);
  formData.append("address.cityName", address.cityName);
  formData.append("openingHours", openingHours);
  formData.append("closingHours", closingHours);
  formData.append("cuisineType", cuisineType);
 formData.append("contactInfo.email", contactInfo.email);
formData.append("contactInfo.phone", contactInfo.phone);
formData.append("contactInfo.whatsApp", contactInfo.whatsApp);
formData.append("contactInfo.instagram", contactInfo.instagram);


  const response = await axios.put(
    "/admin/restaurant/update/"+id,
    formData,
    {
      headers: {
        "Content-Type": "form-data",
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
}

const deleteRestaurant = async (id: number) => {
  const response = await axios.delete("/admin/restaurant/delete/" + id, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  });
  return response.data;
}

const addImageToRestaurant = async (id:number, image: File | Blob) => {
  const formData = new FormData();
  formData.append("image", image);

  const response = await axios.post(
    `/admin/restaurant/${id}/add`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
}

const deleteImageFromRestaurant = async (id: number, imagesId: number) => {
   const response = await axios.delete(`/admin/restaurant/${id}/delete?ids=${imagesId}`, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  });
  return response.data;
}

const updateRestaurantStatus = async(id:number) =>{
  const response = await axios.put(`/admin/restaurant/${id}/status`, {}, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  });
  return response.data;
}


const addMenuItem = async (
  restaurantId:number, 
  foodName: string,
  price: number,
  images: File | Blob,
  description: string,
  extrasIds: number[] = [],
  categoryId: number | null = null
) =>{
  const formData = new FormData();
  formData.append("foodName", foodName);
  formData.append("price", price.toString());
  formData.append("images", images);
  formData.append("description", description);
  formData.append("restaurantId", restaurantId.toString());
  if (extrasIds.length > 0) {
    extrasIds.forEach(id =>{
      formData.append("extrasIds", id.toString());
    })
  }
  if (categoryId !== null) {
    formData.append("categoryId", categoryId.toString());
  }
  const response = await axios.post(`/admin/${restaurantId}/add-food`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  });
  return response.data;
}

const getMenuItemsByRestaurantId = async (restaurantId: number) => {
  const response = await axios.get(`/admin/menu/${restaurantId}`, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  });
  return response.data;
}

const addCategoryToRestaurant = async (restaurantId:number, categoryName:string) =>{
   const response = await axios.post(`/admin/category/${restaurantId}/add`, 
    { categoryName },
    {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    }
  );
  return response.data.id;
}

const getCategoriesByRestaurantId = async (restaurantId: number) => {
  const response = await axios.get(`/admin/category/${restaurantId}`, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

const addExtrasToMenuItem = async (restaurantId:number, name:string,price:number):Promise<number> =>{
  const response = await axios.post(
    `/admin/extras/${restaurantId}/add`,
    { name, price },
    {
      headers: {
        "Content-Type":'application/json',
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    }
  );
  return response.data.id;
}
const getExtrasByRestaurantId = async (restaurantId: number) => {
  const response = await axios.get(`/admin/extras/${restaurantId}`, {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  });
  return response.data;
}
const getRestaurantById = async(id:number) =>{
  const response = await axios.get(`/public/restaurants/${id}`,{
    headers:{
      Authorization: `Bearer ${window.localStorage.getItem("token")}`
    }
  })
  return response.data
}

const getRestaurantForlandingPage = async() =>{
  const response = await axios.get('/all/restaurants')
  return response.data;
}

const getMenusForLandingPage = async () =>{
  const response = await axios.get('/all/menu')
  return response.data
}
const addItemToCart = async(itemData:{foodId:number, quantity:number, extrasIds:number[]}) =>{
 
  

  const response = await axios.post('/public/add',itemData,
{
    headers:{
      Authorization:  `Bearer ${window.localStorage.getItem("token")}`
    }
  })
  return response.data
}

const getCartByUserId = async (id:number) =>{
  const response = await axios.get(`/public/user-cart/${id}`, {
    headers:{
      Authorization:`Bearer ${window.localStorage.getItem("token")}`
    }
  });
  console.log("data accepted: ",response.data)
  return response.data;
}

const updateCartItem = async(itemId:number, quantity:number) =>{
  const data = await axios.put(`/public/update/${itemId}?quantity=${quantity}`,null,{
    headers:{
      Authorization: `Bearer ${window.localStorage.getItem("token")}`
    }
  })
  return data.data
}
const deleteCartItem = async(id:number) =>{
  const response = await axios.delete(`/public/delete/${id}`,{
    headers:{
      Authorization: `Bearer ${window.localStorage.getItem('token')}`
    }
  })
  return response.data
}

const  clearCart = async(id:number) =>{
  const response = await axios.delete(`/public/clear/${id}`,{
    headers:{
      Authorization:`Bearer ${window.localStorage.getItem('token')}`
    }
  })
  return response.data
}


export {
  loginUser,
  registerUser,
  getUserByJwt,
  logoutUser,
  editUser,
  checkTokenExpiry,
  addUserAddress,
  editUserAddress,
  removeAddress,
  getAllUsers,
  changeUserStatus,
  getAllRestaurants,
  getRestaurantByUserId,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  addImageToRestaurant,
  deleteImageFromRestaurant,
  updateRestaurantStatus,
  addMenuItem,
  addCategoryToRestaurant,
  getCategoriesByRestaurantId,
  addExtrasToMenuItem,
  getMenuItemsByRestaurantId,
  getExtrasByRestaurantId,
  getRestaurantById,
  getRestaurantForlandingPage,
  getMenusForLandingPage,
  addItemToCart,
  getCartByUserId,
  updateCartItem,
  deleteCartItem,
  clearCart
};