const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const header = document.querySelector(".site-header");
const glow = document.querySelector(".cursor-glow");
const progress = document.querySelector(".scroll-progress");
const hero = document.querySelector(".hero");
const heroStage = hero?.querySelector(".hero-stage");

if (hero) requestAnimationFrame(() => hero.classList.add("is-ready"));

heroStage?.addEventListener("pointermove", event => {
  if (!window.matchMedia("(pointer:fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const bounds = heroStage.getBoundingClientRect();
  const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
  const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;

  heroStage.querySelectorAll(".profile-wrap, .profile-orbit, .orbit-particle, .floating-label").forEach(element => {
    let strength = 0.6;
    if (element.classList.contains("profile-wrap")) strength = 1.1;
    if (element.classList.contains("floating-label")) strength = 1.5;
    element.style.setProperty("--pointer-x", `${horizontal * strength * 12}px`);
    element.style.setProperty("--pointer-y", `${vertical * strength * 12}px`);
  });
});

heroStage?.addEventListener("pointerleave", () => {
  heroStage.querySelectorAll(".profile-wrap, .profile-orbit, .orbit-particle, .floating-label").forEach(element => {
    element.style.removeProperty("--pointer-x");
    element.style.removeProperty("--pointer-y");
  });
});

menu?.addEventListener("click", () => nav.classList.toggle("open"));
document.querySelectorAll(".main-nav a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

const educationCards = document.querySelectorAll(".education-card[data-education-index]");
const educationSection = document.querySelector(".education");
const educationObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    educationObserver.unobserve(entry.target);
  });
}, { threshold: 0.18 });

const enableEducationMotion = () => {
  if (!educationCards.length || document.visibilityState !== "visible" || educationSection.classList.contains("education-motion")) return;
  educationSection.classList.add("education-motion");
  educationCards.forEach(card => educationObserver.observe(card));
};

document.addEventListener("visibilitychange", enableEducationMotion);
enableEducationMotion();

educationCards.forEach(card => {
  card.addEventListener("pointermove", event => {
    if (!window.matchMedia("(pointer:fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = card.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
    card.style.setProperty("--education-x", `${horizontal * -5}px`);
    card.style.setProperty("--education-y", `${vertical * -5}px`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.removeProperty("--education-x");
    card.style.removeProperty("--education-y");
  });
});

const recognitionSection = document.querySelector(".achievements");
const recognitionCards = [...document.querySelectorAll(".achievements .certificate")];
const recognitionTriggers = recognitionCards.map(card => card.querySelector(".certificate-trigger"));
const recognitionDialog = recognitionSection?.querySelector(".recognition-lightbox");
const lightboxImage = recognitionDialog?.querySelector(".lightbox-image");
const lightboxCount = recognitionDialog?.querySelector(".lightbox-count");
const lightboxTitle = recognitionDialog?.querySelector(".lightbox-title");
let activeRecognitionIndex = 0;
let recognitionOpener;

const recognitionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    recognitionObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

const enableRecognitionMotion = () => {
  if (!recognitionCards.length || document.visibilityState !== "visible" || recognitionSection.classList.contains("recognition-motion")) return;
  recognitionSection.classList.add("recognition-motion");
  recognitionCards.forEach(card => recognitionObserver.observe(card));
};

document.addEventListener("visibilitychange", enableRecognitionMotion);
enableRecognitionMotion();

function setRecognitionImage(index) {
  activeRecognitionIndex = (index + recognitionTriggers.length) % recognitionTriggers.length;
  const trigger = recognitionTriggers[activeRecognitionIndex];
  const image = trigger.querySelector("img");
  const category = trigger.querySelector(".certificate-category").textContent;
  const title = trigger.querySelector(".certificate-title").textContent;

  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt;
  lightboxCount.textContent = `${String(activeRecognitionIndex + 1).padStart(2, "0")} / ${String(recognitionTriggers.length).padStart(2, "0")}`;
  lightboxTitle.textContent = `${category} · ${title}`;
}

recognitionTriggers.forEach((trigger, index) => {
  trigger.addEventListener("click", () => {
    if (!recognitionDialog?.showModal) return;
    recognitionOpener = trigger;
    setRecognitionImage(index);
    recognitionDialog.showModal();
    recognitionDialog.querySelector(".lightbox-close").focus();
  });
});

recognitionDialog?.querySelector(".lightbox-close").addEventListener("click", () => recognitionDialog.close());
recognitionDialog?.querySelector(".lightbox-previous").addEventListener("click", () => setRecognitionImage(activeRecognitionIndex - 1));
recognitionDialog?.querySelector(".lightbox-next").addEventListener("click", () => setRecognitionImage(activeRecognitionIndex + 1));
recognitionDialog?.addEventListener("click", event => {
  if (event.target === recognitionDialog) recognitionDialog.close();
});
recognitionDialog?.addEventListener("cancel", event => {
  event.preventDefault();
  recognitionDialog.close();
});
recognitionDialog?.addEventListener("close", () => {
  const opener = recognitionOpener;
  requestAnimationFrame(() => opener?.focus({ preventScroll: true }));
});
recognitionDialog?.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    setRecognitionImage(activeRecognitionIndex - 1);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    setRecognitionImage(activeRecognitionIndex + 1);
  }
});

window.addEventListener("scroll", () => {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${height ? (window.scrollY / height) * 100 : 0}%`;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
});

window.addEventListener("mousemove", event => {
  if (window.matchMedia("(pointer:fine)").matches) {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }
});

const activityCarousel = document.querySelector(".about .activity-carousel");
const activityControls = document.querySelector(".about .classroom-head");
const slides = [...(activityCarousel?.querySelectorAll(".activity-slide") ?? [])];
const dots = [...(activityCarousel?.querySelectorAll(".carousel-dots .dot") ?? [])];
const activityImages = [...(activityCarousel?.querySelectorAll(".activity-media img") ?? [])];
const activityTrack = activityCarousel?.querySelector(".activity-track");
const activityLightbox = document.querySelector(".about .activity-lightbox");
const activityLightboxImage = activityLightbox?.querySelector(".activity-lightbox-image");
const activityLightboxCount = activityLightbox?.querySelector(".activity-lightbox-count");
const activityLightboxTitle = activityLightbox?.querySelector(".activity-lightbox-title");
const activityReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let currentSlide = 0;
let carouselTimer;
let activityInView = false;
let activityPaused = false;
let activityLightboxIndex = 0;
let activityLightboxOpener;

function showSlide(index) {
  currentSlide = Math.max(0, Math.min(index, slides.length - 1));
  if (activityTrack) activityTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  slides.forEach((slide, i) => {
    const active = i === currentSlide;
    slide.classList.toggle("active", active);
    slide.setAttribute("aria-hidden", String(!active));
    slide.querySelector(".activity-count").textContent = `${String(i + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  });
  dots.forEach((dot, i) => {
    const active = i === currentSlide;
    dot.classList.toggle("active", active);
    if (active) dot.setAttribute("aria-current", "true");
    else dot.removeAttribute("aria-current");
  });
  const previous = activityControls.querySelector(".carousel-prev");
  const next = activityControls.querySelector(".carousel-next");
  previous.disabled = currentSlide === 0;
  next.disabled = currentSlide === slides.length - 1;
}

function syncActivityPlayback() {
  clearInterval(carouselTimer);
  if (!activityCarousel || !activityInView || activityPaused || document.hidden || activityReducedMotion.matches || activityLightbox?.open || currentSlide === slides.length - 1) return;
  carouselTimer = setTimeout(() => {
    showSlide(currentSlide + 1);
    syncActivityPlayback();
  }, 5500);
}

activityControls?.querySelector(".carousel-next")?.addEventListener("click", () => {
  showSlide(currentSlide + 1);
  syncActivityPlayback();
});
activityControls?.querySelector(".carousel-prev")?.addEventListener("click", () => {
  showSlide(currentSlide - 1);
  syncActivityPlayback();
});
dots.forEach((dot, i) => dot.addEventListener("click", () => {
  showSlide(i);
  syncActivityPlayback();
}));

function setActivityLightboxImage(index) {
  activityLightboxIndex = Math.max(0, Math.min(index, slides.length - 1));
  const image = activityImages[activityLightboxIndex];
  const title = slides[activityLightboxIndex].querySelector("h4").textContent;
  activityLightboxImage.src = image.currentSrc || image.src;
  activityLightboxImage.alt = image.alt;
  activityLightboxCount.textContent = `${String(activityLightboxIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  activityLightboxTitle.textContent = title;
  activityLightbox.querySelector(".activity-lightbox-previous").disabled = activityLightboxIndex === 0;
  activityLightbox.querySelector(".activity-lightbox-next").disabled = activityLightboxIndex === slides.length - 1;
}

slides.forEach((slide, index) => {
  slide.querySelector(".activity-view").addEventListener("click", () => {
    if (!activityLightbox?.showModal) return;
    activityLightboxOpener = slide.querySelector(".activity-view");
    setActivityLightboxImage(index);
    activityLightbox.showModal();
    activityLightbox.querySelector(".activity-lightbox-close").focus();
    syncActivityPlayback();
  });
});

activityLightbox?.querySelector(".activity-lightbox-close").addEventListener("click", () => activityLightbox.close());
activityLightbox?.querySelector(".activity-lightbox-previous").addEventListener("click", () => setActivityLightboxImage(activityLightboxIndex - 1));
activityLightbox?.querySelector(".activity-lightbox-next").addEventListener("click", () => setActivityLightboxImage(activityLightboxIndex + 1));
activityLightbox?.addEventListener("click", event => {
  if (event.target === activityLightbox) activityLightbox.close();
});
activityLightbox?.addEventListener("cancel", event => {
  event.preventDefault();
  activityLightbox.close();
});
activityLightbox?.addEventListener("close", () => {
  const opener = activityLightboxOpener;
  requestAnimationFrame(() => opener?.focus({ preventScroll: true }));
  syncActivityPlayback();
});
activityLightbox?.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    setActivityLightboxImage(activityLightboxIndex - 1);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    setActivityLightboxImage(activityLightboxIndex + 1);
  }
});

activityCarousel?.addEventListener("mouseenter", () => {
  activityPaused = true;
  syncActivityPlayback();
});
activityCarousel?.addEventListener("mouseleave", () => {
  activityPaused = false;
  syncActivityPlayback();
});
activityCarousel?.addEventListener("focusin", () => {
  activityPaused = true;
  syncActivityPlayback();
});
activityCarousel?.addEventListener("focusout", event => {
  if (!activityCarousel.contains(event.relatedTarget)) {
    activityPaused = false;
    syncActivityPlayback();
  }
});
document.addEventListener("visibilitychange", syncActivityPlayback);
activityReducedMotion.addEventListener?.("change", syncActivityPlayback);

if (activityCarousel) {
  new IntersectionObserver(entries => {
    activityInView = entries.some(entry => entry.isIntersecting);
    if (activityInView) activityCarousel.classList.add("visible");
    syncActivityPlayback();
  }, { threshold: 0.15 }).observe(activityCarousel);

  activityCarousel.addEventListener("pointermove", event => {
    if (!window.matchMedia("(pointer:fine)").matches || activityReducedMotion.matches) return;
    const image = slides[currentSlide]?.querySelector(".activity-media img");
    if (!image) return;
    const bounds = activityCarousel.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    image.style.setProperty("--activity-x", `${x * -3}px`);
    image.style.setProperty("--activity-y", `${y * -3}px`);
  });

  activityCarousel.addEventListener("pointerleave", () => {
    activityImages.forEach(image => {
      image.style.removeProperty("--activity-x");
      image.style.removeProperty("--activity-y");
    });
  });
  showSlide(0);
}

const toolkitCarousel = document.querySelector("#toolkit-carousel");
if (toolkitCarousel) {
  const toolkitSlides = [...toolkitCarousel.querySelectorAll("[data-toolkit-slide]")];
  const toolkitDots = [...toolkitCarousel.querySelectorAll(".toolkit-dot")];
  const toolkitCount = toolkitCarousel.querySelector(".toolkit-count");
  const toolkitPause = toolkitCarousel.querySelector(".toolkit-pause");
  const toolkitStatus = toolkitCarousel.querySelector(".toolkit-sr-only");
  const toolkitCategories = ["skill-programming", "skill-database", "skill-web", "skill-ai", "skill-tools"];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeToolkit = 0;
  let toolkitTimer;
  let toolkitInView = false;
  let toolkitPausedByUser = reducedMotion.matches;

  function syncToolkitPlayback() {
    clearTimeout(toolkitTimer);
    const shouldPlay = toolkitInView && !toolkitPausedByUser && !document.hidden;
    toolkitCarousel.classList.toggle("is-paused", !shouldPlay);
    toolkitPause.setAttribute("aria-pressed", String(toolkitPausedByUser));
    toolkitPause.setAttribute("aria-label", toolkitPausedByUser ? "Start automatic rotation" : "Pause automatic rotation");
    toolkitPause.textContent = toolkitPausedByUser ? "▶" : "Ⅱ";
    if (!shouldPlay) return;
    toolkitTimer = setTimeout(() => {
      setToolkitSlide(activeToolkit + 1, false);
    }, 8000);
  }

  function setToolkitSlide(index, announce = false) {
    activeToolkit = (index + toolkitSlides.length) % toolkitSlides.length;
    toolkitSlides.forEach((slide, i) => {
      const active = i === activeToolkit;
      slide.hidden = !active;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    toolkitDots.forEach((dot, i) => {
      const active = i === activeToolkit;
      dot.classList.toggle("is-active", active);
      if (active) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    toolkitCarousel.classList.remove(...toolkitCategories);
    toolkitCarousel.classList.add(toolkitCategories[activeToolkit]);
    if (toolkitCount) toolkitCount.innerHTML = `${String(activeToolkit + 1).padStart(2, "0")} <i>/</i> ${String(toolkitSlides.length).padStart(2, "0")}`;
    if (announce && toolkitStatus) toolkitStatus.textContent = `Showing ${toolkitSlides[activeToolkit].getAttribute("aria-label")}`;
    syncToolkitPlayback();
  }

  toolkitCarousel.querySelector(".toolkit-prev")?.addEventListener("click", () => setToolkitSlide(activeToolkit - 1, true));
  toolkitCarousel.querySelector(".toolkit-next")?.addEventListener("click", () => setToolkitSlide(activeToolkit + 1, true));
  toolkitDots.forEach((dot, i) => dot.addEventListener("click", () => setToolkitSlide(i, true)));
  toolkitPause?.addEventListener("click", () => {
    toolkitPausedByUser = !toolkitPausedByUser;
    syncToolkitPlayback();
  });
  toolkitCarousel.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setToolkitSlide(activeToolkit - 1, true);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setToolkitSlide(activeToolkit + 1, true);
    }
  });
  document.addEventListener("visibilitychange", syncToolkitPlayback);
  reducedMotion.addEventListener?.("change", event => {
    if (event.matches) toolkitPausedByUser = true;
    syncToolkitPlayback();
  });
  new IntersectionObserver(entries => {
    toolkitInView = entries.some(entry => entry.isIntersecting);
    syncToolkitPlayback();
  }, { threshold: 0.2 }).observe(toolkitCarousel);
  setToolkitSlide(0, false);
}

document.querySelectorAll(".project-visual, .skill-cloud span, .other-grid span").forEach(item => {
  item.addEventListener("mousemove", event => {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    const rect = item.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    if (item.classList.contains("project-visual")) {
      item.style.transform = `perspective(1000px) rotateX(${y * -1.5}deg) rotateY(${x * 1.5}deg) translateY(-4px)`;
    }
  });

  item.addEventListener("mouseleave", () => {
    if (item.classList.contains("project-visual")) item.style.transform = "";
  });
});

document.querySelectorAll(".project-video-frame").forEach(frame => {
  const video = frame.querySelector(".project-demo-video");
  const playButton = frame.querySelector(".project-video-play");
  const syncPlayOverlay = () => frame.classList.toggle("is-playing", !video.paused && !video.ended);

  playButton.addEventListener("click", () => {
    video.play().catch(() => frame.classList.remove("is-playing"));
  });
  video.addEventListener("play", syncPlayOverlay);
  video.addEventListener("pause", syncPlayOverlay);
  video.addEventListener("ended", syncPlayOverlay);
});

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".main-nav a");

const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${entry.target.id}`
    ));
  });
}, { rootMargin: "-40% 0px -50% 0px" });

sections.forEach(section => activeObserver.observe(section));

const otherWork = document.querySelector(".other-work");
const otherProjectCards = [...(otherWork?.querySelectorAll(".other-project-card") ?? [])];
const otherVideoDialog = document.querySelector(".other-video-dialog");
const otherVideoPlayer = otherVideoDialog?.querySelector(".other-video-player");

if (otherWork && otherProjectCards.length) {
  const otherProjectsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      otherProjectsObserver.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  const enableOtherProjectMotion = () => {
    if (document.visibilityState !== "visible" || otherWork.classList.contains("other-work-motion")) return;
    otherWork.classList.add("other-work-motion");
    otherProjectCards.forEach((card, index) => {
      card.style.setProperty("--other-project-index", index);
      otherProjectsObserver.observe(card);
    });
  };

  document.addEventListener("visibilitychange", enableOtherProjectMotion);
  enableOtherProjectMotion();

  otherWork.querySelectorAll("[data-video]").forEach(button => {
    button.addEventListener("click", () => {
      if (!otherVideoDialog?.showModal) return;
      otherVideoPlayer.src = button.dataset.video;
      otherVideoPlayer.load();
      otherVideoDialog.showModal();
      otherVideoDialog.querySelector(".other-video-close").focus();
    });
  });

  const closeOtherVideo = () => {
    otherVideoPlayer.pause();
    otherVideoPlayer.removeAttribute("src");
    otherVideoPlayer.load();
    otherVideoDialog.close();
  };

  otherVideoDialog?.querySelector(".other-video-close").addEventListener("click", closeOtherVideo);
  otherVideoDialog?.addEventListener("click", event => {
    if (event.target === otherVideoDialog) closeOtherVideo();
  });
  otherVideoDialog?.addEventListener("cancel", event => {
    event.preventDefault();
    closeOtherVideo();
  });
}

const researchSection = document.querySelector(".research");
const researchTimeline = researchSection?.querySelector(".research-timeline");
const researchEntries = [...(researchSection?.querySelectorAll(".research-entry") ?? [])];
const researchPosterTrigger = researchSection?.querySelector(".research-poster-trigger");
const researchLightbox = researchSection?.querySelector(".research-lightbox");
const researchLightboxImage = researchLightbox?.querySelector(".research-lightbox-image");
let researchPosterOpener;

if (researchSection && researchEntries.length) {
  const researchObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      researchObserver.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  const enableResearchMotion = () => {
    if (document.visibilityState !== "visible" || researchSection.classList.contains("research-motion")) return;
    researchSection.classList.add("research-motion");
    researchEntries.forEach((entry, index) => {
      entry.style.setProperty("--entry-index", index);
      researchObserver.observe(entry);
    });
  };

  const updateResearchProgress = () => {
    const bounds = researchTimeline.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const progress = Math.max(0, Math.min(1, (viewportHeight * 0.72 - bounds.top) / (bounds.height + viewportHeight * 0.28)));
    researchTimeline.style.setProperty("--research-progress", `${progress * 100}%`);
  };

  let researchFrame = 0;
  const requestResearchProgress = () => {
    if (researchFrame) return;
    researchFrame = requestAnimationFrame(() => {
      researchFrame = 0;
      updateResearchProgress();
    });
  };

  document.addEventListener("visibilitychange", enableResearchMotion);
  window.addEventListener("scroll", requestResearchProgress, { passive: true });
  window.addEventListener("resize", requestResearchProgress);
  enableResearchMotion();
  updateResearchProgress();

  researchPosterTrigger?.addEventListener("click", () => {
    if (!researchLightbox?.showModal) return;
    researchPosterOpener = researchPosterTrigger;
    researchLightboxImage.src = researchPosterTrigger.querySelector("img").currentSrc || researchPosterTrigger.querySelector("img").src;
    researchLightboxImage.alt = researchPosterTrigger.querySelector("img").alt;
    researchLightbox.showModal();
    researchLightbox.querySelector(".research-lightbox-close").focus();
  });

  researchLightbox?.querySelector(".research-lightbox-close").addEventListener("click", () => researchLightbox.close());
  researchLightbox?.addEventListener("click", event => {
    if (event.target === researchLightbox) researchLightbox.close();
  });
  researchLightbox?.addEventListener("cancel", event => {
    event.preventDefault();
    researchLightbox.close();
  });
  researchLightbox?.addEventListener("close", () => {
    const opener = researchPosterOpener;
    requestAnimationFrame(() => opener?.focus({ preventScroll: true }));
  });
}
