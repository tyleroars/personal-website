// Keep the reader in browser history without turning the project list into an SPA.
function createProjectNavigation({browser, projects, show, hide, findOpener}) {
  let active = null;
  let pendingClose = false;
  let returnHash = '';
  const hashFor = project => '#' + (project.id === 'huddle' ? 'huddledex' : project.id);
  const projectAt = hash => {
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return null; }
    if (id === 'huddledex') id = 'huddle';
    if (id === 'mcp' || id === 'reddit') id = 'gradsimple';
    return projects.find(project => project.id === id) || null;
  };
  const path = () => browser.location.pathname + browser.location.search;
  const state = reader => ({...(browser.history.state || {}), tylerReader: reader});

  function sync() {
    pendingClose = false;
    const project = projectAt(browser.location.hash);
    if (!project) {
      returnHash = browser.location.hash;
      if (active) {
        const previous = active;
        active = null;
        hide(previous);
      }
      return;
    }
    const entry = browser.history.state?.tylerReader;
    if (entry?.project === project.id) returnHash = entry.returnHash || '';
    else browser.history.replaceState(state({project:project.id, returnHash}), '', path() + hashFor(project));
    if (active?.id === project.id) return;
    active = project;
    show(project, findOpener(project));
  }

  function open(project, button) {
    if (active?.id === project.id) return;
    if (!active) returnHash = projectAt(browser.location.hash) ? '' : browser.location.hash;
    const method = active ? 'replaceState' : 'pushState';
    browser.history[method](state({project:project.id, returnHash}), '', path() + hashFor(project));
    active = project;
    pendingClose = false;
    show(project, button || findOpener(project));
  }

  function close() {
    if (!active || pendingClose) return;
    if (browser.history.state?.tylerReader?.project === active.id) {
      pendingClose = true;
      browser.history.back();
    } else {
      browser.history.replaceState(state(null), '', path() + returnHash);
      sync();
    }
  }

  // A direct story link gets a list entry immediately behind it. Back therefore
  // closes the reader, including when the visitor arrived from the About page.
  const initial = projectAt(browser.location.hash);
  if (initial && browser.history.state?.tylerReader?.project !== initial.id) {
    browser.history.replaceState(state(null), '', path());
    browser.history.pushState(state({project:initial.id, returnHash:''}), '', path() + hashFor(initial));
  }
  browser.addEventListener('popstate', sync);
  browser.addEventListener('hashchange', sync);
  sync();
  return {open, close};
}
