import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    setLoading(true);
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) {
          // Change the title "YOGA" to "Table Tennis"
          if (post.title.toLowerCase() === "yoga") {
            post.title = "Table Tennis";
          }
          // Update content for the "Table Tennis" post
          if (post.title.toLowerCase() === "table tennis") {
            post.content = `
              <p>Table Tennis, also known as ping-pong, is a thrilling sport that combines speed, precision, and strategy. It has produced some of the most memorable matches in sports history.</p>
              <h3>Must-Watch Table Tennis Matches:</h3>
              <ul>
                <li>
                  <strong>Ma Long vs. Fan Zhendong (2017 World Championships Final):</strong> 
                  A legendary match showcasing the rivalry between two of the greatest players. 
                  <a href="https://youtu.be/-WXAAAdGJ7o?si=nXCmDFJjgYEyvtkr" target="_blank" rel="noopener noreferrer" style="color: blue;">Watch on YouTube</a>
                </li>
                <li>
                  <strong>Zhang Jike vs. Ma Long (ITTF Austrian Open 2011):</strong> 
                  A high-intensity match where Zhang Jike displayed his incredible skills to defeat Ma Long in a nail-biting final. 
                  <a href="https://youtu.be/ByUX0mOVjwg?si=oFfY1NLDd81aLeL5" target="_blank" rel="noopener noreferrer" style="color: blue;">Watch on YouTube</a>
                </li>
                <li>
                  <strong>Lin Gaoyuan vs. Timo Boll (World Cup 2017):</strong> 
                  A match filled with twists and turns, where one player staged an incredible fightback to turn the tide. 
                  <a href="https://youtu.be/kpCNjrD4HNo?si=37jortidR5EMPZ7x" target="_blank" rel="noopener noreferrer" style="color: blue;">Watch on YouTube</a>
                </li>
                <li>
                  <strong>Xu Xin vs. Ma Long (Pro Tour Grand Finals 2014):</strong> 
                  A spectacular match showcasing Xu Xin's creativity and Ma Long's consistency, leaving fans in awe of their skills. 
                  <a href="https://youtu.be/Hfhuy5Logcw?si=OakOBhQS9-v_UMOH" target="_blank" rel="noopener noreferrer" style="color: blue;">Watch on YouTube</a>
                </li>
              </ul>
              <p>These matches highlight the intensity and skill that make Table Tennis a global phenomenon. Whether you're a fan or a newcomer, these games are a must-watch!</p>
            `;
          }
          setPost(post);
        } else navigate("/");
      });
    } else navigate("/");
    setLoading(false);
  }, [slug, navigate]);

  const deletePost = () => {
    appwriteService.deletePost(post.$id).then((status) => {
      if (status) {
        appwriteService.deleteFile(post.featuredImage);
        navigate("/");
      }
    });
  };

  return loading ? (
    <Loader className1="h-20 w-20 bg-zinc-800" className2="bg-zinc-800" />
  ) : post ? (
    <div className="py-8">
      <Container>
        <div className="w-full flex justify-center mb-4 relative  outline outline-gray-500 rounded-xl p-2">
          <div className="object-cover bg-black/35 aspect-ratio-16/9">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-xl h-full w-full   text-white rounded-t-lg aspect-video object-center overflow-hidden"
            />
          </div>
          {isAuthor && (
            <div className="absolute right-6 top-6">
              <Link to={`/edit-post/${post.$id}`}>
                <Button bgColor="bg-green-500 rounded-xl" className="mr-3">
                  Edit
                </Button>
              </Link>
              <Button bgColor="bg-red-500 rounded-xl" onClick={deletePost}>
                Delete
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-col text-white bg-black/35 p-4 outline outline-gray-500 rounded-xl">
          <div className="w-full mb-6">
            <h1 className="text-4xl font-bold text-white text-decoration: underline ">
              {post.title}
            </h1>
          </div>
          <div className="browser-css text-xl text-white items-start">
            {parse(post.content)}
          </div>
        </div>
      </Container>
    </div>
  ) : null;
}
