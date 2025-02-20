import React, { useState, useEffect } from 'react';
import { Link, Route, Switch, useRouteMatch, useParams, useLocation } from 'react-router-dom';
import { marked } from 'marked';
import '../styles/Blog.css';

// 导入生成的博客数据
import generatedPosts from '../data/generatedPosts.json';

function Blog() {
    const [blogPosts, setBlogPosts] = useState([]);
    const { path, url } = useRouteMatch();
    const location = useLocation();

    useEffect(() => {
        // 处理博客文章
        const processedPosts = generatedPosts.map(post => ({
            ...post,
            content: marked(post.content || '')
        }));
        setBlogPosts(processedPosts);
    }, []);

    // 监听路由变化，滚动到顶部
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <Switch>
            <Route exact path={path}>
                <div className="blog-container">
                    <div className="blog-header">
                        <h1>My Blog</h1>
                        <p>Welcome to my technical blog where I share my thoughts and experiences</p>
                    </div>
                    
                    <div className="blog-posts">
                        {blogPosts.map((post, index) => (
                            <article key={index} className="blog-post">
                                <Link to={`${url}/${post.slug}`} className="post-link">
                                    <div className="post-content">
                                        <h2>{post.title}</h2>
                                        <div className="post-meta">
                                            <span className="post-date">
                                                {new Date(post.date).toLocaleDateString()}
                                            </span>
                                            <span className="post-category">{post.category}</span>
                                            <span className="reading-time">{post.readingTime} min read</span>
                                        </div>
                                        <p>{post.excerpt}</p>
                                        <span className="read-more">Read More →</span>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>
            </Route>
            <Route path={`${path}/:slug`}>
                <BlogPost posts={blogPosts} />
            </Route>
        </Switch>
    );
}

function BlogPost({ posts }) {
    const { slug } = useParams();
    const post = posts.find(p => p.slug === slug);

    if (!post) return <div>Post not found</div>;

    return (
        <div className="blog-post-container">
            <div className="blog-post-header">
                <h1>{post.title}</h1>
                <div className="post-meta">
                    <span className="post-date">
                        {new Date(post.date).toLocaleDateString()}
                    </span>
                    <span className="post-category">{post.category}</span>
                    <span className="reading-time">{post.readingTime} min read</span>
                </div>
            </div>
            <div 
                className="blog-post-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />
            <Link to="/blog" className="back-link">← Back to Blog</Link>
        </div>
    );
}

export default Blog;