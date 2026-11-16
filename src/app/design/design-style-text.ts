/** Puts each style attribute of the uploaded page back as the page wrote it (its CSS or scripts match on that text). Runs once, after the first render. */
export function restoreStyleText(): void {
  document.querySelectorAll<HTMLElement>('[data-design-style]').forEach((element) => {
    const text = element.getAttribute('data-design-style');
    if (text !== null && element.getAttribute('style') !== text) element.setAttribute('style', text);
  });
}
