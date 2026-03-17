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
            <div className="relative flex items-center justify-evenly h-full py-25 max-[850px]:justify-between max-[850px]:gap-2 max-[850px]:px-2">
                {/* Text Section - 50% width on mobile */}
                <div className="flex-1 max-w-md max-[850px]:w-1/2 max-[850px]:max-w-none max-[850px]:flex max-[850px]:flex-col max-[850px]:justify-center max-[850px]:px-2">
                    <h2 className="text-2xl font-bold mb-3 max-[850px]:text-sm max-[850px]:mb-1">{title}</h2>

                    {price && (
                        <p className="text-3xl font-bold text-red-600 mb-3 max-[850px]:text-lg max-[850px]:mb-1">
                            {formatCurrency(price)}
                        </p>
                    )}

                    <p className="text-gray-600 text-sm mb-5 line-clamp-4 max-[850px]:text-xs max-[850px]:line-clamp-3 max-[850px]:mb-2">{desc}</p>

                    <button
                        className="btn btn-primary mt-5 max-[850px]:mt-1 max-[850px]:text-xs max-[850px]:py-1 max-[850px]:px-2"
                        onClick={handleBuyNow}
                    >
                        MUA NGAY
                    </button>
                </div>

                {/* Image Section - 50% width on mobile */}
                <img
                    src={product}
                    className="h-[550px] object-contain max-[850px]:w-1/2 max-[850px]:h-full max-[850px]:object-contain"
                />
            </div>
        </div>
    );
}

export default HeroSlide;
