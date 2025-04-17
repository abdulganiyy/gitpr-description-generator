export const parseMarkdown = (markdown: string) => {
  return markdown
    // Headers
    .replace(/^### (.*)$/gim, "<h3>$1</h3>")
    .replace(/^## (.*)$/gim, "<h2>$1</h2>")
    .replace(/^# (.*)$/gim, "<h1>$1</h1>")

    // Bold / Italic / Inline code
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/`([^`]+)`/gim, "<code>$1</code>")

    // List items
    .replace(/^\s*[-*] (.*)$/gim, "<li>$1</li>")

    // Wrap <li> groups in <ul> (not single items)
    .replace(/(<li>.*<\/li>)/gim, match => {
      return `<ul>${match}</ul>`;
    })

    // Paragraphs (double line breaks)
    .replace(/\n{2,}/g, "</p><p>")

    // Wrap lines not already wrapped in a block tag
    .replace(/^(?!<(h[1-3]|ul|li|p|\/))(.*)$/gim, "<p>$2</p>")

    // Clean up multiple <ul> wrappers around single <li>s
    .replace(/<\/ul>\s*<ul>/g, "")
    .trim()
    .replace(/^/, "<p>")
    .replace(/$/, "</p>");
};

  