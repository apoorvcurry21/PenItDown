import { useState, useEffect } from "react";
import { Container, Loader, PostCard } from "../components";
import appwriteService from "../appwrite/config";
import authService from "../appwrite/auth";
import { Link } from "react-router-dom";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchPosts = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          // If it's the guest account, show all public posts
          if (userData.email === "novakgoat@gmail.com") {
            const posts = await appwriteService.getPublicPosts();
            if (posts) {
              setPosts(posts.documents);
            }
          } else {
            // For new users, show their own posts
            const posts = await appwriteService.getUserPosts(userData.$id);
            if (posts) {
              setPosts(posts.documents);
            }
          }
        }
      } catch (error) {
        console.error("AllPosts :: fetchPosts error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Sort posts: TABLE TENNIS first, then TENNIS, then the rest
  const sortedPosts = [...posts].sort((a, b) => {
    if (a.title.toLowerCase() === 'table tennis') return -1;
    if (b.title.toLowerCase() === 'table tennis') return 1;
    if (a.title.toLowerCase() === 'tennis') return 1;
    if (b.title.toLowerCase() === 'tennis') return -1;
    return 0;
  });

  return loading ? (
    <Loader className1="h-20 w-20 bg-zinc-800" className2="bg-zinc-800"/>
  ) : !(sortedPosts.length === 0) ? (
    <div className="w-full py-8">
      <Container>
        <h1 className="text-zinc-200 text-xl mb-4">All Posts:</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedPosts.map((post) => (
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
