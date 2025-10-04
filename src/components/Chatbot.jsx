import React from "react";
import { assets } from "../assets/assets";

const Chatbot = () => {
  return (
    <a
      href="https://chatbot-ai-inventory.onrender.com/"
      target="_blank"
      className="fixed bottom-10 right-10 w-15 cursor-pointer bg-slate-700 rounded-full h-15 animate-bounce "
    >
      <img src={assets.bot} alt="" />
    </a>
  );
};

export default Chatbot;
