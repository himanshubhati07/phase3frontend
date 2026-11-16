// Puts the uploaded page's inline event handlers back (onclick="doLogin()"). The converted markup carries each one as a data-design-on<event>
// attribute (see html_handlers.py); the browser runs the real attribute exactly as it ran in the page. This file is generated: copy it unchanged.
(function () {
  if (window.__designHandlers) return;
  window.__designHandlers = true;
  var EVENTS = ["change", "click"];
  var PREFIX = 'data-design-on';
  var SELECTOR = EVENTS.map(function (type) { return '[' + PREFIX + type + ']'; }).join(',');
  function restore(element) {
    for (var i = 0; i < EVENTS.length; i++) {
      var code = element.getAttribute(PREFIX + EVENTS[i]);
      if (code !== null && element.getAttribute('on' + EVENTS[i]) !== code) element.setAttribute('on' + EVENTS[i], code);
    }
  }
  function scan(root) {
    if (root.nodeType !== 1) return;
    restore(root);
    var found = root.querySelectorAll(SELECTOR);
    for (var i = 0; i < found.length; i++) restore(found[i]);
  }
  scan(document.documentElement);
  new MutationObserver(function (records) {
    for (var i = 0; i < records.length; i++) {
      var record = records[i];
      if (record.type === 'attributes') restore(record.target);
      else for (var j = 0; j < record.addedNodes.length; j++) scan(record.addedNodes[j]);
    }
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: EVENTS.map(function (type) { return PREFIX + type; }),
  });
})();
