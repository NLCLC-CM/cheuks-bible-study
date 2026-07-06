// Central registry to manage footnote data across components
class FootnoteManager extends EventTarget {
  constructor() {
    super();
    this.notes = [];
  }

  register(text) {
    const index = this.notes.length + 1;
    this.notes.push({ index, text });
    this.dispatchEvent(new CustomEvent('update', { detail: this.notes }));
    return index;
  }
}

const footnoteManager = new FootnoteManager();

// 1. Individual Footnote Component
class CustomFootnote extends HTMLElement {
  connectedCallback() {
    const content = this.innerHTML.trim();
    // Register content and get the auto-incremented index
    const index = footnoteManager.register(content);

    // Render the inline link
    this.innerHTML = `
      <sup>
        <a href="#fn-${index}" id="fn-ref-${index}" aria-describedby="fn-${index}">
          [${index}]
        </a>
      </sup>
    `;
  }
}

// 2. Footnotes Section Component
class CustomFootnotes extends HTMLElement {
  connectedCallback() {
    this.render(footnoteManager.notes);
    
    // Listen for newly registered footnotes and re-render
    footnoteManager.addEventListener('update', (e) => {
      this.render(e.detail);
    });
  }

  render(notes) {
    if (notes.length === 0) {
      this.innerHTML = '';
      return;
    }

    this.innerHTML = `
      <section class="footnotes-section">
        <ol>
          ${notes.map(note => `
            <li id="fn-${note.index}">
              ${note.text} 
              <a href="#fn-ref-${note.index}" aria-label="Back to content">↩</a>
            </li>
          `).join('')}
        </ol>
      </section>
    `;
  }
}

// Register the Web Components
customElements.define('custom-footnote', CustomFootnote);
customElements.define('custom-footnotes', CustomFootnotes);
