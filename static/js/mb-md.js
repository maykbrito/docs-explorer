const LECTURES_PATH = './static/docs';

class MbMd extends HTMLElement {
  static observedAttributes = ['title', 'module'];

  get url() {
    return this.getAttribute('url')
  }

  attributeChangedCallback(name, oldValue, newValue) {
    let moduleName = this.getAttribute('module')
    let title = this.getAttribute('title')
    
    if(moduleName == 'undefined') {
      moduleName = '404'
      title = "not-found"
    }

    if (name === 'title') {
      document.title = title
      window.localStorage.lecture = title
    }

    if (name === 'module') {
      this.setAttribute('url', `${LECTURES_PATH}/${moduleName}/${title}.md`)
      this.render()
    }
  }

  connectedCallback() {
    if(!window.markdownit) {
      console.log('This app needs markdownit to work')
      return
    }
  }

  async render() {
    await this.loadMD();
    this.formatMD()
    this.innerHTML = this.md

    if(Prism.highlightAll) {
      Prism.highlightAll()
    }

    this.formatIframe()
  }

  async loadMD() {
    const res = await fetch(this.url);
    const md = await res.text();
    this.md = window.markdownit().render(md)
  }

  formatMD() {
    this.md = this.formatH1().formatH2().formatH3().formatHr().formatImg().md;
  }

  formatH1() {
    this.md = this.md.split("<h1>").join('<section class="capa"><div><h1>')
    return this
  }

  formatH2() {
    this.md = this.md.split("<h2>").join("<section><div><h2>")
    return this
  }

  formatH3() {
    this.md = this.md.split("<h3>").join("<section><div><h3>")
    return this
  }

  formatHr() {
    this.md = this.md.split("<hr>").join("</div></section>")
    return this
  }

  formatImg() {
    const i = this.url.split("/")
    i.pop()
    const r = i.join("/")
    this.md = this.md.replace(/(\<img src\=\")/g, "$&" + r + "/")
    return this
  }

  formatIframe() {
    const iframeBlock = Array.from(document.querySelectorAll("h2")).find(h2 => 
        "IFRAME" === h2.innerText.toUpperCase()
    );

    if(!iframeBlock) {
      return 
    }

    const reformatIframe = iframeBlock.nextElementSibling.innerHTML.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    iframeBlock.nextElementSibling.outerHTML = reformatIframe,
    iframeBlock.parentElement.classList.add("iframe"),
    iframeBlock.parentElement.parentElement.classList.add("section-iframe"),
    iframeBlock.remove()

  }
}

if (!customElements.get("mb-md")) {
  customElements.define("mb-md", MbMd);
}