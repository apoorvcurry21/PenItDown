import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Loader, RTE, Select } from "../index";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.$id || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    setLoading(true);
    try {
      console.log("Submitting post data:", data);
      if (post) {
        const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

        if (file) {
          appwriteService.deleteFile(post.featuredImage);
        }

        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: file ? file.$id : post.featuredImage,
          userId: userData.$id
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      } else {
        const postData = {
          title: data.title,
          slug: slugTransform(data.title),
          content: data.content,
          status: data.status || 'active',
          userId: userData.$id,
          featuredImage: ''
        };

        if (data.image?.[0]) {
          try {
            const file = await appwriteService.uploadFile(data.image[0]);
            if (file) {
              postData.featuredImage = file.$id;
            }
          } catch (fileError) {
            console.log("File upload failed, continuing with empty featuredImage:", fileError);
          }
        }

        const dbPost = await appwriteService.createPost(postData);
        console.log("Created post:", dbPost);

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        } else {
          console.error("Failed to create post");
        }
      }
    } catch (error) {
      console.error("Error submitting post:", error);
    } finally {
      setLoading(false);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");

    return "";
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
        
        switch(value.title.toLowerCase()) {
          case "tennis":
            setValue("content", `
              <p>Tennis, one of the most prestigious and elegant sports in the world, has given us countless memorable matches and legendary rivalries. From grass courts to clay, the sport has evolved while maintaining its rich traditions and producing extraordinary talent.</p>
              
              <h3>Greatest Tennis Rivalries & Iconic Matches</h3>
              <ul>
                <li>
                  <strong>Novak Djokovic vs Roger Federer (2019 Wimbledon Final):</strong> 
                  The longest Wimbledon singles final in history, lasting 4 hours and 57 minutes. A historic match featuring the first-ever 12-12 fifth set tiebreak at Wimbledon. Two tennis legends pushed each other to the absolute limit in front of a spellbound Centre Court crowd, creating one of the most dramatic finals in tennis history. 
                  <a href="https://youtu.be/TUikJi0Qhhw" target="_blank" rel="noopener noreferrer" style="color: blue;">Watch the Highlights</a>
                </li>
                <li>
                  <strong>Novak Djokovic vs Rafael Nadal (2012 Australian Open Final):</strong> 
                  The longest Grand Slam final in history, lasting 5 hours and 53 minutes. A display of superhuman endurance and skill. 
                  <a href="https://youtu.be/4Nk_whncZ20?si=0ODPIT0LWAq78k5U" target="_blank" rel="noopener noreferrer" style="color: blue;">Watch the Extended Highlights</a>
                </li>
                <li>
                  <strong>Novak Djokovic - The GOAT:</strong> 
                  A mesmerizing compilation showcasing why Djokovic is considered the Greatest Of All Time. From impossible returns to record-breaking achievements across all surfaces, witness the spectacular journey of tennis' most complete player. 
                  <a href="https://youtu.be/EpqYIqZm_QM" target="_blank" rel="noopener noreferrer" style="color: blue;">Watch GOAT Highlights</a>
                </li>
                <li>
                  <strong>Roger Federer vs Rafael Nadal (2008 Wimbledon Final):</strong> 
                  The greatest tennis match ever played. A clash of styles and generations - Federer's grass-court mastery against Nadal's relentless intensity. Five sets of breathtaking tennis spanning 4 hours and 48 minutes, interrupted by rain, and finishing in near darkness. This match represented the peak of their legendary rivalry, with Federer seeking his 6th consecutive Wimbledon title and Nadal looking for his first. The match featured everything: spectacular shot-making, momentum shifts, rain delays, and unbelievable tension until the very last point. 
                  <a href="https://youtu.be/C4M5SXN0jGo" target="_blank" rel="noopener noreferrer" style="color: blue;">Watch Epic Battle</a>
                </li>
              </ul>

              <h3>What Makes Tennis Special</h3>
              <ul>
                <li><strong>Individual Excellence:</strong> A one-on-one battle of skill, strategy, and mental strength</li>
                <li><strong>Different Surfaces:</strong> Clay, grass, and hard courts each requiring unique playing styles</li>
                <li><strong>Grand Slams:</strong> Four prestigious tournaments that define tennis greatness</li>
                <li><strong>Rich History:</strong> A sport that has maintained its elegance while evolving with time</li>
              </ul>

              <h3>The Big Three Era</h3>
              <p>The dominance of Roger Federer, Rafael Nadal, and Novak Djokovic has given tennis its golden era. Together, they've won 65+ Grand Slam titles, creating countless memorable moments and pushing each other to unprecedented levels of excellence.</p>

              <p>Whether you're a lifelong fan or new to the sport, tennis offers a unique blend of athleticism, strategy, and drama that few other sports can match. The individual nature of the sport creates personal stories of triumph and heartbreak that resonate with fans worldwide.</p>
            `);
            break;

          case "vs code":
            setValue("content", `
              <h2>Visual Studio Code: Your Ultimate Code Editor</h2>
              <p>Visual Studio Code (VS Code) is a powerful, lightweight code editor that has revolutionized the way developers write and debug code. Here's why it's become the go-to choice for millions of developers worldwide:</p>
              
              <h3>Key Features</h3>
              <ul>
                <li><strong>IntelliSense:</strong> Smart code completion with support for variables, methods, and imported modules.</li>
                <li><strong>Debugging:</strong> Built-in debugging support for Node.js, Python, and many other languages.</li>
                <li><strong>Git Integration:</strong> Source control features built right into the editor.</li>
                <li><strong>Extensions:</strong> A rich marketplace with thousands of extensions to enhance your development experience.</li>
              </ul>

              <h3>Essential Extensions Every Developer Should Try</h3>
              <ol>
                <li>
                  <strong>GitHub Copilot</strong>
                  <p>Your AI pair programmer that helps you write code faster with smart suggestions.</p>
                </li>
                <li>
                  <strong>Live Server</strong>
                  <p>Launch a local development server with live reload feature for static pages.</p>
                </li>
                <li>
                  <strong>ESLint</strong>
                  <p>Integrates ESLint into VS Code for JavaScript code quality.</p>
                </li>
                <li>
                  <strong>Prettier</strong>
                  <p>Code formatter that ensures consistent code style across your project.</p>
                </li>
              </ol>

              <h3>Productivity Tips</h3>
              <ul>
                <li><strong>Command Palette (Ctrl+Shift+P):</strong> Quick access to all VS Code commands</li>
                <li><strong>Multi-cursor Editing (Alt+Click):</strong> Edit multiple lines simultaneously</li>
                <li><strong>Zen Mode (Ctrl+K Z):</strong> Distraction-free coding environment</li>
                <li><strong>Split Editors (Ctrl+\\):</strong> Work with multiple files side by side</li>
              </ul>

              <h3>Why Choose VS Code?</h3>
              <ul>
                <li>Free and open-source</li>
                <li>Cross-platform compatibility</li>
                <li>Regular updates and improvements</li>
                <li>Large and active community</li>
                <li>Extensive language support</li>
              </ul>

              <p>Whether you're a beginner or an experienced developer, VS Code provides the tools and flexibility you need to be productive. Try it out and discover why it's become the preferred code editor for modern development!</p>
            `);
            break;

          case "react js":
            setValue("content", `
              <h2>React.js: Building Modern User Interfaces</h2>
              <p>React.js has transformed the way we build web applications. Created by Facebook (now Meta), it's become the most popular JavaScript library for building user interfaces. Let's explore what makes React so special:</p>
              
              <h3>Core Concepts</h3>
              <ul>
                <li>
                  <strong>Component-Based Architecture</strong>
                  <p>React applications are built using components - reusable pieces of UI that manage their own state and behavior.</p>
                </li>
                <li>
                  <strong>Virtual DOM</strong>
                  <p>React's Virtual DOM optimizes rendering performance by minimizing actual DOM manipulations.</p>
                </li>
                <li>
                  <strong>JSX</strong>
                  <p>Write HTML-like code directly in your JavaScript, making component creation intuitive and maintainable.</p>
                </li>
                <li>
                  <strong>Unidirectional Data Flow</strong>
                  <p>Data flows in one direction, making applications more predictable and easier to debug.</p>
                </li>
              </ul>

              <h3>Essential React Hooks</h3>
              <ol>
                <li>
                  <strong>useState</strong>
                  <pre><code>
const [count, setCount] = useState(0);
                  </code></pre>
                  <p>Manage component state with this fundamental hook.</p>
                </li>
                <li>
                  <strong>useEffect</strong>
                  <pre><code>
useEffect(() => {
  // Side effects here
  return () => {
    // Cleanup
  };
}, [dependencies]);
                  </code></pre>
                  <p>Handle side effects like API calls and subscriptions.</p>
                </li>
                <li>
                  <strong>useContext</strong>
                  <p>Access data from React's Context API without prop drilling.</p>
                </li>
                <li>
                  <strong>useRef</strong>
                  <p>Reference DOM elements directly and persist values across renders.</p>
                </li>
              </ol>

              <h3>Popular React Ecosystem Tools</h3>
              <ul>
                <li>
                  <strong>React Router</strong>
                  <p>Handle client-side routing in your single-page applications.</p>
                </li>
                <li>
                  <strong>Redux / Redux Toolkit</strong>
                  <p>Manage global state with predictable state containers.</p>
                </li>
                <li>
                  <strong>Next.js</strong>
                  <p>Full-featured framework for server-side rendering and static site generation.</p>
                </li>
                <li>
                  <strong>React Query</strong>
                  <p>Powerful data synchronization for React applications.</p>
                </li>
              </ul>

              <h3>Best Practices</h3>
              <ul>
                <li><strong>Component Composition:</strong> Break down complex UIs into smaller, reusable components</li>
                <li><strong>Custom Hooks:</strong> Extract reusable stateful logic into custom hooks</li>
                <li><strong>Memoization:</strong> Use React.memo and useMemo for performance optimization</li>
                <li><strong>Error Boundaries:</strong> Implement error boundaries to handle component errors gracefully</li>
              </ul>

              <h3>Code Example: Simple Counter Component</h3>
              <pre><code>
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    &lt;div&gt;
      &lt;p&gt;Count: {count}&lt;/p&gt;
      &lt;button onClick={() => setCount(count + 1)}&gt;
        Increment
      &lt;/button&gt;
    &lt;/div&gt;
  );
}
              </code></pre>

              <p>React's simplicity, combined with its powerful features and extensive ecosystem, makes it an excellent choice for building modern web applications. Whether you're creating a simple website or a complex enterprise application, React provides the tools and patterns you need to succeed.</p>
            `);
            break;

          case "table tennis":
            setValue("content", `
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
            `);
            break;
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return loading ? (
    <Loader className1="h-20 w-20 bg-zinc-800" className2="bg-zinc-800" />
  ) : (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2 rounded-xl border border-black/10 bg-zinc-900 md:my-4 text-gray-300">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4 focus:bg-zinc-500/65"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          readOnly
          className="mb-4 cursor-not-allowed hover:bg-zinc-800"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2 rounded-xl border border-black/10 bg-zinc-900 md:my-4 text-gray-300">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4 focus:bg-zinc-500/65"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image")}
        />
        {post && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4 focus:bg-zinc-500/65"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500/80" : undefined}
          className="w-full mt-14 rounded-md bg-green-500/80"
          disabled={loading}
        >
          {loading ? <Loader /> : post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
