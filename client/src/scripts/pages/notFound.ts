import html from 'Scripts/htmlTemplate';
import {createElement, createElementWithStyles, preventHrefDefault, registerLinkClickHandler} from 'Scripts/uiUtils';
import contentRootStyles from 'Styles/components/contentRoot.module.scss';
import notFoundStyles from 'Styles/pages/notFound.module.scss';

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

  preventHrefDefault(redirectLink);
  registerLinkClickHandler(redirectButton, '/');

  return html`
    <${container}>
      <${errorContainer}>
        <${textContainer}>
          <${heading}/>
          <${message}/>
          <${redirectButton}>
            <${redirectLink}/>
          </redirectButton>
        </textContainer>
      </errorContainer>
    </container>
  `;
};

export default createNotFound;
