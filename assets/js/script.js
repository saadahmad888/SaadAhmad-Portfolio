(function ($) {
	"use strict";

	// Theme color control js
	$(document).ready(function () {
		const isDarkMode = localStorage.getItem('darkMode') === 'true';
		$('body').toggleClass('dark-theme', isDarkMode);

		$('#page-content').fadeIn(0);

		$('.theme-control-btn').on("click", function () {
			$('body').toggleClass('dark-theme');

			const isDark = $('body').hasClass('dark-theme');
			localStorage.setItem('darkMode', isDark);
		});
	});

	// Mobile menu control js
	$(".mobile-menu-control-bar").on("click", function () {
		$(".mobile-menu-overlay").addClass("show");
		$(".navbar-main").addClass("show");
	})
	$(".mobile-menu-overlay").on("click", function () {
		$(".mobile-menu-overlay").removeClass("show");
		$(".navbar-main").removeClass("show");
	})

	// Parallax scroll effect js
	document.querySelectorAll(".move-with-cursor").forEach(a => {
		document.addEventListener("mousemove", function (e) {
			var t = e.clientX,
				e = e.clientY;
			a.style.transition = "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)", a.style.transform = `translate(${.01 * t}px, ${.01 * e}px) rotate(${.01 * (t + e)}deg)`
		})
	}),

		// Email copy button js
		new ClipboardJS('.btn-copy');

	// Email copy button tooltip js
	$(document).ready(function () {
		$(".btn-copy").on("click", function () {
			$(this).addClass("active");

			setTimeout(() => {
				$(this).removeClass("active");
			}, 1000);
		});
	});

	// Magnific popup js
	$(".parent-container").magnificPopup({
		delegate: ".gallery-popup",
		type: "image",
		gallery: {
			enabled: true,
		},
	});

	// Client feedback slider js
	$(".client-feedback-slider").slick({
		slidesToShow: 2,
		slidesToScroll: 1,
		autoplay: false,
		dots: false,
		infinite: true,
		arrows: true,
		speed: 500,
		prevArrow: '<i class="fas left icon fa-arrow-left"></i>',
		nextArrow: '<i class="fas right icon fa-arrow-right"></i>',
		responsive: [{
			breakpoint: 768,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
			}
		},]
	});

	// Article publications slider js
	$(".article-publications-slider").slick({
		slidesToShow: 2,
		slidesToScroll: 1,
		autoplay: false,
		dots: false,
		infinite: true,
		arrows: true,
		speed: 500,
		prevArrow: '<i class="fas left icon fa-arrow-left"></i>',
		nextArrow: '<i class="fas right icon fa-arrow-right"></i>',
		responsive: [{
			breakpoint: 768,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
			}
		},]
	});

	class YearUpdater {
		constructor(elementClass) {
			this.elements = document.getElementsByClassName(elementClass);
			this.updateYear();
		}

		updateYear() {
			const currentYear = new Date().getFullYear();
			for (let element of this.elements) {
				element.textContent = currentYear;
			}
		}
	}

	new YearUpdater('current-year');


	// Dev.to Blogs
	const articlesPerPage = 6;
	let currentPage = 1;
	let allArticles = [];

	const container = document.querySelector(".article-publications-main .row");
	const paginationContainer = document.querySelector(".pagination ul");
	const prevBtn = document.querySelector(".pagination .prev button");
	const nextBtn = document.querySelector(".pagination .next button");

	function fetchArticles() {
		fetch("https://dev.to/api/articles?username=saadahmad")
			.then(res => res.json())
			.then(data => {
				allArticles = data;
				renderArticles(currentPage);
				generatePageButtons();
				updatePaginationState();
			})
			.catch(err => {
				container.innerHTML = "<p>Error loading articles. Please try again later.</p>";
				console.error(err);
			});
	}

	function renderArticles(page) {
		container.innerHTML = "";
		const start = (page - 1) * articlesPerPage;
		const end = start + articlesPerPage;
		const articles = allArticles.slice(start, end);

		if (articles.length === 0) {
			container.innerHTML = "<p>No articles found.</p>";
			return;
		}

		articles.forEach((article) => {
			const col = document.createElement("div");
			col.className = "col-xl-6 col-lg-4 col-md-6";

			col.innerHTML = `
        <div class="article-publications-item">
          <div class="image">
            <a href="${article.url}" class="d-block w-100" target="_blank">
              <img src="${article.cover_image || 'assets/img/blog/default.jpg'}" alt="${article.title || 'Dev.to article'}" class="img-fluid w-100">
            </a>
            <a href="${article.url}" class="tags" target="_blank">${article.tag_list[0] || "Article"}</a>
          </div>
          <div class="text">
            <a href="${article.url}" class="title" target="_blank">${article.title}</a>
            <ul class="list-unstyled">
              <li>${Math.ceil(article.reading_time_minutes)} min read</li>
              <li>${new Date(article.published_at).toDateString()}</li>
            </ul>
          </div>
        </div>
      `;
			container.appendChild(col);
		});

		updatePaginationState();
	}

	function generatePageButtons() {
		// Remove old page number buttons
		const numberButtons = paginationContainer.querySelectorAll("li:not(.prev):not(.next):not(:has(.next-page-btn))");
		numberButtons.forEach(el => el.remove());

		const totalPages = Math.ceil(allArticles.length / articlesPerPage);
		for (let i = 1; i <= totalPages; i++) {
			const li = document.createElement("li");
			const btn = document.createElement("button");
			btn.textContent = i;

			if (i === currentPage) {
				btn.classList.add("active");
			}

			btn.addEventListener("click", () => {
				currentPage = i;
				renderArticles(currentPage);
				generatePageButtons();
			});

			li.appendChild(btn);
			paginationContainer.insertBefore(li, paginationContainer.querySelector(".next"));
		}
	}

	function updatePaginationState() {
		const totalPages = Math.ceil(allArticles.length / articlesPerPage);
		prevBtn.disabled = currentPage === 1;
		nextBtn.disabled = currentPage === totalPages;
	}

	prevBtn.addEventListener("click", () => {
		if (currentPage > 1) {
			currentPage--;
			renderArticles(currentPage);
			generatePageButtons();
		}
	});

	nextBtn.addEventListener("click", () => {
		const totalPages = Math.ceil(allArticles.length / articlesPerPage);
		if (currentPage < totalPages) {
			currentPage++;
			renderArticles(currentPage);
			generatePageButtons();
		}
	});

	const morePagesBtn = document.querySelector(".pagination .more-pages");
	if (morePagesBtn) {
		const totalPages = Math.ceil(allArticles.length / articlesPerPage);
		morePagesBtn.style.display = totalPages > 5 ? "inline-block" : "none";
	}

	// Initialize
	fetchArticles();

})(jQuery);
