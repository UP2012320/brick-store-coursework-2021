import {createElement, createElementWithStyles} from 'Scripts/uiUtils';
import contentRootStyles from 'Styles/contentRoot.module.scss';
import notFoundStyles from 'Styles/notFound.module.scss';

const createNotFound = () => {
  const container = createElement('section', {
    id: contentRootStyles.contentRoot,
  });

  const errorContainer = createElementWithStyles('div', undefined, notFoundStyles.errorContainer);

  const textContainer = createElementWithStyles('div', undefined, notFoundStyles.textContainer);

  const heading = createElement('header', {
    textContent: '404 Not Found',
  });

  const message = createElement('summary', {
    textContent: 'The page you were looking for was not found',
  });

  const redirectButton = createElement('button');

  const redirectLink = createElement('a', {
    href: '/',
    textContent: 'Let\'s get back on track',
  });

  redirectButton.append(redirectLink);
  textContainer.append(heading);
  textContainer.append(message);
  textContainer.append(redirectButton);

  errorContainer.append(textContainer);

  container.append(errorContainer);

  return container;
};

export default createNotFound;
