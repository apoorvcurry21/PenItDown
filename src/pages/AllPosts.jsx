import { useState, useEffect } from "react";
import { Container, Loader, PostCard } from "../components";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    try {
      appwriteService.getPosts([]).then((posts) => {
        console.log("Fetched posts:", posts); // Debug log
        if (posts) {
          setPosts(posts.documents);
        } else {
          console.error("No posts returned from getPosts");
        }
      });
    } catch (error) {
      console.error("AllPosts :: fetchPosts error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return loading ? (
    <Loader className1="h-20 w-20 bg-zinc-800" className2="bg-zinc-800"/>
  ) : !(posts.length === 0) ? (
    <div className="w-full py-8">
      <Container>
        <h1 className="text-zinc-200 text-xl mb-4">All Posts:</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {posts.map((post) => (
            <div key={post.$id} className="w-full">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  ) : (
    <div className="w-full py-8 mt-4 text-center">
      <Container>
        <div className="flex flex-wrap">
          <div className="p-2 w-full">
            <h1 className="text-zinc-200 text-xl mb-4">
              No posts found!
            </h1>
            <Link
              to="/add-post"
              className="text-teal-500 text-xl mb-4 font-medium text-primary transition-all duration-200 hover:underline "
            >
              Ready to share? Click here to write your first post! 
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default AllPosts;
