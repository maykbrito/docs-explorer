// Update mb-slides when sections are ready
var observer = new MutationObserver(mutations => {
  const mbMd = document.querySelector("mb-md section")
  if(mbMd) {
    document.querySelector('mb-slides').setAttribute('reload', true)
    // observer.disconnect();
  }
});

observer.observe(document.querySelector("mb-md"), {attributes: true, childList: true, characterData: false, subtree:false});


class MbSlides extends HTMLElement {
  static observedAttributes = ['reload'];

  attributeChangedCallback(name, oldValue, newValue) {

    if (name === 'reload') {
      this.slides = document.querySelectorAll('mb-md section')
      if(!this.slides.length) {
        return
      }

      this.init()
    }
  }

  connectedCallback() {
    this.createView()
    this.handleWindowEvents()
    this.renderHelper()
  }

  createView() {
    const prevButton = this.createButton({nav: 'prev', text: 'Anterior'})
    const nextButton = this.createButton({nav: 'next', text: 'Próximo'})
    const spanWrapper = this.createSpan({nav: 'paginas', html: `
      <span data-nav="atual">1</span> /
      <span data-nav="total"></span>
    `})

    this.appendChild(prevButton)
    this.appendChild(spanWrapper)
    this.appendChild(nextButton)
  }

  createButton({nav, text}) {
    const a = document.createElement('a')
    a.dataset.nav = nav
    a.innerText = text
    a.addEventListener('click', (e) => this.handlePrevNextClick(e))
    return a
  }

  createSpan({nav, html}) {
    const span = document.createElement('span')
    span.dataset.nav = nav
    span.innerHTML = html
    return span
  }

  init() {
    this.totalSlides = this.slides.length,
    this.navAtual = this.querySelector('[data-nav="atual"]')
    this.navTotal = this.querySelector('[data-nav="total"]')
    this.btnPrev = this.querySelector('[data-nav="prev"]')
    this.btnNext = this.querySelector('[data-nav="next"]')
    this.lastUrlPath = +window.location.hash.split("/").pop()
    this.currentSlide = (this.lastUrlPath <= this.totalSlides ? this.lastUrlPath : 1) || 1


    this.navTotal.innerHTML = this.totalSlides
    this.slides.forEach(function(slide, index) {
        slide.dataset.slide = index + 1
    })


    this.update()
  }

  update() {
    this.updateNavigation()
    this.goToCurrentSlide()
    this.updateCurrentSlideUrl()
  }

  updateNavigation() {
    const prev = document.querySelector('[data-slide="' + (+this.currentSlide - 1) + '"]')
    const next = document.querySelector('[data-slide="' + (+this.currentSlide + 1) + '"]')
    this.setSlideNav(prev, this.btnPrev)
    this.setSlideNav(next, this.btnNext)
    this.navAtual.innerHTML = this.currentSlide
  }

  setSlideNav(section, button) {
    if (section) {
      button.dataset.slidenav = section.dataset.slide
      button.style.opacity = 1
    } else {
      button.dataset.slidenav = 1
      button.style.opacity = 0
    }
  }

  goToCurrentSlide() {
    document
      .querySelector("[data-slide='" + this.currentSlide + "']")
      .scrollIntoView()
  }

  updateCurrentSlideUrl() {
    const url = window.location.href.split("/")
    url.pop() // remove last slide number
    const newUrl = url.join("/") + "/" + this.currentSlide
    window.history.replaceState(null, null, newUrl)
  }

  handlePrevNextClick(e) {
    e.preventDefault()
    this.currentSlide = e.currentTarget.dataset.slidenav
    this.update()
  }

  toggleSlide() {
    const e = document.documentElement
    e.classList.toggle("notfullscreen")
    e.classList.toggle("fullscreen")
  }

  handleWindowEvents() {
    window.addEventListener("scroll", (e) => this.handleScroll(e))
    window.addEventListener("keydown", (e) => this.handleKeydown(e))
  }

  handleKeydown(e) {
    if(27 === e.keyCode) {
      this.toggleSlide()
      this.goToCurrentSlide()
    }

    if("h" === e.key) {
      this.toggleHelper()
    }

    if(!this.isFullscreen()) {
      return
    }

    if("ArrowLeft" === e.key) {
      this.btnPrev.click()
    } else if("ArrowRight" === e.key) {
      this.btnNext.click()
    }
  }

  handleScroll(e) {
  // this.slides.forEach(slide => {
  //   this.updateCurrentSlideAtCurrentSection(slide)
  // })
  }

  updateCurrentSlideAtCurrentSection(section) {
    const targetLine = scrollY + innerHeight / 2
  
    // verificar se a seção passou da linha
    // quais dados vou precisar?
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionTopReachOrPassedTargetline = targetLine >= sectionTop
  
    // verificar se a base está abaixo da linha alvo
  
    const sectionEndsAt = sectionTop + sectionHeight
    const sectionEndPassedTargetline = sectionEndsAt <= targetLine
  
    // limites da seção
    const sectionBoundaries =
      sectionTopReachOrPassedTargetline && !sectionEndPassedTargetline
  

    if (sectionBoundaries) {
      this.currentSlide = section.dataset.slide
      this.updateNavigation()
      this.updateCurrentSlideUrl()
    }
  }

  renderHelper() {
    const helper = document.createElement('div')
    helper.classList.add('helper')
    helper.innerHTML = `
      <div class="helper-item">
        <span class="tecla">ESC</span>
        <span class="tecla-title">Inicia Slide</span>
      </div>
      <div class="helper-item">
        <span class="tecla">Seta ->/<- </span>
            <span class="tecla-title">Navegação Slide</span>
      </div>
      <div class="helper-item">
        <span class="tecla">SHIFT + Seta ->/<- </span>
            <span class="tecla-title">Muda a Aula</span>
      </div>
      <div class="helper-item">
        <span class="tecla">H</span>
        <span class="tecla-title">Fecha/Abre Helper</span>
      </div>
    `

    if (localStorage.helper === "true") {
      helper.classList.add("active")
    }

    document.body.appendChild(helper)
  }

  toggleHelper() {
    const helper = document.querySelector(".helper")
    helper.classList.toggle("active")
    localStorage.helper = helper.classList.contains("active")
  }

  isFullscreen() {
    return document.documentElement.classList.contains("fullscreen")
  }
}

if (!customElements.get("mb-slides")) {
  customElements.define("mb-slides", MbSlides);
}