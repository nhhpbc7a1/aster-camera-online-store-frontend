import { useState } from "react";

function Footer() {
    const [email, setEmail] = useState("");

    const handleSubscribe = (e) => {
        e.preventDefault();
        // Handle newsletter subscription
        setEmail("");
    };

    const categories = [
        {
            id: 1,
            name: "MÁY ẢNH",
            image: "https://bncamera.com/wp-content/uploads/2022/12/canon-eos-r5-1-280x280.jpg",
            slug: "may-anh"
        },
        {
            id: 2,
            name: "ỐNG KÍNH",
            image: "https://bncamera.com/wp-content/uploads/2024/06/sigma-18-50mm-f28-fujifilm-x-1-280x280.jpg",
            slug: "ong-kinh"
        },
        {
            id: 3,
            name: "CAMERA HÀNH ĐỘNG",
            image: "https://bncamera.com/wp-content/uploads/2025/11/dji-action-6-anhsp-1-scaled-280x280.jpg",
            slug: "camera-hanh-dong"
        },
        {
            id: 4,
            name: "GIMBAL CHỐNG RUNG",
            image: "https://bncamera.com/wp-content/uploads/2024/04/gimbal-dji-rs-4-pro-chinh-hang-2-280x280.jpg",
            slug: "gimbal-chong-rung"
        },
        {
            id: 5,
            name: "MICRO",
            image: "https://bncamera.com/wp-content/uploads/2025/08/dji-mic-3-djistore-e1756366467443-280x280.jpg",
            slug: "micro"
        },
        {
            id: 6,
            name: "PHỤ KIỆN MÁY ẢNH",
            image: "https://bncamera.com/wp-content/uploads/2025/12/anh-anh-muc-phu-kien-may-anh-280x280.png",
            slug: "phu-kien-may-anh"
        }
    ];

    const services = [
        {
            icon: "fa-box",
            text: "Miễn phí vận chuyển"
        },
        {
            icon: "fa-arrow-left",
            text: "Đổi trả trong vòng 15 ngày"
        },
        {
            icon: "fa-headset",
            text: "Hỗ trợ liên tục 24/7"
        },
        {
            icon: "fa-shield-halved",
            text: "Bảo mật thanh toán"
        }
    ];

    return (
        <footer className="bg-white mt-10 border-t">
            <div className="container mx-auto px-4 py-10">
                {/* Newsletter Subscription Banner */}
                <div className="bg-red-500 rounded-xl p-8 mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="text-white">
                            <h2 className="text-2xl font-bold mb-3 text-white">
                                Đăng ký nhận các thông báo mới nhất từ ASTER Production
                            </h2>
                            <p className="text-white/90">
                                Nhận các thông báo mới nhất từ chúng tôi như chương trình khuyến mãi, ưu đãi đặc biệt, sản phẩm mới, kinh nghiệm chụp ảnh – quay phim, cùng nhiều thông tin hữu ích dành cho người yêu nhiếp ảnh và sáng tạo nội dung.
                            </p>
                        </div>
                        <div>
                            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Nhập Email của bạn..."
                                    className="bg-white w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    ĐĂNG KÝ NGAY
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Product Categories Grid */}
                <div className="mb-10">
                    {/* Desktop: Grid layout */}
                    <div className="hidden md:grid grid-cols-6 gap-4 mb-4">
                        {categories.slice(0, 6).map((category) => (
                            <a
                                key={category.id}
                                href={`/category/${category.slug}`}
                                className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer bg-gray-200"
                            >
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition">
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h3 className="text-white font-semibold text-center">
                                            {category.name}
                                        </h3>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                    
                    {/* Mobile: Horizontal scroll */}
                    <div className="md:hidden overflow-x-auto -mx-4 px-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <style>{`
                            .scrollbar-hide::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                        <div className="flex gap-4" style={{ width: 'max-content' }}>
                            {categories.slice(0, 6).map((category) => (
                                <a
                                    key={category.id}
                                    href={`/category/${category.slug}`}
                                    className="relative flex-shrink-0 w-[200px] aspect-square rounded-lg overflow-hidden group cursor-pointer bg-gray-200"
                                >
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition">
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h3 className="text-white font-semibold text-center text-sm">
                                                {category.name}
                                            </h3>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Service Highlights */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                    {services.map((service, index) => (
                        <div key={index} className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                <i className={`fa-solid ${service.icon} text-2xl text-gray-700`}></i>
                            </div>
                            <p className="text-sm font-medium text-gray-700">
                                {service.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Links */}
            <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 border-t">
                {/* About */}
                <div>
                    <h3 className="font-semibold mb-3">Giới thiệu ASTER Production</h3>
                    <p className="text-sm text-gray-600">
                        ASTER Production bán buôn và bán lẻ các sản phẩm ngành ảnh:
                        Máy ảnh, Ống kính, Gimbal, Action Camera, Microphone, Phụ kiện...
                    </p>
                </div>

                {/* Services */}
                <div>
                    <h3 className="font-semibold mb-3">Thông tin và Dịch vụ</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>Giới thiệu</li>
                        <li>Liên hệ</li>
                        <li>Dịch vụ sửa chữa</li>
                        <li>Dịch vụ cho thuê</li>
                    </ul>
                </div>

                {/* Policies */}
                <div>
                    <h3 className="font-semibold mb-3">Hướng dẫn và Chính sách</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>Hướng dẫn mua hàng</li>
                        <li>Hướng dẫn thanh toán</li>
                        <li>Chính sách vận chuyển</li>
                        <li>Chính sách bảo hành</li>
                        <li>Chính sách đổi trả</li>
                    </ul>
                </div>
            </div>

            <div className="text-center text-sm text-gray-500 border-t py-4">
                © 2026 ASTER Production
            </div>
        </footer>
    );
}

export default Footer;