import 'destyle.css';
import '../css/style.css';

const parser = new DOMParser();
const parseHTML = html => {
  return parser.parseFromString(html, 'text/html');
};
const getHTML = async url => {
  return fetch(url).then(res => res.text());
};
const swap = (from, to) => {
  return document.startViewTransition(() => {
    from.replaceWith(to);
  }).updateCallbackDone;
};

const shouldNotIntercept = navigationEvent => {
  // 参考: https://developer.chrome.com/docs/web-platform/navigation-api/#deciding-how-to-handle-a-navigation
  return (
    !navigationEvent.canIntercept ||
    navigationEvent.hashChange ||
    navigationEvent.downloadRequest ||
    navigationEvent.formData
  );
};
navigation.addEventListener('navigate', e => {
  if (shouldNotIntercept(e)) return;

  const loadNextPage = async () => {
    const htmlString = await getHTML(e.destination.url);
    const parsedHTML = parseHTML(htmlString);
    const toHTML = parsedHTML.querySelector('*[data-transition-wrapper]');
    const fromHTML = document.querySelector('*[data-transition-wrapper]');
    await swap(fromHTML, toHTML);
    document.title = to.title;
  };
  e.intercept({ handler: loadNextPage });
});
navigation.addEventListener('navigatesuccess', e => {
  console.log(e);
});
navigation.addEventListener('navigateerror', e => {
  console.error(e);
});
