"use strict";

// element toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () {
  elementToggleFunc(sidebar);
});

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () {
  elementToggleFunc(this);
});

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
};

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const selectedPage = this.querySelector("span").innerText.toLowerCase();

    for (let j = 0; j < pages.length; j++) {
      if (selectedPage === pages[j].dataset.page) {
        pages[j].classList.add("active");
      } else {
        pages[j].classList.remove("active");
      }
    }

    for (let j = 0; j < navigationLinks.length; j++) {
      navigationLinks[j].classList.remove("active");
    }

    this.classList.add("active");

    window.scrollTo(0, 0);
  });
}

// toast function

const showToast = (message, type = "success") => {
  statusMessage.textContent = message;

  statusMessage.className = `form-status ${type} show`;

  setTimeout(() => {
    statusMessage.classList.remove("show");
  }, 3000);
};

// contact api

const contactForm = document.getElementById("contact-form");
const submitButton = document.getElementById("contact-submit-btn");
const statusMessage = document.getElementById("contact-status");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);

    const name = formData.get("fullname")?.trim();
    const email = formData.get("email")?.trim();
    const message = formData.get("message")?.trim();

    // Client-side validation
    if (!name || !email || !message) {
      showToast("Please fill in all fields.", "error");
    }

    try {
      submitButton.disabled = true;
      submitButton.querySelector("span").textContent = "Sending...";
      statusMessage.textContent = "";

      const response = await fetch(
        // "http://localhost:5002/api/v1/public/contact/create",
        "https://masaud-ahmod.onrender.com/api/v1/public/contact/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            message,
          }),
        },
      );

      // Handle non-JSON responses safely
      const contentType = response.headers.get("content-type");

      let data = {};

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(
          data.message || `Request failed with status ${response.status}`,
        );
      }

      // show toast message
      showToast(data.message || "Message sent successfully!", "success");

      contactForm.reset();
    } catch (error) {
      console.error("Contact form error:", error);

      showToast(
        error.message || "Something went wrong. Please try again.",
        "error",
      );
    } finally {
      submitButton.disabled = false;
      submitButton.querySelector("span").textContent = "Send Message";
    }
  });
}

// ========================================
// BLOG API
// ========================================

const serverUrl = "https://masaud-ahmod.onrender.com";
// const serverUrl = "http://localhost:5002";

const blogApiUrl = `${serverUrl}/api/v1/public/blogs`;

// ========================================
// FETCH ALL BLOGS
// ========================================

const fetchBlogs = async () => {
  try {
    const response = await fetch(blogApiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log("Fetched blogs:", data);

    return data.data || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);

    return [];
  }
};

// ========================================
// DATE FORMAT
// ========================================

const formatBlogDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateForTime = (date) => {
  if (!date) return "";

  return new Date(date).toISOString().split("T")[0];
};

// ========================================
// RENDER BLOGS
// ========================================

const renderBlogs = (blogs) => {
  const blogList = document.querySelector("#blog-posts-list");

  if (!blogList) return;

  blogList.innerHTML = "";

  // No blogs

  if (!blogs.length) {
    blogList.innerHTML = `
      <li class="blog-post-item">

        <p class="blog-text">
          No blog posts available at the moment.
        </p>

      </li>
    `;

    return;
  }

  // Render blogs

  blogs.forEach((blog, index) => {
    const blogItem = document.createElement("li");

    blogItem.className = "blog-post-item";

    const fallbackImage = `./assets/images/blog-${(index % 6) + 1}.jpg`;

    blogItem.innerHTML = `

      <a
        href="blog.html?slug=${encodeURIComponent(blog.slug)}"
      >

        <figure class="blog-banner-box">

          <img
            src="${blog?.featuredImage?.url || fallbackImage}"
            alt="${
              blog?.featuredImage?.originalName || blog.title || "Blog post"
            }"
            loading="lazy"
          >

        </figure>


        <div class="blog-content">

          <div class="blog-meta">

            <p class="blog-category">
              ${blog?.category?.name || "Development"}
            </p>

            <span class="dot"></span>

            <time
              datetime="${formatDateForTime(
                blog.publishedAt || blog.createdAt,
              )}"
            >
              ${formatBlogDate(blog.publishedAt || blog.createdAt)}
            </time>

          </div>


          <h3 class="h3 blog-item-title">
            ${blog.title || "Untitled Blog"}
          </h3>


          <p class="blog-text">
            ${blog.excerpt || ""}
          </p>

        </div>

      </a>
    `;

    blogList.appendChild(blogItem);
  });
};

// ========================================
// LOAD BLOGS
// ========================================

const loadBlogs = async () => {
  const blogs = await fetchBlogs();

  renderBlogs(blogs);
};

document.addEventListener("DOMContentLoaded", loadBlogs);

// ========================================
// HANDLE URL HASH NAVIGATION
// ========================================

const activatePageFromHash = () => {
  const hash = window.location.hash.replace("#", "");

  if (!hash) return;

  for (let i = 0; i < pages.length; i++) {
    if (pages[i].dataset.page === hash) {
      pages[i].classList.add("active");
    } else {
      pages[i].classList.remove("active");
    }
  }

  for (let i = 0; i < navigationLinks.length; i++) {
    const linkPage = navigationLinks[i]
      .querySelector("span")
      ?.innerText.toLowerCase();

    if (linkPage === hash) {
      navigationLinks[i].classList.add("active");
    } else {
      navigationLinks[i].classList.remove("active");
    }
  }
};

activatePageFromHash();
