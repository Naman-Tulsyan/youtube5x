// Common function to set playback rate on all videos
function setPlaybackRate(rate) {
  if (!isFinite(rate)) return;
  rate = Math.min(Math.max(rate, 0.25), 5); // clamp between 0.25 and 5
  document.querySelector("#speedSlider").value = rate;
  document.querySelector(".speed-display").textContent = rate.toFixed(2) + "x";

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (rate) => {
        const videos = document.querySelectorAll("video");
        videos.forEach(video => {
          if (video instanceof HTMLMediaElement) {
            video.playbackRate = rate;
          }
        });
      },
      args: [rate]
    });
  });
}

// Buttons click listener
document.querySelectorAll(".buttons button").forEach(button => {
  button.addEventListener("click", () => {
    const rate = parseFloat(button.dataset.rate);
    setPlaybackRate(rate);
  });
});

// Slider change listener
const slider = document.querySelector("#speedSlider");
const speedDisplay = document.querySelector(".speed-display");
slider.addEventListener("input", () => {
  const rate = parseFloat(slider.value);
  speedDisplay.textContent = rate.toFixed(2) + "x";
  setPlaybackRate(rate);
});

// Keyboard control
window.addEventListener("keydown", (e) => {
  let currentRate = parseFloat(slider.value);

  if (e.key === "ArrowUp" || e.key === "ArrowRight") {
    e.preventDefault();
    currentRate = Math.min(currentRate + 0.1, 5);
    setPlaybackRate(currentRate);
  } 
  else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
    e.preventDefault();
    currentRate = Math.max(currentRate - 0.1, 0.25);
    setPlaybackRate(currentRate);
  } 
  else if (e.key === "0") {
    e.preventDefault();
    setPlaybackRate(1);
  }
});
