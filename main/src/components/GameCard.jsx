import { FaPlay } from "react-icons/fa";
import "./ShinyButton.css";

const GameCard = ({
   game,
   onClick,
   className = "",
   showPlayButton = true,
   variant = "glass",
}) => {
   const IconComponent = game.icon;

   // Different card variants
   const variants = {
      glass: {
         container:
            "group relative border border-white/30 rounded-2xl p-6 hover:border-white/40 transition-all duration-300 cursor-pointer overflow-hidden shadow-lg hover:shadow-xl hover:scale-[1.02]",
         style: {
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(6px)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
         },
         glasslayers: false,
      }
   };

   const currentVariant = variants.glass;

   return (
      <div
         className={`${currentVariant.container} h-64 flex flex-col ${className}`}
         onClick={() => onClick && onClick(game)}
         style={currentVariant.style}
      >
         {/* Glass layers (only for glass variant) */}
         {currentVariant.glasslayers && (
            <>
               {/* Subtle Glass Effect */}
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/2 to-transparent opacity-100 rounded-2xl"></div>

               {/* Very Subtle Shine Effect */}
               <div className="absolute -inset-10 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500 transform rotate-12"></div>
            </>
         )}

         {/* Card Content */}
         <div className="relative z-10 text-center h-full flex flex-col">
            {/* Icon */}
            <div
               className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto backdrop-blur-md border bg-white/60 border-white/80`}
            >
               <IconComponent
                  className={`text-2xl ${game.textColor} drop-shadow-md`}
               />
            </div>

            {/* Title */}
            <h3
               className={`text-lg font-bold mb-2 drop-shadow-md leading-tight ${
                  variant === "solid" ? "text-gray-800" : "text-white"
               }`}
            >
               {game.title}
            </h3>

            {/* Description */}
            <p
               className={`text-xs leading-relaxed mb-4 line-clamp-2 px-1 flex-grow ${
                  variant === "solid" ? "text-gray-600" : "text-white/80"
               }`}
            >
               {game.description}
            </p>

            {/* Play Button */}
            {showPlayButton && (
               <div className="mt-auto">
                  <button className="shiny-button">
                     <FaPlay className="text-sm relative z-10" />
                     <span className="relative z-10">Play Now</span>
                  </button>
               </div>
            )}
         </div>
      </div>
   );
};

export default GameCard;
