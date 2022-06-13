class MbSearch extends HTMLElement {
  connectedCallback() {
    this.render()
  }

  render() {
    this.innerHTML = `
      <input type="text" placeholder="Pesquisar..." id="search">
    `

    this.searching()
  }

  searching() {
    const search = document.getElementById('search')

    const executeSearch = (query) => {
      console.log(query.length > 0 ? `You searched ${query}` : "Search empty")
    }
    
    const debounce = (callbackfn, delay) => {
        let timeoutId;
        return (query) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                callbackfn(query)
            }, delay);
        };
    };
    
    const handleDebounce = debounce(query => executeSearch(query), 1000)
    
    search.addEventListener("input", (e) => handleDebounce(e.target.value));
  }
}

if (!customElements.get("mb-search")) {
  customElements.define("mb-search", MbSearch);
}