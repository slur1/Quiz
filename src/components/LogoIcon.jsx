import React from "react";
import Pixel from "../assets/pixel1.png"

export default function LogoIcon() {
  return (
    <div className="flex items-center justify-center gap-1 py-1">
      <div className="text-white rounded-full p-2">
        <img src={Pixel} alt="Pixel logo" className="w-20 h-20" />
      </div>
      <h1 className="text-2xl font-bold text-white tracking-wide">
        Quizo
      </h1>
    </div>
  );
}
