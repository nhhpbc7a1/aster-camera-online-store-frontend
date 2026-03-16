import HeroBanner from "@/apps/customer/features/home/components/HeroBanner";
import PromoBanner from "@/apps/customer/features/home/components/PromoBanner";
import FlashSale from "@/apps/customer/features/home/components/FlashSale";
import ProductSection from "@/apps/customer/features/home/components/ProductSection";
import ReviewSection from "@/apps/customer/features/home/components/ReviewSection";
import StoreSection from "@/apps/customer/features/home/components/StoreSection";
import NewsSection from "@/apps/customer/features/home/components/NewsSection";
import thuCuDoiMoiImage from "@/assets/thu-cu-doi-moi.png";
import hangCuImage from "@/assets/hang-cu-gia-chat.png";
import mayAnhImage from "@/assets/may-anh-chuyen-nghiep.png";
import ongKinhImage from "@/assets/ong-kinh-may-anh.png";
import cameraImage from "@/assets/camera-hanh-dong.png";
import microImage from "@/assets/thiet-bi-ghi-am.png";
import gimbalImage from "@/assets/thiet-bi-chong-rung.png";

function HomePage() {
    return (
        <div className="space-y-10">

            <HeroBanner />


            <div className="container mx-auto ">
                <PromoBanner image={thuCuDoiMoiImage} />

                <FlashSale />

                <PromoBanner image={mayAnhImage} />

                <ProductSection title="TOP MÁY ẢNH" />

                <PromoBanner image={ongKinhImage} />

                <ProductSection title="TOP ỐNG KÍNH" />

                <PromoBanner image={cameraImage} />

                <ProductSection title="TOP ACTION CAMERA" />

                <PromoBanner image={microImage} />

                <ProductSection title="TOP MICROPHONE" />

                <PromoBanner image={gimbalImage} />

                <ProductSection title="TOP GIMBAL" />

                <PromoBanner image={hangCuImage} />

                <ProductSection title="TOP ĐỒ CŨ" />

                <ReviewSection />

                <StoreSection />

                {/* <NewsSection /> */}
            </div>
        </div>
    );
}

export default HomePage;