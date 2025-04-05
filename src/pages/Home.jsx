import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import appwriteService from "../appwrite/config";
import authService from "../appwrite/auth";
import { Container, PostCard, Loader } from "../components";
import { Link } from "react-router-dom";

function Home() {
  const authStatus = useSelector((state) => state.auth.status);
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (authStatus) {
        try {
          const posts = await appwriteService.getPosts();
          if (posts) {
            setPosts(posts.documents);
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      } else {
        setPosts([]);
      }
      setLoading(false);
    };

    const fetchUserData = async () => {
      if (authStatus) {
        try {
          const userData = await authService.getCurrentUser();
          if (userData) {
            setUsername(userData.name);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUsername("");
      }
    };

    fetchData();
    fetchUserData();
  }, [authStatus]); // Added authStatus as dependency

  if (loading) {
    return <div className="w-full min-h-screen flex justify-center items-center">
      <Loader className1="h-20 w-20 bg-zinc-800" className2="bg-zinc-800" />
    </div>;
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              {authStatus ? (
                <>
                  <h1 className="font-bold text-zinc-400 text-center text-6xl mb-4 ">
                    Welcome to{" "}
                    <span className="text-teal-400">PENITDOWN!</span>
                  </h1>
                  <h3 className="text-zinc-400 text-center font-medium text-3xl mb-4">
                    {username}
                  </h3>
                </>
              ) : (
                <>
                  <h1 className="font-bold text-zinc-200 text-center text-6xl mb-32 ">
                    Welcome to <span className="text-teal-400">PENITDOWN!</span>
                  </h1>
                  <Link
                    to="/login"
                    className="text-3xl text-center text-sky-300 hover:text-sky-500 pb-10 mb-20"
                  >
                    Login to Access Posts
                  </Link>

                  <hr className="w-4/5 h-0.5 mx-36 bg-gray-100 border-0 rounded mt-7" />
                  <div className="flex flex-col text-gray-200 pt-8 items-center">
                    <h2 className="text-lg font-bold">Guest Login Credentials</h2>
                    <p>Email: novakgoat@gmail.com</p>
                    <p>Password: 12345678</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <Container>
        <h1 className="font-bold text-zinc-200 text-center text-6xl mb-4">
          Welcome to <span className="text-teal-400">PENITDOWN!</span>
        </h1>
        <h3 className="text-zinc-400 text-center font-medium text-3xl mb-10">
          {username}
        </h3>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div key={post.$id} className="p-2 w-1/4">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;
