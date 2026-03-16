import storeImage1 from "@/assets/store-image-1.png";
import storeImage2 from "@/assets/store-image-2.png";
import storeImage3 from "@/assets/store-image-3.png";
import storeImage4 from "@/assets/store-image-4.png";

export const mockStores = [
  {
    id: 1,
    name: "ASTER Production",
    address: "202, Đường Lê Văn Việt, Phường 1, Quận 10, TP.HCM",
    phones: ["0794352262"],
    email: "asterproduction333@gmail.com",
    hours: "8:00 AM - 9:00 PM",
    latitude: 21.0285,
    longitude: 105.7842,
    featured: true,
    description: "Cửa hàng chính, phục vụ toàn bộ TP.HCM",
    image: storeImage1,
  },
  {
    id: 2,
    name: "ASTER Production",
    address: "202, Đường Lê Duẩn, Phường 3, Quận 10, TP.HCM",
    phones: ["0794352262"],
    email: "asterproduction333@gmail.com",
    hours: "8:00 AM - 9:00 PM",
    latitude: 21.0285,
    longitude: 105.7853,
    featured: false,
    description: "Cửa hàng chính, phục vụ toàn bộ TP.HCM",
    image: storeImage2,
  },
  {
    id: 3,
    name: "ASTER Production",
    address: "202, Đường Nguyễn Đình Chiểu, Phường 3, Quận 3, TP.HCM",
    phones: ["0794352262"],
    email: "asterproduction333@gmail.com",
    hours: "8:00 AM - 9:00 PM",
    latitude: 21.0285,
    longitude: 105.7853,
    featured: false,
    description: "Cửa hàng chính, phục vụ toàn bộ TP.HCM",
    image: storeImage3,
  },
  {
    id: 4,
    name: "ASTER Production",
    address: "321 Lê Hồng Phong, Phường 2, Quận 10, Hồ Chí Minh",
    phones: ["0794352262"],
    email: "asterproduction333@gmail.com",
    hours: "8:00 AM - 9:00 PM",
    latitude: 21.0285,
    longitude: 105.7842,
    featured: false,
    description: "Cửa hàng chính, phục vụ toàn bộ TP.HCM",
    image: storeImage4,
  },
];

export const storeCategories = [
  {
    id: 1,
    name: "MẦY ẢNH",
    image: "https://via.placeholder.com/150?text=Camera",
  },
  {
    id: 2,
    name: "ỐNG KÍNH",
    image: "https://via.placeholder.com/150?text=Lens",
  },
  {
    id: 3,
    name: "PHỤ KIỆN",
    image: "https://via.placeholder.com/150?text=Accessories",
  },
  {
    id: 4,
    name: "TRIPOD",
    image: "https://via.placeholder.com/150?text=Tripod",
  },
  {
    id: 5,
    name: "LIGHTING",
    image: "https://via.placeholder.com/150?text=Lighting",
  },
  {
    id: 6,
    name: "EDITING",
    image: "https://via.placeholder.com/150?text=Editing",
  },
  {
    id: 7,
    name: "RENTAL",
    image: "https://via.placeholder.com/150?text=Rental",
  },
];
