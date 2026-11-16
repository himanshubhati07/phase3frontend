/** Puts an inert block of the uploaded page (a <template> or a data <script>) into the page, exactly as the page had it. */
export function mountInert(anchor: Node | null | undefined, html: string): void {
  const holder = document.createElement('template');
  holder.innerHTML = html;
  if (anchor && anchor.parentNode) anchor.parentNode.replaceChild(holder.content, anchor);
  else document.body.appendChild(holder.content);
}
