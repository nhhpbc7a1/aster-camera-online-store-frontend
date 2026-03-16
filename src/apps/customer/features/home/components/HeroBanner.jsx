import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

// Swiper styles (required, otherwise slides will stack vertically)
import "swiper/css";
import "swiper/css/navigation";
import HeroSlide from "./HeroSlide";

function HeroBanner() {

    const slides = [
        {
            bg: "https://bncamera.com/wp-content/uploads/2026/03/background-bncamera-1400x571.webp",
            product: "https://cdn.vjshop.vn/may-anh/mirrorless/fujifilm/fujifilm-x-m5/body-black/fujifilm-x-m5-black-body-12.jpg",
            title: "CANON R6 MARK III",
            desc: "Sony A7V là chiếc máy ảnh full-frame hybrid toàn diện nhất hiện nay, sở hữu cảm biến “phần chồng” (partially stacked) 33MP cho tốc độ đọc dữ liệu nhanh gấp 4.5 lần đời trước, giúp triệt tiêu hiện tượng méo hình và hỗ trợ chụp liên tiếp lên tới 30 khung hình/giây mà không bị đen màn hình. Máy được trang bị chip AI chuyên dụng giúp lấy nét cực nhạy vào người, động vật và cả côn trùng, cùng khả năng quay video 4K/60p không bị crop (oversampled từ 7K) và chống rung thân máy lên tới 7.5 stop, biến nó thành công cụ đắc lực cho cả nhiếp ảnh gia chuyên nghiệp lẫn các nhà làm phim đòi hỏi sự linh hoạt tối đa."
        },
        {
            bg: "https://bncamera.com/wp-content/uploads/2026/03/background-bncamera-1400x571.webp",
            product: "https://product.hstatic.net/200000409445/product/20_a5fafddf48c6423eab730f4bdee6b252_master.jpg",
            title: "SONY A7 IV",
            desc: "Sony A7V là chiếc máy ảnh full-frame hybrid toàn diện nhất hiện nay, sở hữu cảm biến “phần chồng” (partially stacked) 33MP cho tốc độ đọc dữ liệu nhanh gấp 4.5 lần đời trước, giúp triệt tiêu hiện tượng méo hình và hỗ trợ chụp liên tiếp lên tới 30 khung hình/giây mà không bị đen màn hình. Máy được trang bị chip AI chuyên dụng giúp lấy nét cực nhạy vào người, động vật và cả côn trùng, cùng khả năng quay video 4K/60p không bị crop (oversampled từ 7K) và chống rung thân máy lên tới 7.5 stop, biến nó thành công cụ đắc lực cho cả nhiếp ảnh gia chuyên nghiệp lẫn các nhà làm phim đòi hỏi sự linh hoạt tối đa."
        },
        {
            bg: "https://bncamera.com/wp-content/uploads/2026/03/background-bncamera-1400x571.webp",
            product: "https://cdn.vjshop.vn/may-anh/mirrorless/fujifilm/fujifilm-x-m5/body-black/fujifilm-x-m5-black-body-12.jpg",
            title: "CANON R6 MARK III",
            desc: "Sony A7V là chiếc máy ảnh full-frame hybrid toàn diện nhất hiện nay, sở hữu cảm biến “phần chồng” (partially stacked) 33MP cho tốc độ đọc dữ liệu nhanh gấp 4.5 lần đời trước, giúp triệt tiêu hiện tượng méo hình và hỗ trợ chụp liên tiếp lên tới 30 khung hình/giây mà không bị đen màn hình. Máy được trang bị chip AI chuyên dụng giúp lấy nét cực nhạy vào người, động vật và cả côn trùng, cùng khả năng quay video 4K/60p không bị crop (oversampled từ 7K) và chống rung thân máy lên tới 7.5 stop, biến nó thành công cụ đắc lực cho cả nhiếp ảnh gia chuyên nghiệp lẫn các nhà làm phim đòi hỏi sự linh hoạt tối đa."
        },
        {
            bg: "https://bncamera.com/wp-content/uploads/2026/03/background-bncamera-1400x571.webp",
            product: "https://product.hstatic.net/200000409445/product/20_a5fafddf48c6423eab730f4bdee6b252_master.jpg",
            title: "SONY A7 IV",
            desc: "Sony A7V là chiếc máy ảnh full-frame hybrid toàn diện nhất hiện nay, sở hữu cảm biến “phần chồng” (partially stacked) 33MP cho tốc độ đọc dữ liệu nhanh gấp 4.5 lần đời trước, giúp triệt tiêu hiện tượng méo hình và hỗ trợ chụp liên tiếp lên tới 30 khung hình/giây mà không bị đen màn hình. Máy được trang bị chip AI chuyên dụng giúp lấy nét cực nhạy vào người, động vật và cả côn trùng, cùng khả năng quay video 4K/60p không bị crop (oversampled từ 7K) và chống rung thân máy lên tới 7.5 stop, biến nó thành công cụ đắc lực cho cả nhiếp ảnh gia chuyên nghiệp lẫn các nhà làm phim đòi hỏi sự linh hoạt tối đa."
        },
        {
            bg: "https://bncamera.com/wp-content/uploads/2026/03/background-bncamera-1400x571.webp",
            product: "https://cdn.vjshop.vn/may-anh/mirrorless/fujifilm/fujifilm-x-m5/body-black/fujifilm-x-m5-black-body-12.jpg",
            title: "CANON R6 MARK III",
            desc: "Sony A7V là chiếc máy ảnh full-frame hybrid toàn diện nhất hiện nay, sở hữu cảm biến “phần chồng” (partially stacked) 33MP cho tốc độ đọc dữ liệu nhanh gấp 4.5 lần đời trước, giúp triệt tiêu hiện tượng méo hình và hỗ trợ chụp liên tiếp lên tới 30 khung hình/giây mà không bị đen màn hình. Máy được trang bị chip AI chuyên dụng giúp lấy nét cực nhạy vào người, động vật và cả côn trùng, cùng khả năng quay video 4K/60p không bị crop (oversampled từ 7K) và chống rung thân máy lên tới 7.5 stop, biến nó thành công cụ đắc lực cho cả nhiếp ảnh gia chuyên nghiệp lẫn các nhà làm phim đòi hỏi sự linh hoạt tối đa."
        },
        {
            bg: "https://bncamera.com/wp-content/uploads/2026/03/background-bncamera-1400x571.webp",
            product: "https://product.hstatic.net/200000409445/product/20_a5fafddf48c6423eab730f4bdee6b252_master.jpg",
            title: "SONY A7 IV",
            desc: "Sony A7V là chiếc máy ảnh full-frame hybrid toàn diện nhất hiện nay, sở hữu cảm biến “phần chồng” (partially stacked) 33MP cho tốc độ đọc dữ liệu nhanh gấp 4.5 lần đời trước, giúp triệt tiêu hiện tượng méo hình và hỗ trợ chụp liên tiếp lên tới 30 khung hình/giây mà không bị đen màn hình. Máy được trang bị chip AI chuyên dụng giúp lấy nét cực nhạy vào người, động vật và cả côn trùng, cùng khả năng quay video 4K/60p không bị crop (oversampled từ 7K) và chống rung thân máy lên tới 7.5 stop, biến nó thành công cụ đắc lực cho cả nhiếp ảnh gia chuyên nghiệp lẫn các nhà làm phim đòi hỏi sự linh hoạt tối đa."
        }
    ];

    return (
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
    );
}

export default HeroBanner;