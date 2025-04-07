"use strict";

/**
 * @class CustomVideo
 * @extends HTMLElement
 * @description Custom element that wraps a video player with custom controls.
 * @example See video.liquid
 */
if (!!document.createElement("video").canPlayType) {
  customElements.define(
    "custom-video",
    class CustomVideo extends HTMLElement {
      static observerAttributes = ["volume"];

      constructor() {
        super();
      }
  
      connectedCallback() {
        const template = document.querySelector("#video-template");
        const shadowRoot = this.attachShadow({ mode: "open" });
  
        shadowRoot.appendChild(template.content.cloneNode(true));

        this.initElements();
        this.initEventListeners();
      }

      initElements() {
        this.videoContainer = this.shadowRoot.querySelector(".video-container");
        this.video = this.shadowRoot.querySelector("#video");
        this.videoControls = this.shadowRoot.querySelector("#video-controls");

        this.playpause = this.shadowRoot.querySelector("#toggleplaypause");
        this.stop = this.shadowRoot.querySelector("#stop");
        this.mute = this.shadowRoot.querySelector("#mute");
        this.volumeSlider = this.shadowRoot.querySelector('#volume');
        this.progress = this.shadowRoot.querySelector('#progress');
        this.fullscreen = this.shadowRoot.querySelector('#fullscreen');
        
        this.video.controls = false;
        this.videoControls.style.display = "block";
      }

      /**
       * Initializes event listeners to the video player controls.
       */
      initEventListeners() {
        this.playpause.addEventListener("click", () => this.togglePlayState());
        this.stop.addEventListener("click", () => this.stopVideo());
        this.mute.addEventListener("click", () => this.toggleMute());
        this.volumeSlider.addEventListener("input", () => this.changeVolume());
        this.volumeSlider.addEventListener("keydown", (event) => this.handleVolumeKeydown(event));
        this.video.addEventListener("loadedmetadata", () => this.updateProgressMax());
        this.video.addEventListener("timeupdate", () => this.updateProgress());
        this.progress.addEventListener("click", (e) => this.seek(e));
        this.progress.addEventListener("keydown", (event) => this.handleProgressKeydown(event));
        this.fullscreen.addEventListener("click", () => this.handleFullscreen());

        document.addEventListener("fullscreenchange", () => this.setFullscreenData(!!document.fullscreenElement));
      }

      togglePlayState() {
        if (this.video.paused || this.video.ended) {
          this.playpause.classList.remove("fa-play");
          this.playpause.classList.add("fa-pause");
          this.playpause.querySelector("span").textContent = "Pause";
          this.video.play();
        } else {
          this.playpause.classList.remove("fa-pause");
          this.playpause.classList.add("fa-play");
          this.playpause.querySelector("span").textContent = "Play";
          this.video.pause();
        }
      }

      stopVideo() {
        this.playpause.classList.remove("fa-pause");
        this.playpause.classList.add("fa-play");
        this.playpause.querySelector("span").textContent = "Play";
        this.video.pause();
        this.video.currentTime = 0;
        this.progress.value = 0;
      }

      toggleMute() {
        if (this.mute.getAttribute("aria-pressed") === "false") {
          this.mute.classList.remove("fa-volume-up");
          this.mute.classList.add("fa-volume-off");
          this.mute.setAttribute("aria-pressed", "true");
          this.video.muted = true;
        } else {
          this.mute.classList.remove("fa-volume-off");
          this.mute.classList.add("fa-volume-up");
          this.mute.setAttribute("aria-pressed", "false");
          this.video.muted = false;
        }
      }

      changeVolume() {
        const volume = this.volumeSlider.value;
        this.video.volume = volume;
        this.volumeSlider.setAttribute('aria-valuenow', volume * 100);
        this.volumeSlider.setAttribute('aria-valuetext', volume * 100 + '%');
      }

      /**
       * Sets the volume of the video on keydown.
       * @param {Event} event - The keyboard event.
       */
      handleVolumeKeydown(event) {
        let volume = parseFloat(this.volumeSlider.value);
        if (event.key === "ArrowLeft") {
          volume = Math.max(0, volume - 0.1);
        } else if (event.key === "ArrowRight") {
          volume = Math.min(1, volume + 0.1);
        }
        this.video.volume = volume;
        this.volumeSlider.value = volume;
        this.volumeSlider.setAttribute('aria-valuetext', volume * 100 + '%');
      }

      updateProgressMax() {
        this.progress.max = this.video.duration;
        this.progress.setAttribute("aria-valuemax", this.video.duration);
      }

      updateProgress() {
        const currentTime = this.video.currentTime.toFixed(2);
        const duration = this.video.duration.toFixed(2);
        const videoProgress = `${currentTime} out of ${duration} seconds`;
        this.progress.value = this.video.currentTime;
        this.progress.setAttribute("aria-valuenow", videoProgress);
        this.progress.setAttribute("aria-valuetext", videoProgress);
      }


      /**
       * Seeks the video to the specified time based on the user's click position on the progress bar.
       * @param {MouseEvent} event - The mouse event triggered by clicking on the progress bar.
       */
      seek(event) {
        const rect = this.progress.getBoundingClientRect();
        const pos = (event.pageX - rect.left) / this.progress.offsetWidth;
        this.video.currentTime = pos * this.video.duration;
      }

      handleProgressKeydown(event) {
        const currentTime = this.video.currentTime;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          this.togglePlayState();
        } else if (event.key === "ArrowLeft") {
          this.video.currentTime = Math.max(0, currentTime - 5);
        } else if (event.key === "ArrowRight") {
          this.video.currentTime = Math.min(this.video.duration, currentTime + 5);
        }
      }

      handleFullscreen() {
        if (document.fullscreenElement) {
          document.exitFullscreen();
          this.videoContainer.removeEventListener("keydown", this.fullScreenFocusManagement);
          this.setFullscreenData(false);
          this.fullscreen.focus();
        } else {
          this.videoContainer.requestFullscreen();
          this.videoContainer.addEventListener("keydown", this.fullScreenFocusManagement);
          this.setFullscreenData(true);
        }
      }

     /**
       * Sets the fullscreen data attribute and ARIA attribute based on the fullscreen state.
       * @param {boolean} state - The fullscreen state.
       */
      setFullscreenData(state) {
        this.$videoContainer.setAttribute("data-fullscreen", state);
        this.$fullscreen.setAttribute("aria-pressed", state.toString());
      }

      /**
       * Manages focus when entering fullscreen mode.
       * @param {KeyboardEvent} event - The keyboard event.
       */
      fullScreenFocusManagement(event) {
        const focusableElements = this.shadowRoot.querySelectorAll('.twenty-years-controls button, .twenty-years-controls input');
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        if (event.key === "Tab") {
          if (event.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
              lastFocusableElement.focus();
              event.preventDefault();
            }
          } else {
            if (document.activeElement === lastFocusableElement) {
              firstFocusableElement.focus();
              event.preventDefault();
            }
          }
        }
      }

      disconnectedCallback() {
        this.removeEventListeners();
      }

      removeEventListeners() {
        this.playpause.removeEventListener("click", this.playpauseHandler);
        this.stop.removeEventListener("click", this.stopHandler);
        this.mute.removeEventListener("click", this.muteHandler);
        this.volumeSlider.removeEventListener("input", this.volumeChangeHandler);
        this.volumeSlider.removeEventListener("keydown", this.volumeKeydownHandler);
        this.video.removeEventListener("loadedmetadata", this.loadedMetadataHandler);
        this.video.removeEventListener("timeupdate", this.timeUpdateHandler);
        this.progress.removeEventListener("click", this.progressClickHandler);
        this.progress.removeEventListener("keydown", this.progressKeydownHandler);
        this.fullscreen.removeEventListener("click", this.fullscreenHandler);

        document.removeEventListener("fullscreenchange", this.fullscreenChangeHandler);
      }
    },
  )  
}
