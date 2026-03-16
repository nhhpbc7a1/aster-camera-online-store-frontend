function PromoBanner({ image }) {
    return (
        <div className="bg-gray-300 rounded-xl overflow-hidden mb-10">
            <img
                src={image}
                alt="Promo banner"
                className="w-full h-full object-cover rounded-xl"
            />
        </div>
    );
}

export default PromoBanner;