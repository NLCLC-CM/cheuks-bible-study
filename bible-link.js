class BibleLink extends HTMLElement {
    static observedAttributes = ['version'];
    verse = '';
    version = 'NIV';
    content = '';

    constructor() {
        super();

        if (this.hasAttribute('verse')) {
            this.verse = this.getAttribute('verse');
            this.content = this.innerHTML.trim();
        } else {
            this.verse = this.innerHTML.trim();
            this.content = this.verse;
        }

        if (this.hasAttribute('version')) {
            this.version = this.getAttribute('version');
        }
    }

    connectedCallback() {
        this.renderEverything();
    }

    renderEverything() {
        const url = new URL('https://www.biblegateway.com/passage/');
        url.searchParams.append('search', this.verse);
        url.searchParams.append('version', this.version);

        this.innerHTML = `<a href="${url.toString()}">${this.content}</a>`;
    }

    attributeChangedCallback(name) {
        if (name === 'version') {
            this.version = this.getAttribute('version');
            this.renderEverything();
        }
    }
}

customElements.define('bible-link', BibleLink);
