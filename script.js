document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("Playlist.json");
    const data = await response.json();

    // Set playlist info
    document.getElementById("playlist-title").textContent = `🎶 ${data.title}`;
    document.getElementById("author").textContent = `By ${data.author}`;
    document.getElementById("meta").textContent = `${data.privacy} • ${data.year} • ${data.trackCount} tracks • ${data.duration}`;
    document.getElementById("description").textContent = data.description || "";

    // Thumbnail (use the second high-res image, fallback to low-res)
    const img = data.thumbnails?.[1]?.url || data.thumbnails?.[0]?.url || "https://placekitten.com/300/300"; // fallback to low-res or kitten image
    document.getElementById("cover-img").src = img;

    // Tracks
    const trackList = document.getElementById("track-list");
    data.tracks.forEach(track => {
      // Ensure album is defined and prepare album link only if available
      const albumLink = track.album ? 
        `<a href="https://music.youtube.com/browse/${track.album.id}" target="_blank" class="text-pink-500 hover:underline">${track.album.name}</a>` 
        : "";

      const artistNames = track.artists.map(a => 
        `<a href="https://music.youtube.com/channel/${a.id}" target="_blank" class="text-pink-500 hover:underline">${a.name}</a>`
      ).join(", ");

      // Always take the second high-res album thumbnail, fallback to low-res, or cat image if none
      const albumImg = track.thumbnails?.[1]?.url || track.thumbnails?.[0]?.url || "https://placekitten.com/60/60"; // fallback to low-res or kitten image

      // Cache the image URL in localStorage to avoid reloading
      if (!localStorage.getItem(albumImg)) {
        // Cache the image URL for future use
        const img = new Image();
        img.src = albumImg;
        img.onload = () => {
          localStorage.setItem(albumImg, albumImg);  // Store in localStorage when the image is loaded
        };
      }

      // Use cached image if available
      const cachedImg = localStorage.getItem(albumImg) || albumImg;

      const trackEl = document.createElement("div");
      trackEl.className = "flex justify-between items-center hover:bg-pink-100 p-2 rounded-lg transition";
      trackEl.innerHTML = `
        <div class="flex items-center">
          <img src="${cachedImg}" alt="${track.album?.name || 'No Album'}" class="w-12 h-12 object-cover rounded-md mr-4" />
          <div>
            <p class="font-bold"><a href="https://music.youtube.com/watch?v=${track.videoId}" target="_blank">${track.title}</a></p>
            <p class="text-sm text-pink-500">${artistNames} ${albumLink}</p>
          </div>
        </div>
        <span>${track.duration}</span>
      `;
      trackList.appendChild(trackEl);
    });

  } catch (err) {
    console.error("Error loading playlist:", err);
  }
});
