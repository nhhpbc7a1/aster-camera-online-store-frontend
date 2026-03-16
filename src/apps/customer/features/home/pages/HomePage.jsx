import HeroBanner from "@/apps/customer/features/home/components/HeroBanner";
import PromoBanner from "@/apps/customer/features/home/components/PromoBanner";
import FlashSale from "@/apps/customer/features/home/components/FlashSale";
import ProductSection from "@/apps/customer/features/home/components/ProductSection";
import ReviewSection from "@/apps/customer/features/home/components/ReviewSection";
import StoreSection from "@/apps/customer/features/home/components/StoreSection";
import NewsSection from "@/apps/customer/features/home/components/NewsSection";

function HomePage() {
    return (
        <div className="space-y-10">

            <HeroBanner />


            <div className="container mx-auto ">
                <PromoBanner image="https://bncamera.com/wp-content/uploads/2026/03/banner-thu-cu-doi-moi.jpg" />

                <FlashSale />

                <PromoBanner image="https://bncamera.com/wp-content/uploads/2026/03/banner-may-anh.jpg" />

                <ProductSection title="TOP MÁY ẢNH" />

                <PromoBanner image="https://bncamera.com/wp-content/uploads/2026/03/banner-ong-kinh.jpg" />

                <ProductSection title="TOP ỐNG KÍNH" />

                <PromoBanner image="https://bncamera.com/wp-content/uploads/2026/03/banner-camera.jpg" />

                <ProductSection title="TOP ACTION CAMERA" />

                <PromoBanner image="https://bncamera.com/wp-content/uploads/2026/03/banner-micro-thu-am.jpg" />

                <ProductSection title="TOP MICROPHONE" />

                <PromoBanner image="https://bncamera.com/wp-content/uploads/2026/03/banner-gimbal.jpg" />

                <ProductSection title="TOP GIMBAL" />

                <PromoBanner image="https://bncamera.com/wp-content/uploads/2026/03/banner-hang-cu.jpg" />

                <ProductSection title="TOP ĐỒ CŨ" />

                <ReviewSection />

                <StoreSection />

                <NewsSection />
            </div>
        </div>
    );
}

export default HomePage;