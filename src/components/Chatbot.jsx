import React from "react";
import { assets } from "../assets/assets";

const Chatbot = () => {
  return (
    <a
      href="https://9000-firebase-studio-1759501192823.cluster-bqwaigqtxbeautecnatk4o6ynk.cloudworkstations.dev"
      target="_blank"
      className="fixed bottom-10 right-10 w-15 cursor-pointer bg-slate-700 rounded-full h-15 animate-bounce "
    >
      <img src={assets.bot} alt="" />
    </a>
  );
};

export default Chatbot;
