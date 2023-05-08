// abbreviate name space
// ex: "root/foo/bar" -> "r/f/bar"
function abbreviate(text, isTag) {
  return text.split('/').map((part, index, arr) => {
    if (index === arr.length - 1) {
      return part;
    } else if (index === 0 && isTag) {
      return part.substring(0, 2);
    } else {
      return part.charAt(0);
    }
  }).join('/');
}

function abbreviateNamespace(selector) {
  const appContainer = document.getElementById("app-container");
  
  const handleNamespaceHover = (event) => {
    const namespaceRef = event.target.closest(selector);
    if (!namespaceRef) return;

    if (event.type === 'mouseenter') {
      namespaceRef.textContent = namespaceRef.dataset.origText;
    } else if (event.type === 'mouseleave') {
      namespaceRef.textContent = namespaceRef.dataset.abbreviatedText;
    }
  };

  appContainer.addEventListener('mouseenter', handleNamespaceHover, true);
  appContainer.addEventListener('mouseleave', handleNamespaceHover, true);

  const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      for (const node of mutation.addedNodes) {
        if (!node.querySelectorAll) continue;

        const namespaceRefs = node.querySelectorAll(selector);
        for (const namespaceRef of namespaceRefs) {
          const text = namespaceRef.textContent;
          const isTag = namespaceRef.classList.contains("tag");
          const testText = isTag ? text.substring(1).toLowerCase() : text.toLowerCase();
          if (testText !== namespaceRef.dataset.ref) continue;

          const abbreviatedText = abbreviate(text, isTag);

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

abbreviateNamespace('.ls-block a.page-ref[data-ref*="/"], .foldable-title [data-ref*="/"], li[title*="root/"] .page-title, a.tag[data-ref*="/"]');
