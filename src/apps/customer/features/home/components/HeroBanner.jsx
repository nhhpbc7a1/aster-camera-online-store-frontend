import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

// Swiper styles (required, otherwise slides will stack vertically)
import "swiper/css";
import "swiper/css/navigation";
import HeroSlide from "./HeroSlide";
import productService from "@/domains/product/services/productService";

function HeroBanner() {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTopProducts = async () => {
            try {
                setLoading(true);
                // Get all products
                const products = await productService.getProducts();

                // Sort by price (descending) and take top 10
                const topProducts = [...products]
                    .sort((a, b) => {
                        const priceA = parseFloat(a.salePrice || a.price);
                        const priceB = parseFloat(b.salePrice || b.price);
                        return priceB - priceA;
                    })
                    .slice(0, 10);

                // Transform products to slide format
                const slideData = topProducts.map(product => ({
                    bg: "https://bncamera.com/wp-content/uploads/2026/03/background-bncamera-1400x571.webp",
                    product: product.image,
                    title: product.name,
                    desc: product.description || "Sản phẩm cao cấp với chất lượng hàng đầu, đáp ứng mọi nhu cầu chuyên nghiệp.",
                    productId: product.id,
                    price: product.salePrice || product.price
                }));

                setSlides(slideData);
            } catch (error) {
                console.error("Error loading top products for hero banner:", error);
                // Fallback to empty array or keep loading
                setSlides([]);
            } finally {
                setLoading(false);
            }
        };

        loadTopProducts();
    }, []);

    return (
        <>
            {loading ? (
                <div className="container mx-auto h-[600px] flex items-center justify-center bg-gray-100 rounded-xl">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải...</p>
                    </div>
                </div>
            ) : slides.length === 0 ? (
                <div className="container mx-auto h-[600px] flex items-center justify-center bg-gray-100 rounded-xl">
                    <p className="text-gray-600">Không có sản phẩm nào để hiển thị</p>
                </div>
            ) : (
                <Swiper
                    modules={[Navigation, Autoplay]}
                    navigation
                    autoplay={{ delay: 4000 }}
                    loop
                    className="container mx-auto"
                >
                    {slides.map((slide, i) => (
                        <SwiperSlide key={i}>
                            <HeroSlide {...slide} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </>
    );
}

export default HeroBanner;