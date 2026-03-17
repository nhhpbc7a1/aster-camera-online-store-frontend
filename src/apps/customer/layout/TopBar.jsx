function TopBar() {
    const scrollItems = [
        { icon: "fa-clock", text: "Thu cũ đổi mới, định giá cao" },
        { icon: "fa-shield", text: "Hỗ trợ kỹ thuật, giải đáp tận tình" },
        { icon: "fa-upload", text: "Đổi trả linh hoạt trong 15 ngày đầu" },
        { icon: "fa-file-invoice", text: "Xuất hóa đơn VAT đầy đủ" },
    ];

    return (
        <div className="bg-black text-white text-sm py-1">
            <style>{`
                @keyframes scroll-left {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }
                .scroll-container {
                    overflow: hidden;
                    width: 500px;
                }
                .scroll-content {
                    display: flex;
                    gap: 2rem;
                    animation: scroll-left 7s linear infinite;
                    white-space: nowrap;
                }
                .scroll-content span {
                    flex-shrink: 0;
                }
                @media (max-width: 850px) {
                    .topbar-container {
                        justify-content: center;
                    }
                }
            `}</style>

            <div className="container mx-auto flex justify-between items-center px-4 py-1 topbar-container">
                <span className="font-semibold w-[300px] max-[850px]:w-auto max-[850px]:mx-auto">CHẤT LƯỢNG - TẬN TÂM - UY TÍN</span>
                <div className="scroll-container max-[850px]:hidden">
                    <div className="scroll-content">
                        {[...scrollItems, ...scrollItems].map((item, idx) => (
                            <span key={idx}>
                                <i className={`fa-solid ${item.icon} mr-2`}></i>
                                {item.text}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2 ml-4 flex-shrink-0 w-[200px] max-[850px]:hidden text-end">
                    <a href="https://www.facebook.com/people/ASTER-Production/61585158583823/?locale=vi_VN" target="_blank" rel="noopener noreferrer">
                        <span className="w-8 h-6 flex items-center justify-center rounded-full bg-white text-blue-600 hover:scale-110 transition cursor-pointer">
                            <i className="fa-brands fa-facebook-f"></i>
                        </span>
                    </a>

                    {/* <span className="w-8 h-6 flex items-center justify-center rounded-full bg-white text-pink-500 hover:scale-110 transition cursor-pointer">
                        <i className="fa-brands fa-instagram"></i>
                    </span> */}

                    {/* <span className="w-8 h-6 flex items-center justify-center rounded-full bg-black text-white hover:scale-110 transition cursor-pointer">
                        <i className="fa-brands fa-tiktok"></i>
                    </span> */}

                    <a href="mailto:asterproduction333@gmail.com" target="_blank" rel="noopener noreferrer">
                        <span className="w-8 h-6 flex items-center justify-center rounded-full bg-gray-600 text-white hover:scale-110 transition cursor-pointer">
                            <i className="fa-solid fa-envelope"></i>
                        </span>
                    </a>

                    <a href="tel:0794352262" target="_blank" rel="noopener noreferrer">
                        <span className="w-8 h-6 flex items-center justify-center rounded-full bg-green-600 text-white hover:scale-110 transition cursor-pointer">
                            <i className="fa-solid fa-phone"></i>
                        </span>
                    </a>

                </div>
            </div>
        </div>
    );
}

export default TopBar;
