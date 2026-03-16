import { useState } from "react";

function Footer() {
    const [email, setEmail] = useState("");

    const handleSubscribe = (e) => {
        e.preventDefault();
        // Handle newsletter subscription
        console.log("Subscribing email:", email);
        setEmail("");
    };

    const categories = [
        {
            id: 1,
            name: "MÁY ẢNH",
            image: "https://product.hstatic.net/200000409445/product/20_a5fafddf48c6423eab730f4bdee6b252_master.jpg",
            slug: "may-anh"
        },
        {
            id: 2,
            name: "ỐNG KÍNH",
            image: "https://product.hstatic.net/200000409445/product/20_a5fafddf48c6423eab730f4bdee6b252_master.jpg",
            slug: "ong-kinh"
        },
        {
            id: 3,
            name: "CAMERA HÀNH ĐỘNG",
            image: "https://product.hstatic.net/200000409445/product/20_a5fafddf48c6423eab730f4bdee6b252_master.jpg",
            slug: "camera-hanh-dong"
        },
        {
            id: 4,
            name: "GIMBAL CHỐNG RUNG",
            image: "https://product.hstatic.net/200000409445/product/20_a5fafddf48c6423eab730f4bdee6b252_master.jpg",
            slug: "gimbal-chong-rung"
        },
        {
            id: 5,
            name: "MICRO",
            image: "https://product.hstatic.net/200000409445/product/20_a5fafddf48c6423eab730f4bdee6b252_master.jpg",
            slug: "micro"
        },
        {
            id: 6,
            name: "ĐỒ CŨ",
            image: "https://product.hstatic.net/200000409445/product/20_a5fafddf48c6423eab730f4bdee6b252_master.jpg",
            slug: "do-cu"
        },
        {
            id: 7,
            name: "PHỤ KIỆN MÁY ẢNH",
            image: "https://product.hstatic.net/200000409445/product/20_a5fafddf48c6423eab730f4bdee6b252_master.jpg",
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
                                Đăng ký nhận các thông báo mới nhất từ BNCamera
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
                    {/* First row: 5 categories */}
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4">
                        {categories.slice(0, 7).map((category) => (
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
                    <h3 className="font-semibold mb-3">Giới thiệu BNCamera</h3>
                    <p className="text-sm text-gray-600">
                        BNCamera bán buôn và bán lẻ các sản phẩm ngành ảnh:
                        Máy ảnh, Ống kính, Gimbal, Flycam, Action Camera...
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
                © 2026 BNCamera
            </div>
        </footer>
    );
}

export default Footer;