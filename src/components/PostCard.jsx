import React from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";

function PostCard({ $id, title, featuredImage }) {
  const isTableTennis = title.toLowerCase() === "table tennis";
  const isVSCode = title.toLowerCase() === "vs code";
  const isReactJS = title.toLowerCase() === "react js";
  const isTennis = title.toLowerCase() === "tennis";

  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full h-full min-h-[250px] sm:min-h-[300px] bg-black/35 text-cyan-500 text-xl font-semibold rounded-xl p-4 hover:outline outline-4 outline-teal-600 transition-all duration-300">
        <div className="relative w-full h-[150px] sm:h-[200px] mb-4">
          <img
            src={
              isTableTennis
                ? "/assets/images/table-tennis.jpg"
                : isVSCode
                ? "/assets/images/vscodeimg.png"
                : isReactJS
                ? "/assets/images/reactimg.png"
                : isTennis
                ? "/assets/images/tennis.jpg"
                : appwriteService.getFilePreview(featuredImage)
            }
            alt={title}
            className="absolute inset-0 w-full h-full rounded-xl object-cover"
          />
        </div>
        <h2 className="text-lg sm:text-xl font-bold line-clamp-2">{title.toUpperCase()}</h2>
      </div>
    </Link>
  );
}

export default PostCard;
