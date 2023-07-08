// Abbreviate namespace, using icons in place of abbreviations if possible
// Eample: "root/foo/bar" -> "r/f/bar" or "🌍/✈️/Plans"
const pageIcons = new Map()

function getAbbreviation(text) {
  return text.split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
}

function abbreviate(text) {
  const chars = Array.from(text)
  let abbreviatedLink = ''
  chars.forEach( (char, i) => {
    if (char === '/') {
      // Selects all characters of original link up to the current '/'. This is to pass to the logseq api to find the page icon
      const pageName = chars.slice(0,i).join('')

      // Checks if the icon for the page already exists in the map, and adds it if it exists
      if (!pageIcons.has(pageName)) {
        const pageIcon = logseq.api.get_page(pageName)?.properties?.icon
        if (pageIcon) {
          pageIcons.set(pageName, pageIcon)
        }
      }

      // Add page icon from the map, or the abbreviation of the page/subpage
      abbreviatedLink += `${pageIcons.get(pageName) || getAbbreviation(pageName.split('/').at(-1))}/`
    }
  })

  abbreviatedLink += text.split('/').at(-1)
}

function abbreviateNamespace(selector) {
  const appContainer = document.getElementById("app-container");

  const handleNamespaceHover = (event) => {
    const namespaceRef = event.target.closest(selector);
    if (!namespaceRef) return;

    if (event.type === "mouseenter") {
      namespaceRef.textContent = namespaceRef.dataset.origText;
    } else if (event.type === "mouseleave") {
      namespaceRef.textContent = namespaceRef.dataset.abbreviatedText;
    }
  };

  appContainer.addEventListener("mouseenter", handleNamespaceHover, true);
  appContainer.addEventListener("mouseleave", handleNamespaceHover, true);

  const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      for (const node of mutation.addedNodes) {
        if (!node.querySelectorAll) continue;

        const namespaceRefs = node.querySelectorAll(selector);
        for (const namespaceRef of namespaceRefs) {
          const text = namespaceRef.textContent;
          const isTag = namespaceRef.classList.contains("tag");
          const testText = isTag
            ? text.substring(1).toLowerCase()
            : text.toLowerCase();
          if (testText !== namespaceRef.dataset.ref) continue;

          const abbreviatedText = abbreviate(text);

          namespaceRef.dataset.origText = text;
          namespaceRef.dataset.abbreviatedText = abbreviatedText;
          namespaceRef.textContent = abbreviatedText;
        }
      }
    }
  });

  observer.observe(appContainer, {
    subtree: true,
    childList: true,
  });
}

abbreviateNamespace(
  '.ls-block a.page-ref[data-ref*="/"], .foldable-title [data-ref*="/"], li[title*="root/"] .page-title, a.tag[data-ref*="/"], .title[data-ref*="/"]'
);
