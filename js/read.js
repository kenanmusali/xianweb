const NEWS = {
      1: {
        title: "Tranzit Embraces AI for Optimized Route Planning",
        date:  "September 15, 2025",
        content: `
          <p>Our new AI engine re-calculates freight routes in real-time, dynamically adjusting for traffic, weather, and load capacity.</p>
          <p>By cutting idle miles by 18%, we’re saving our customers millions in fuel and labor costs each quarter. These savings are not just financial—they represent a significant leap forward in operational efficiency and sustainability. With fewer unnecessary miles traveled, vehicles experience less wear and tear, reducing maintenance demands and extending fleet lifespan. At the same time, optimized routing lowers carbon emissions, helping our partners meet their environmental goals. Our clients also benefit from improved delivery timelines and enhanced route predictability, which strengthens supply chain reliability and customer satisfaction. As transportation networks grow more complex, our real-time AI adjustments ensure that every route is intelligently planned, continuously refined, and aligned with both economic and environmental priorities.</p>
        `,
        images: [
          "/img/1xian.png",
          "/img/2xian.png",
          "/img/3xian.png",
          "/img/4xian.png",

        ]
      },
      2: { /* … your other items … */ },
      3: { /* … */ },
      4: { /* … */ }
    };

    // 2. Grab ?id= from URL, fallback to 1
    const params  = new URLSearchParams(location.search);
    const id      = params.get("id") || "1";
    const article = NEWS[id] || NEWS["1"];

    document.getElementById("title").innerText   = article.title;
    document.getElementById("date").innerText    = article.date;
    document.getElementById("content").innerHTML = article.content;

    const mainImg = article.images.shift();
    const cover   = document.createElement("div");
    cover.className = "cover";
    cover.innerHTML = `<img src="${mainImg}" alt="Cover image"/>`;
    document.querySelector(".article").insertBefore(
      cover,
      document.getElementById("title").nextSibling
    );

    const gallery = document.getElementById("gallery");
    article.images.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      gallery.appendChild(img);
    });

    const shareUrl = encodeURIComponent(window.location.href);
    document.querySelector(".share-fb").href = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    document.querySelector(".share-tw").href = `https://twitter.com/intent/tweet?url=${shareUrl}`;
    document.querySelector(".share-ln").href = `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`;

    const lightbox    = document.getElementById("lightbox");
    const lightboxImg = lightbox.querySelector("img");
    gallery.addEventListener("click", e => {
      if (e.target.tagName!=="IMG") return;
      lightboxImg.src = e.target.src;
      lightbox.classList.add("show");
    });
    lightbox.addEventListener("click", () => {
      lightbox.classList.remove("show");
    });