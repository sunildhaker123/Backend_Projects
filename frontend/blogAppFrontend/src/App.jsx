import { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { createBlog, getBlog, getBlogs, getBlogsByUser } from "./api/blogApi";
import { loginUser, registerUser } from "./api/authApi";
import "./styles.css";

const formatDate = (date) => date ? new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Recently";
const excerpt = (text = "") => text.length > 190 ? `${text.slice(0, 190).trim()}…` : text;

function Header() {
  const [userId] = useState(() => localStorage.getItem("stillword_user_id"));
  return <header className="topbar"><Link className="brand" to="/"><span className="brand-mark">s.</span> stillword</Link><nav><Link to="/">Stories</Link>{userId ? <Link to="/mine">My stories</Link> : <Link to="/login">Sign in</Link>}<Link className="write-link" to={userId ? "/write" : "/register"}><span>＋</span> {userId ? "Write" : "Get started"}</Link></nav></header>;
}

function Shell({ children }) { return <><Header/><main>{children}</main><footer>Make room for a good story. <span>stillword</span></footer></>; }

function Feed() {
  const [blogs, setBlogs] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { getBlogs().then((data) => setBlogs(data.blogs || [])).catch(() => setError("We couldn’t load the stories. Check that the API is running and try again.")).finally(() => setLoading(false)); }, []);
  return <Shell><section className="hero"><div className="hero-copy"><span className="eyebrow">A little space to think</span><h1>Stories worth<br/><em>staying for.</em></h1><p>A quiet corner of the internet for ideas, notes, and the things you want to say.</p><Link to="/write" className="button button-dark">Write your first story <span>↗</span></Link></div><div className="hero-art" aria-hidden="true"><div className="sun"/><div className="art-leaf leaf-one"/><div className="art-leaf leaf-two"/><div className="art-leaf leaf-three"/><div className="art-stem"/><div className="art-ground"/><span className="art-note">take your time</span></div></section>
    <section className="stories"><div className="section-head"><div><span className="eyebrow">The latest</span><h2>Fresh from the page</h2></div><span className="story-count">{blogs.length ? `01 — ${String(blogs.length).padStart(2,"0")}` : "A new beginning"}</span></div>
      {loading ? <div className="status">Gathering stories<span className="loading-dot">…</span></div> : error ? <div className="empty-state"><p>{error}</p><button className="text-button" onClick={() => location.reload()}>Try again ↗</button></div> : blogs.length ? <div className="story-grid">{blogs.map((blog) => <Link className="story-card" key={blog._id} to={`/stories/${blog._id}`}><div className="card-meta"><span className="avatar">{(blog.author || "S").toString().slice(-1).toUpperCase()}</span><span>Writer</span><i>·</i><time>{formatDate(blog.createdAt)}</time></div><h3>{blog.title}</h3><p>{excerpt(blog.content)}</p><span className="read-more">Read story <b>↗</b></span></Link>)}</div> : <div className="empty-state"><span className="empty-spark">✳</span><h3>The page is still blank.</h3><p>Every good collection starts with one story. Add yours to the mix.</p><Link className="text-button" to="/write">Start writing ↗</Link></div>}</section>
  </Shell>;
}

function Auth({ mode }) {
  const isRegister = mode === "register"; const navigate = useNavigate();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e) { e.preventDefault(); setError(""); setBusy(true); try { const result = isRegister ? await registerUser({ email, password }) : await loginUser({ email, password }); if (result.userId) localStorage.setItem("stillword_user_id", result.userId); navigate(isRegister ? "/write" : "/"); } catch (err) { setError(err.response?.data?.message || "Something went wrong. Please try again."); } finally { setBusy(false); } }
  return <Shell><section className="auth-layout"><div className="auth-aside"><span className="eyebrow">Your words belong here</span><h1>{isRegister ? <>Begin with<br/><em>a blank page.</em></> : <>Good to see<br/><em>you again.</em></>}</h1><p>{isRegister ? "Create a space for your thoughts. Come back to it whenever you like." : "Pick up right where your next idea is waiting."}</p><div className="aside-doodle">✳ <span>write at your own pace</span></div></div><div className="auth-card"><span className="eyebrow">{isRegister ? "Join stillword" : "Welcome back"}</span><h2>{isRegister ? "Create your account" : "Sign in to your space"}</h2><p className="form-intro">{isRegister ? "A thoughtful place for your stories starts here." : "Your writing desk is just a moment away."}</p><form onSubmit={submit}><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} required/><label htmlFor="password">Password</label><input id="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} placeholder="At least 8 characters" minLength={8} value={password} onChange={(e)=>setPassword(e.target.value)} required/>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark form-submit" disabled={busy}>{busy ? "One moment…" : isRegister ? "Create account" : "Sign in"}<span>↗</span></button></form><div className="switch-auth">{isRegister ? "Already have an account?" : "New to stillword?"} <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create an account"}</Link></div></div></section></Shell>;
}

function Write() {
  const navigate = useNavigate(); const [title,setTitle] = useState(""); const [content,setContent] = useState(""); const [error,setError] = useState(""); const [busy,setBusy] = useState(false);
  async function submit(e) { e.preventDefault(); setError(""); setBusy(true); try { const result = await createBlog({title,content}); navigate(`/stories/${result.blogId}`); } catch(err) { setError(err.response?.data?.message || "Please sign in before publishing your story."); } finally { setBusy(false); } }
  return <Shell><section className="editor"><Link className="back-link" to="/">← Back to stories</Link><span className="eyebrow">A new story</span><h1>Start with a thought.</h1><p className="editor-intro">There’s no rush. Write what’s on your mind.</p><form onSubmit={submit}><input className="title-input" placeholder="Give your story a title…" value={title} onChange={e=>setTitle(e.target.value)} required maxLength={140}/><textarea placeholder="Your story begins here…" value={content} onChange={e=>setContent(e.target.value)} required rows={12}/>{error && <p className="form-error" role="alert">{error} <Link to="/login">Sign in</Link></p>}<div className="editor-actions"><span>{content.length} characters</span><button className="button button-dark" disabled={busy}>{busy ? "Publishing…" : "Publish story"}<span>↗</span></button></div></form></section></Shell>;
}

function Story() {
  const { id } = useParams(); const [blog,setBlog] = useState(null); const [error,setError] = useState("");
  useEffect(()=>{getBlog(id).then(data=>setBlog(Array.isArray(data)?data[0]:data)).catch(()=>setError("This story could not be found."));},[id]);
  return <Shell>{error ? <div className="story-error"><h1>{error}</h1><Link to="/">Back to stories ↗</Link></div> : !blog ? <div className="status">Opening the story<span className="loading-dot">…</span></div> : <article className="article"><Link className="back-link" to="/">← All stories</Link><div className="article-meta"><span className="avatar">{(blog.author||"S").toString().slice(-1).toUpperCase()}</span><span>Writer</span><i>·</i><time>{formatDate(blog.createdAt)}</time></div><h1>{blog.title}</h1><div className="article-rule"/><div className="article-content">{blog.content?.split("\n").map((paragraph,i)=><p key={i}>{paragraph}</p>)}</div><div className="article-end">✳</div></article>}</Shell>;
}

function MyStories() {
  const [blogs,setBlogs] = useState([]); const [loading,setLoading] = useState(true); const [error,setError] = useState("");
  useEffect(()=>{const userId=localStorage.getItem("stillword_user_id"); if(!userId){setError("Create an account to see stories linked to your profile.");setLoading(false);return;} getBlogsByUser(userId).then(data=>setBlogs(data.blogs||[])).catch(()=>setError("We couldn’t load your stories.")).finally(()=>setLoading(false));},[]);
  return <Shell><section className="stories mine-stories"><div className="section-head"><div><span className="eyebrow">Your writing desk</span><h2>Stories you’ve shared</h2></div><Link className="text-button" to="/write">＋ Write a story</Link></div>{loading?<div className="status">Finding your stories<span className="loading-dot">…</span></div>:error?<div className="empty-state"><p>{error}</p><Link className="text-button" to="/register">Create an account ↗</Link></div>:blogs.length?<div className="story-grid">{blogs.map(blog=><Link className="story-card" key={blog._id} to={`/stories/${blog._id}`}><div className="card-meta"><span className="avatar">S</span><span>You</span><i>·</i><time>{formatDate(blog.createdAt)}</time></div><h3>{blog.title}</h3><p>{excerpt(blog.content)}</p><span className="read-more">Read story <b>↗</b></span></Link>)}</div>:<div className="empty-state"><span className="empty-spark">✳</span><h3>Your first story is waiting.</h3><p>Put a thought into words and it will find a home here.</p><Link className="text-button" to="/write">Start writing ↗</Link></div>}</section></Shell>;
}

function App() { return <Routes><Route path="/" element={<Feed/>}/><Route path="/login" element={<Auth mode="login"/>}/><Route path="/register" element={<Auth mode="register"/>}/><Route path="/write" element={<Write/>}/><Route path="/mine" element={<MyStories/>}/><Route path="/stories/:id" element={<Story/>}/></Routes>; }
export default App;
