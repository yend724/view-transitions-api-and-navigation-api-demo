import 'destyle.css';
import '../css/style.css';

const swap = async (from, to) => {
  return document.startViewTransition(() => {
    from.hidden = true;
    to.hidden = false;
  }).updateCallbackDone;
};

const findAnchorElement = element => {
  if (element.tagName === 'A') {
    return element;
  }
  return null;
};
const findParentAnchorElement = element => {
  return element.closest('a');
};

const bookIndexPage = document.querySelector(
  '*[data-transition-wrapper="book-index"]'
);
const bookDetailPage = document.querySelector(
  '*[data-transition-wrapper="book-detail"]'
);
const pageList = [bookIndexPage, bookDetailPage];

const documentBody = document.body;
documentBody.addEventListener('click', async e => {
  const target = e.target;
  const anchorElement =
    findAnchorElement(target) || findParentAnchorElement(target);
  if (anchorElement) {
    e.preventDefault();
    const url = new URL(anchorElement.href);
    const params = url.searchParams;
    const nextPage = params.get('page') ?? 'book-index';
    const nextSwapList =
      nextPage === 'book-detail' ? pageList : [...pageList].reverse();
    await swap(...nextSwapList);
  }
});
