let currentIndex = 0;
const works = document.querySelectorAll(".media-gallery img, .media-gallery video, .media-gallery-random img, .media-gallery-random video");
let debounceTimer;

function openLightbox(index) {
    if (index < 0 || index >= works.length) return;

    currentIndex = index; 
    const media = works[index];
    const lightbox = document.getElementById("lightbox-modal");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxVideo = document.getElementById("lightbox-video");
    const lightboxTitle = document.getElementById("lightbox-title");
    const lightboxDescription = document.getElementById("lightbox-description");

    if (!lightbox) return; // Safeguard

    lightboxTitle.textContent = media.getAttribute("data-title") || "Untitled";
    lightboxDescription.textContent = media.getAttribute("data-description") || "No description available.";

    if (media.tagName.toLowerCase() === "video") {
        lightboxVideo.src = media.src || media.querySelector("source")?.src;
        lightboxVideo.style.display = "block";
        lightboxImg.style.display = "none";
    } else {
        lightboxImg.src = media.src;
        lightboxImg.style.display = "block";
        lightboxVideo.style.display = "none";
    }

    lightbox.style.display = "flex";
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox-modal");
    if (lightbox) lightbox.style.display = "none";
}

function changeImage(direction) {
    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        currentIndex += direction;
        if (currentIndex >= works.length) currentIndex = 0;
        if (currentIndex < 0) currentIndex = works.length - 1;
        openLightbox(currentIndex);
    }, 200);
}

// THIS WAS FREEZING YOUR PHONE - NOW SAFEGUARDED
window.addEventListener("scroll", function() {
    const progressBar = document.getElementById("progress-bar");
    if (progressBar) { // Only calculate if the progress bar exists!
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        let scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (scrollHeight > 0) {
            let scrollPercent = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrollPercent + "%";
        }
    }
});


document.addEventListener("DOMContentLoaded", () => {
    // Safeguard Lightbox Arrows
    const arrowLeft = document.querySelector(".arrow.left");
    const arrowRight = document.querySelector(".arrow.right");
    if (arrowLeft) arrowLeft.addEventListener("click", () => changeImage(-1));
    if (arrowRight) arrowRight.addEventListener("click", () => changeImage(1));

    works.forEach((element, index) => {
        element.addEventListener("click", () => openLightbox(index));
    });

    document.addEventListener("keydown", (event) => {
        const lightbox = document.getElementById("lightbox-modal");
        if (lightbox && lightbox.style.display === "flex") { 
            if (event.key === "ArrowLeft") changeImage(-1);
            else if (event.key === "ArrowRight") changeImage(1);
            else if (event.key === "Escape") closeLightbox();
        }
    });

    // Safeguard Click Counter
    const clickCounter = document.getElementById("click-counter");
    if (clickCounter) {
        let clickCount = parseInt(sessionStorage.getItem("clickCount")) || 0;
        clickCounter.innerText = `You clicked ${clickCount} times.`;
        document.addEventListener("click", () => {
            clickCount++;
            sessionStorage.setItem("clickCount", clickCount);
            clickCounter.innerText = `You clicked ${clickCount} times.`;
        });
    }

    // Safeguard Current Date
    const dateElement = document.getElementById("current-date");
    if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    }

    generateArchive();
});

// Session timer logic
window.addEventListener("load", function() {
    if (!sessionStorage.getItem("startTime")) {
        sessionStorage.setItem("startTime", Date.now().toString()); 
    }
    setInterval(() => {
        const startTime = parseInt(sessionStorage.getItem("startTime"), 10); 
        const timer = document.getElementById("timer");
        if (!isNaN(startTime) && timer) {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            timer.innerText = `You've been here for ${elapsedTime} seconds.`;
        }
    }, 1000);
});

window.onbeforeunload = function() {
    sessionStorage.removeItem("startTime");
};

// Page loader effect
window.addEventListener("load", () => {
    const loader = document.getElementById("page-loader");
    const content = document.getElementById("content");
    if (loader) loader.style.opacity = 0;
    setTimeout(() => {
        if (loader) loader.style.display = "none";
        if (content) content.style.display = "block";
    }, 500);
});

// Safeguard Menu Icon
const menu = document.getElementById("menu");
const menuButton = document.getElementById("menu-button");
if (menuButton && menu) {
    menuButton.addEventListener("click", function() {
        menu.classList.toggle("show");
        menuButton.classList.toggle("active");
        document.body.classList.toggle("menu-open"); 
    });
}

// Safeguard Search Bar
const searchBar = document.getElementById("search-bar");
if (searchBar) {
    searchBar.addEventListener("input", function () {
        const query = this.value.toLowerCase();
        filterArchive(query);
    });
    searchBar.addEventListener('input', searchKeyword);
}

function filterArchive(query) {
    const archiveItems = document.querySelectorAll(".archive-item");
    archiveItems.forEach(item => {
        const title = item.querySelector(".archive-title").textContent.toLowerCase();
        const content = item.querySelector(".archive-content").textContent.toLowerCase();
        item.style.display = (title.includes(query) || content.includes(query)) ? "flex" : "none";
    });
}

const archiveData = [
    { title: "BOJVCK OUTTA MOTHERLAND", year: 2026, content: "January 23, 2026", thumbnail: "FOOTAGE/IMAGE/2026/BOJVCK_OUTTA_MOTHERLAND/bojvckthumbnail.jpg", link: "2026JANUARY_BOJVCK_OUTTAMOTHERLAND.html" },
    { title: "WRECK IT REKK!", year: 2026, content: "January 18, 2026", thumbnail: "FOOTAGE/IMAGE/2026/WRECK_IT_REKK/senegalbonnetthumbnail.jpg", link: "2026JANUARY_WRECKITREKK.html" },
    { title: "OJOS DE 2016", year: 2025, content: "December 22, 2026", thumbnail: "FOOTAGE/IMAGE/2025/OJOS_DE_2016/ojosde2016thumbnail.jpg", link: "2025OJOSDE2016.html" },
    { title: "I AM PRADA OF YOU", year: 2025, content: "December 26, 2025", thumbnail: "FOOTAGE/IMAGE/2025/I_AM_PRADA_OF_YOU/iampradaofyouthumbnail.jpg", link: "2025IAMPRADAOFYOU.html" },
    { title: "EXPERIENCED AMATEUR", year: 2025, content: "October 2, 2025", thumbnail: "FOOTAGE/IMAGE/BLUEWALLPHOTOSHOOTCHOISY/leopoldthumbnail.jpg", link: "2025EXPERIENCED_AMATEUR.html" },
    { title: "MUTATED JUNGLE", year: 2025, content: "June 6, 2025", thumbnail: "FOOTAGE/IMAGE/MUTATED JUNGLE/homethumbnail.jpg", link: "2025MUTATED_JUNGLE.html" },
    { title: "PÉRIODE BLEUE", year: 2025, content: "April 12, 2025", thumbnail: "FOOTAGE/IMAGE/ARCHIVE_THUMBNAILS/lanouvellevagueinstapost.jpg", link: "2025PERIODE_BLEUE.html" },
    { title: "ECDYSIS ISSUE", year: 2025, content: "March 3, 2025", thumbnail: "FOOTAGE/IMAGE/VIDEO THUMBNAILS/gaelreadingissue3.jpg", link: "2025ECDYSIS.html" },
    { title: "RANDOM 2025", year: 2025, content: "December 31, 2025", thumbnail: "FOOTAGE/IMAGE/ARCHIVE_THUMBNAILS/melookingthruthewindow2.jpg", link: "2025RANDOM2025.html" },
    { title: "'ANTHROPOCÈNE'", year: 2024, content: "August 19, 2024", thumbnail: "FOOTAGE/IMAGE/ARCHIVE_THUMBNAILS/eneko.avif", link: "2024ANTHROPOCENE.html" },
    { title: "ACWS", year: 2024, content: "May 12, 2024", thumbnail: "FOOTAGE/IMAGE/ACWS/santi_squared.jpg", link: "2024ACWS.html" },
    { title: "'BOUQUET DE FLEURS'", year: 2024, content: "May 5, 2024", thumbnail: "FOOTAGE/IMAGE/ARCHIVE_THUMBNAILS/chaeyu1.avif", link: "2024BOUQUET DE FLEURS.html" },
    { title: "'SANS TITRE'", year: 2024, content: "March 26, 2024", thumbnail: "FOOTAGE/IMAGE/ARCHIVE_THUMBNAILS/milan2.avif", link: "2024SANS_TITRE.html" },
    { title: "'THE BARRACKS'", year: 2024, content: "March 26, 2024", thumbnail: "FOOTAGE/IMAGE/ARCHIVE_THUMBNAILS/lanouvellevague.avif", link: "2024THE_BARRACKS.html" },
    { title: "'BLIND SELF RELIANCE'", year: 2024, content: "April 12, 2024", thumbnail: "FOOTAGE/IMAGE/ARCHIVE_THUMBNAILS/diego.jpg", link: "2024BLIND_SELF_RELIANCE.html" },
    { title: "RANDOM 2024", year: 2024, content: "December 31, 2024", thumbnail: "FOOTAGE/IMAGE/RANDOM 2024/ladybird.jpg", link: "2024RANDOM2024.html" },
    { title: "FICDB ISSUE", year: 2024, content: "February 2, 2024", thumbnail: "FOOTAGE/IMAGE/VIDEO THUMBNAILS/eyesissue2.jpg", link: "2024FICDB.html" },
    { title: "'UN1T' DIRECTED BY SEUNGYU JUNG", year: 2023, content: "May 30, 2023", thumbnail: "FOOTAGE/IMAGE/VIDEO THUMBNAILS/un1t.jpg", link: "2023UN1T.html" },
    { title: "The Refusal of The Creation", year: 2023, content: "June 3, 2023", thumbnail: "FOOTAGE/IMAGE/THEREFUSALOFTHECREATION/therefusalofthecreationthumbnail.jpg", link: "2023THE_REFUSAL_of_THE_CREATION.html" }
];

function generateArchive() {
    const container = document.getElementById("archive-container");
    if (!container) return; // Safeguard if not on Archive page

    container.innerHTML = "";
    const grouped = archiveData.reduce((acc, item) => {
        acc[item.year] = acc[item.year] || [];
        acc[item.year].push(item);
        return acc;
    }, {});

    Object.keys(grouped).sort((a, b) => b - a).forEach(year => {
        const yearSection = document.createElement("div");
        yearSection.classList.add("archive-year-section");

        const yearHeader = document.createElement("div");
        yearHeader.classList.add("archive-year-header");
        yearHeader.textContent = year;

        const grid = document.createElement("div");
        grid.classList.add("archive-grid");
        grid.style.display = "none";

        grouped[year].forEach(item => {
            const linkWrapper = document.createElement("a");
            linkWrapper.href = item.link;
            linkWrapper.classList.add("archive-item");

            const thumbnail = document.createElement("img");
            thumbnail.src = item.thumbnail;
            thumbnail.classList.add("archive-thumbnail");

            const title = document.createElement("h4");
            title.classList.add("archive-title");
            title.textContent = item.title;

            const content = document.createElement("p");
            content.classList.add("archive-content");
            content.textContent = item.content;

            linkWrapper.append(thumbnail, title, content);
            grid.appendChild(linkWrapper);
        });

        yearHeader.addEventListener("click", () => {
            const isVisible = grid.style.display === "grid";
            grid.style.display = isVisible ? "none" : "grid";
            yearHeader.classList.toggle("open", !isVisible);
        });

        yearSection.append(yearHeader, grid);
        container.appendChild(yearSection);
    });
}

function searchKeyword() {
    clearSearch();
    const searchInput = document.getElementById('search-bar');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.trim();
    if (!searchTerm) return;

    const regex = new RegExp(searchTerm, 'gi');
    const yearSections = document.querySelectorAll('.archive-year-section');
    const foundInSections = new Set();

    document.querySelectorAll('.archive-title, .archive-content').forEach(el => {
        const originalText = el.textContent;
        if (regex.test(originalText)) {
            el.innerHTML = originalText.replace(regex, match => `<span class="highlight">${match}</span>`);
            foundInSections.add(el.closest('.archive-year-section'));
        }
    });

    yearSections.forEach(section => {
        const grid = section.querySelector('.archive-grid');
        const header = section.querySelector('.archive-year-header');
        if (foundInSections.has(section)) {
            grid.style.display = "grid";
            header.classList.add("open");
        } else {
            grid.style.display = "none";
            header.classList.remove("open");
        }
    });
}

function clearSearch() {
    document.querySelectorAll('.highlight').forEach(span => {
        const parent = span.parentNode;
        parent.replaceChild(document.createTextNode(span.textContent), span);
        parent.normalize();
    });

    document.querySelectorAll('.archive-year-section').forEach(section => {
        section.querySelector('.archive-grid').style.display = "none";
        section.querySelector('.archive-year-header').classList.remove("open");
    });
}