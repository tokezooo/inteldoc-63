
import React from "react";
const MadeByHumans = () => {
  return <section id="made-by-humans" className="w-full bg-white py-0">
      <div className="section-container opacity-0 animate-on-scroll pb-2">
        {/* Removed the pulse-chip button/element that was here */}
        
        <div className="w-full flex justify-center items-center mt-6 sm:mt-8">
          <img 
            src="/lovable-uploads/8e161ed1-5e38-4f09-b2a1-0b698680f178.png" 
            alt="Medical AI Mascot" 
            className="h-64 sm:h-80 md:h-96 w-auto object-contain" 
          />
        </div>
      </div>
    </section>;
};
export default MadeByHumans;
