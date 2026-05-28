"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getBlogBySlug } from "@/lib/api";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [data, setData] = useState({ blog: null, recentBlogs: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlogBySlug(slug);
        if (res.success) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchBlog();
  }, [slug]);

  // Inject meta title & description dynamically once blog data is loaded
  useEffect(() => {
    if (!data.blog) return;
    const { blog } = data;

    // Title
    const resolvedTitle = blog.metaTitle || blog.title;
    document.title = resolvedTitle;

    // Meta description
    const resolvedDesc = blog.metaDescription || blog.excerpt;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", resolvedDesc);

    // OG tags
    const setOg = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };
    setOg("og:title", resolvedTitle);
    setOg("og:description", resolvedDesc);
    if (blog.imageUrl) setOg("og:image", blog.imageUrl);
  }, [data.blog]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading blog...</div>;
  if (!data.blog) return <div className="min-h-screen flex items-center justify-center text-red-500">Blog not found.</div>;

  const { blog, recentBlogs } = data;

  return (
    <main className="w-full bg-white font-mona pb-24">
      
      {/* HERO IMAGE */}
      <div className="w-full h-[40vh] md:h-[60vh] lg:h-[70vh] bg-gray-100 mb-12">
        <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* MAIN CONTENT (Left side) */}
          <div className="lg:col-span-8">
            
            {/* Meta & Share */}
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
              <span className="text-gray-500 text-sm">
                {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            {/* Render Raw HTML safely with beautiful custom CSS styling */}
            <div 
              className="text-gray-800 text-base md:text-lg leading-relaxed 
                         [&_h1]:text-3xl [&_h1]:md:text-4xl [&_h1]:lg:text-5xl [&_h1]:font-playfair [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mb-8 [&_h1]:leading-snug
                         [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-playfair [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-12 [&_h2]:mb-6
                         [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-10 [&_h3]:mb-4
                         [&_p]:mb-6
                         [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-8 [&_li]:mb-3
                         [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-8
                         [&_a]:text-[#00a3c4] [&_a]:underline hover:[&_a]:text-[#0082a4]
                         [&_blockquote]:border-l-4 [&_blockquote]:border-[#00a3c4] [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-8
                         [&_strong]:font-bold [&_strong]:text-gray-900"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

          </div>

          {/* SIDEBAR: RECENT BLOGS (Right side) */}
          <div className="lg:col-span-4">
            <h3 className="font-playfair text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">
              Recent Post
            </h3>
            
            <div className="space-y-12">
              {recentBlogs.length > 0 ? recentBlogs.map(recent => (
                <div key={recent._id} className="flex flex-col group">
                  <Link href={`/blog/${recent.slug}`} className="w-full aspect-[4/3] bg-gray-100 mb-4 overflow-hidden">
                    <img src={recent.imageUrl} alt={recent.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </Link>
                  <Link href={`/blog/${recent.slug}`}>
                    <h4 className="font-bold text-gray-900 text-lg mb-2 leading-snug group-hover:text-[#00a3c4] transition-colors">
                      {recent.title}
                    </h4>
                  </Link>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {recent.excerpt}
                  </p>
                  <Link href={`/blog/${recent.slug}`} className="text-[#00a3c4] text-sm font-medium hover:underline border-b border-[#00a3c4]/30 pb-0.5 w-fit">
                    Read Full Blog →
                  </Link>
                </div>
              )) : (
                <p className="text-sm text-gray-500">No other recent blogs.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}