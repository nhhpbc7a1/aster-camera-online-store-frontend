import { useState } from "react";

function FloatingContactButtons() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Contact information
  const phoneNumber = "0794352262";
  const zaloLink = `https://zalo.me/${phoneNumber}`;
  const messengerLink = "https://m.me/61585158583823"; // Facebook Messenger
  const mapLink = "https://www.google.com/maps/search/?api=1&query=21.0285,105.7842"; // Store coordinates

  const handlePhoneClick = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const buttons = [
    {
      id: "map",
      icon: "fa-solid fa-map-location-dot",
      label: "Bản đồ",
      bgColor: "bg-blue-400",
      hoverColor: "hover:bg-blue-500",
      onClick: () => window.open(mapLink, "_blank"),
    },
    {
      id: "messenger",
      icon: "fa-brands fa-facebook-messenger",
      label: "Messenger",
      bgColor: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
      onClick: () => window.open(messengerLink, "_blank"),
    },
    {
      id: "zalo",
      icon: "fa-solid fa-comment-dots",
      label: "Zalo",
      bgColor: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      onClick: () => window.open(zaloLink, "_blank"),
    },
    {
      id: "phone",
      icon: "fa-solid fa-phone",
      label: "Gọi điện",
      bgColor: "bg-red-500",
      hoverColor: "hover:bg-red-600",
      onClick: handlePhoneClick,
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded buttons */}
      <div
        className={`flex flex-col gap-3 mb-3 transition-all duration-300 ${
          isExpanded
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {buttons.map((button, index) => (
          <button
            key={button.id}
            onClick={button.onClick}
            className={`${button.bgColor} ${button.hoverColor} w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 group relative`}
            style={{
              transitionDelay: isExpanded ? `${index * 50}ms` : "0ms",
            }}
            aria-label={button.label}
          >
            <i className={`${button.icon} text-xl`}></i>
            <span className="absolute right-full mr-3 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {button.label}
            </span>
          </button>
        ))}
      </div>

      {/* Main toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isExpanded
            ? "bg-gray-600 hover:bg-gray-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        aria-label="Liên hệ"
      >
        <i
          className={`fa-solid text-xl transition-transform duration-300 ${
            isExpanded ? "fa-xmark" : "fa-headset"
          }`}
        ></i>
      </button>
    </div>
  );
}

export default FloatingContactButtons;
