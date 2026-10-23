import common from './common.json';
import home from './home.json';
import works from './works.json';
import projects from './projects.json';

// Home-page namespaces for one language, bundled into a single lazy chunk so a
// language switch (or a non-English first visit) costs one request, not four.
export default { common, home, works, projects };
