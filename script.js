document.addEventListener("DOMContentLoaded", function () {
  const contentDiv = document.getElementById("content");
  let menuItemsData; // Store menu items data

  // Function to load menu content from the "menu.txt" file
  function loadMenuContent() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "menu.txt", true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        const menuText = xhr.responseText.trim();
        menuItemsData = menuText.split("\n");
        const menuItemsDiv = document.querySelector(".menu-items");

        // Clear any previous content
        menuItemsDiv.innerHTML = "";

        menuItemsData.forEach(function (item) {
          const [name, description, price, cuisine] = item.split(": ");

          // Create the card structure
          const menuItemDiv = document.createElement("div");
          menuItemDiv.className = "menu-item";
          menuItemDiv.setAttribute("data-cuisine", cuisine.toLowerCase()); // Set data-cuisine attribute

          menuItemDiv.innerHTML = `
            <img src="images/${name}.jpg" alt="${name}" loading="lazy">
            <h2>${name}</h2>
            <p>${description}</p>
            <p>Price: ${price}</p>
            <p>Cuisine: ${cuisine}</p>
          `;

          menuItemsDiv.appendChild(menuItemDiv);
        });

        // Initially show all menu items
        filterMenuItems("all");
        initFilterButtons(); // Initialize filter buttons after menu items are loaded
      }
    };

    xhr.send();
  }

  // Function to filter menu items based on cuisine
  function filterMenuItems(cuisine) {
    const menuItems = document.querySelectorAll(".menu-item");

    menuItems.forEach(function (menuItem) {
      const menuItemCuisine = menuItem.getAttribute("data-cuisine").trim(); // Trim to remove leading/trailing spaces

      if (cuisine === "all" || menuItemCuisine === cuisine.trim()) {
        // Trim the cuisine as well
        menuItem.style.display = "block";
      } else {
        menuItem.style.display = "none";
      }
    });
  }

  // Function to load content from external HTML files
  function loadContent(pageName, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${pageName}.html`, true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        contentDiv.innerHTML = xhr.responseText;
        // Hide all content sections
        document
          .querySelectorAll(".content-section")
          .forEach(function (section) {
            section.style.display = "none";
          });
        // Show the loaded content section
        const contentSection = document.querySelector(`.${pageName}-section`);
        contentSection.style.display = "block";

        if (typeof callback === "function") {
          callback();
        }
      }
    };

    xhr.send();
  }

  // Initialize filter buttons
  function initFilterButtons() {
    const filterButtons = document.querySelectorAll(".filter-button");

    // Event listener for filter button clicks
    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const cuisine = button.getAttribute("data-cuisine");
        filterMenuItems(cuisine);

        // Remove "active" class from all buttons
        filterButtons.forEach(function (btn) {
          btn.classList.remove("active");
        });

        // Add "active" class to the clicked button
        button.classList.add("active");
      });
    });
  }

  // Event listener for menu item clicks
  const menuItems = document.querySelectorAll(".menu a");
  menuItems.forEach(function (menuItem) {
    menuItem.addEventListener("click", function (e) {
      e.preventDefault();
      const pageName = menuItem.getAttribute("data-page");

      if (pageName === "menu") {
        loadContent(pageName, function () {
          // This callback function will be executed once loadContent is completed
          loadMenuContent();
        });
        // Load menu content dynamically
      } else if (pageName === "home") {
        loadContent(pageName, function () {
          news();
        });
      } else {
        loadContent(pageName); // Load other content as before
      }
    });
  });

  // Load default content (e.g., home)
  loadContent("home", function () {
    news(); // Load the news() function after "home" content is loaded
  });

  function news() {
    const newsletterForm = document.getElementById("newsletter-form");
    const confirmationMessage = document.getElementById("confirmation");
    const head_news = document.getElementById("heading-news");
    const p_news = document.getElementById("p-news");

    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent the default form submission behavior
      console.log("check");
      // Get the email input value
      const emailInput = document.getElementById("email").value;

      // You can save the email to local storage here if needed
      localStorage.setItem("subscribedEmail", emailInput);

      // Hide the form
      newsletterForm.style.display = "none";

      head_news.style.display = "none";
      p_news.style.display = "none";

      // Show the confirmation message
      confirmationMessage.style.display = "block";

      return false; // Prevent the form from refreshing the page
    });

    return false;
  }
});
