import "./mb-nav.js";
import "./mb-md.js";
import "./mb-slides.js";
import "./mb-controls.js";
import "./mb-search.js";

const mbNav = document.querySelector('mb-nav')
var observer = new MutationObserver(mutations => {
    const mbMd = document.querySelector("mb-md")
    mbMd.setAttribute('title', mbNav.dataset.slug)
    mbMd.setAttribute('module', mbNav.dataset.module)

  //  observer.disconnect();
});

observer.observe(mbNav, {attributes: true, childList: true, characterData: false, subtree:true});

