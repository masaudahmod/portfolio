"use strict";


// ========================================
// API CONFIG
// ========================================

// const serverUrl =
//   "http://localhost:5002";
const serverUrl =
  "https://masaud-ahmod.onrender.com";

const blogApiUrl =
  `${serverUrl}/api/v1/public/blogs`;


// ========================================
// GET SLUG FROM URL
// ========================================

const urlParams =
  new URLSearchParams(
    window.location.search
  );

const slug =
  urlParams.get("slug");


// ========================================
// DOM ELEMENTS
// ========================================

const blogCategory =
  document.getElementById(
    "blog-category"
  );

const blogDate =
  document.getElementById(
    "blog-date"
  );

const blogReadingTime =
  document.getElementById(
    "blog-reading-time"
  );

const blogTitle =
  document.getElementById(
    "blog-title"
  );

const blogFeaturedImage =
  document.getElementById(
    "blog-featured-image"
  );

const blogExcerpt =
  document.getElementById(
    "blog-excerpt"
  );

const blogContent =
  document.getElementById(
    "blog-content"
  );

const blogTags =
  document.getElementById(
    "blog-tags"
  );


// ========================================
// DATE FORMAT
// ========================================

const formatBlogDate = (date) => {

  if (!date) {
    return "";
  }

  return new Date(date)
    .toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
};


const formatDateForTime = (date) => {

  if (!date) {
    return "";
  }

  return new Date(date)
    .toISOString()
    .split("T")[0];
};


// ========================================
// FETCH SINGLE BLOG
// ========================================

const fetchBlog = async () => {

  try {

    if (!slug) {

      throw new Error(
        "Blog slug is missing."
      );

    }


    const response =
      await fetch(
        `${blogApiUrl}/${encodeURIComponent(slug)}`
      );


    if (!response.ok) {

      if (
        response.status === 404
      ) {

        throw new Error(
          "Blog post not found."
        );

      }


      throw new Error(
        `HTTP error! status: ${response.status}`
      );

    }


    const data =
      await response.json();


    console.log(
      "Fetched blog:",
      data
    );


    return data.data || null;


  } catch (error) {

    console.error(
      "Error fetching blog:",
      error
    );

    return null;

  }

};


// ========================================
// RENDER BLOG
// ========================================

const renderBlog = (blog) => {


  // ======================================
  // BLOG NOT FOUND
  // ======================================

  if (!blog) {

    document.title =
      "Blog Not Found - Masaud Ahmod";


    blogTitle.textContent =
      "Blog Not Found";


    blogExcerpt.textContent =
      "Sorry, this blog post could not be found.";


    blogContent.innerHTML =
      `
        <p>
          The blog you're looking for
          does not exist or is no longer available.
        </p>
      `;


    blogFeaturedImage.style.display =
      "none";


    blogTags.innerHTML =
      "";


    return;

  }



  // ======================================
  // PAGE TITLE
  // ======================================

  document.title =
    `${blog.title} - Masaud Ahmod`;



  // ======================================
  // CATEGORY
  // ======================================

  blogCategory.textContent =
    blog?.category?.name ||
    "Development";



  // ======================================
  // DATE
  // ======================================

  const blogDateValue =
    blog.publishedAt ||
    blog.createdAt;


  blogDate.textContent =
    formatBlogDate(
      blogDateValue
    );


  blogDate.dateTime =
    formatDateForTime(
      blogDateValue
    );



  // ======================================
  // READING TIME
  // ======================================

  const readingTime =
    blog?.content?.readingTime;


  if (readingTime) {

    blogReadingTime.textContent =
      `${readingTime} min read`;

  } else {

    blogReadingTime.style.display =
      "none";

    const readingDot =
      document.getElementById(
        "reading-dot"
      );

    if (readingDot) {
      readingDot.style.display =
        "none";
    }

  }



  // ======================================
  // TITLE
  // ======================================

  blogTitle.textContent =
    blog.title ||
    "Untitled Blog";



  // ======================================
  // FEATURED IMAGE
  // ======================================

  const imageUrl =
    blog?.featuredImage?.url;


  if (imageUrl) {

    blogFeaturedImage.src =
      imageUrl;


    blogFeaturedImage.alt =
      blog?.featuredImage?.originalName ||
      blog.title ||
      "Blog featured image";


    blogFeaturedImage.style.display =
      "block";

  } else {

    blogFeaturedImage.style.display =
      "none";

  }



  // ======================================
  // EXCERPT
  // ======================================

  blogExcerpt.textContent =
    blog.excerpt ||
    "";



  // ======================================
  // FULL BLOG CONTENT
  // ======================================

  const content =
    blog?.content?.content;


  if (content) {

    blogContent.innerHTML =
      content;

  } else {

    blogContent.innerHTML =
      `
        <p>
          No article content available.
        </p>
      `;

  }



  // ======================================
  // TAGS
  // ======================================

  const tags =
    blog?.tags || [];


  if (!tags.length) {

    blogTags.innerHTML =
      "";

    return;

  }


  blogTags.innerHTML = `

    <div class="blog-tags-title">
      Tags
    </div>

    <div class="blog-tags-list">

      ${tags
        .map((item) => {

          const tagName =
            item?.tag?.name;

          if (!tagName) {
            return "";
          }

          return `
            <span class="blog-tag">
              ${tagName}
            </span>
          `;

        })
        .join("")}

    </div>

  `;

};


// ========================================
// LOAD BLOG
// ========================================

const loadBlog = async () => {

  const blog =
    await fetchBlog();

  renderBlog(blog);

};


// ========================================
// INITIALIZE
// ========================================

document.addEventListener(
  "DOMContentLoaded",
  loadBlog
);