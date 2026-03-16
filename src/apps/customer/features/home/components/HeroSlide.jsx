import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/utils/currencyHelpers";

function HeroSlide({ bg, product, title, desc, productId, price }) {
    const navigate = useNavigate();

    const handleBuyNow = () => {
        if (productId) {
            navigate(`/product/${productId}`);
        }
    };

    return (
        <div className="relative h-full rounded-xl overflow-hidden bg-gray-100">
            {/* background */}
            <img
                src={bg}
                className="absolute inset-0 w-full h-full object-cover opacity-30"
            />

            {/* content */}
            <div className="relative flex items-center justify-evenly h-full py-25">
                <div className="flex-1 max-w-md">
                    <h2 className="text-2xl font-bold mb-3">{title}</h2>

                    {price && (
                        <p className="text-3xl font-bold text-red-600 mb-3">
                            {formatCurrency(price)}
                        </p>
                    )}

                    <p className="text-gray-600 text-sm mb-5 line-clamp-4">{desc}</p>

                    <button 
                        className="btn btn-primary mt-5"
                        onClick={handleBuyNow}
                    >
                        MUA NGAY
                    </button>
                </div>

                <img src={product} className="h-[550px] object-contain" />
            </div>
        </div>
    );
}

export default HeroSlide;
