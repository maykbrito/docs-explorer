class MbNav extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  async render() {
    const navUrl = this.getAttribute("url")
    const nav = await fetch(navUrl).then(res => res.json())
    const navEl = this.createNav(nav)
    this.appendChild(navEl)
    this.setCurrentSlug()
    this.handleKeyEvent()
  }


  handleClick (e) {
    e.preventDefault()
    const { slug } = e.currentTarget.dataset
    const baseUrl = location.href.split("#")[0]
    const newUrl = `${baseUrl}#/${slug}/1`

    window.history.replaceState(null, null, newUrl)
    this.setCurrentSlug()
  }

  handleKeyEvent() {
    const keypressed = {}

    const doKeyMenuNavigation = (e) => {
      const links = [...document.querySelectorAll(".lecture a")]
      const activeLinks = links.filter(e => e.classList.contains("active"))
      const activeLinkIndex = links.indexOf(activeLinks[0]);

      keypressed[e.key] = "keydown" === e.type

      if (keypressed.Shift && keypressed.ArrowRight) { 
        links[activeLinkIndex + 1]?.click() 
      } 
      else if (keypressed.Shift && keypressed.ArrowLeft) {
        links[activeLinkIndex - 1]?.click()
      }
    }

    // reset keypressed
    window.addEventListener("keyup", doKeyMenuNavigation)

    // register keypressed
    window.addEventListener("keydown", doKeyMenuNavigation)
  }

  createLink({moduleName, slug, title, id}) {
    const link = document.createElement('a')
    link.dataset.module = moduleName
    link.dataset.slug = slug
    link.href = '#'
    link.innerHTML = `${title} <span>${id}</span>`
    link.addEventListener('click', (e) => this.handleClick(e))

    return link
  }

  createLecture({ moduleTitle, title, id}) {
    const li = document.createElement('li');
    li.classList.add('lecture');

    // name without spaces, no special characters and lowercase
    const moduleName = moduleTitle.replace(/\s/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();


    // transform title to lowercase and replace spaces with dashes
    let slug = title.toLowerCase().replace(/\s/g, '-');
    slug = `${id}-${slug}`;


    // li.innerHTML = `<a data-module="${module}" data-slug="${slug}" href="#">${title} <span>${id}</span></a>`;

    li.appendChild(this.createLink({moduleName, slug, title, id}))
    return li
  }

  createModule({ title, lectures }) {
    const li = document.createElement('li');
    li.classList.add('module');
    li.innerHTML = `<span>${title}</span>`;
    const ul = document.createElement('ul');
    lectures.forEach(lecture => {
      ul.appendChild(this.createLecture({...lecture, moduleTitle: title}));
    });
    li.appendChild(ul);
    return li
  }

  createNav({ modules }) {
    const ul = document.createElement('ul');
    Object.keys(modules).forEach(module => {
      const moduleObj = {
        title: module,
        lectures: modules[module]["lectures"]
      }
      ul.appendChild(this.createModule(moduleObj));
    });

    return ul
  }

  setCurrentSlug() {
    this.resetMenuItemActive()
    
    const slug = decodeURI(window.location.hash.split("/")[1]);
    const active = document.querySelector("[data-slug='" + slug + "']")
    active?.classList.add("active")

    // to load .md file I need to set the data-module and data-slug attributes
    this.setAttribute('data-module', active?.dataset.module)
    this.setAttribute('data-slug', active?.dataset.slug)
  }

  resetMenuItemActive() {
    document.querySelectorAll('.module a').forEach( a => {
      a.classList.remove("active")
    })
  }
}

if (!customElements.get("mb-nav")) {
  customElements.define("mb-nav", MbNav);
}

// reference: https://css-tricks.com/building-interoperable-web-components-react/