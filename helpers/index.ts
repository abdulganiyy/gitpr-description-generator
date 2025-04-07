export const parseMarkdown = (markdown: string) => {
    return markdown
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      .replace(/`([^`]+)`/gim, "<code>$1</code>")
      .replace(/^\s*[-*] (.*$)/gim, "<li>$1</li>")
      .replace(/\n{2,}/g, "</p><p>") // Paragraphs
      .replace(/^(?!<h|<ul|<li|<p)(.*)$/gim, "<p>$1</p>") // Wrap unwrapped lines in <p>
      .replace(/<\/li>\s*<li>/gim, "</li><li>") // List items cleanup
      .replace(/(<li>.*<\/li>)/gim, "<ul>$1</ul>"); // Wrap list items
  };
  