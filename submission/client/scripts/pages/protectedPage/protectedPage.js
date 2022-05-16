import {auth0} from 'Scripts/auth0';
import {nameof} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElement, historyPush} from 'Scripts/uiUtils';
import protectedPageStyles from './protectedPage.module.scss';

export default function createProtectedPage(props) {
  props.key ??= nameof(createProtectedPage);
  const [responseStatus, setResponseStatus] = useState(props.key, '');
  const checkIfAuthorized = async () => {
    setResponseStatus(await props.checkIfAuthorized());
  };
  useEffect(props.key, () => {
    checkIfAuthorized();
  }, []);
  const container = createElement('div', undefined, protectedPageStyles.messageContainer);
  const statusContainer = createElement('div', undefined, protectedPageStyles.statusContainer);
  const titleRow = createElement('div', undefined, protectedPageStyles.statusRow);
  const title = createElement('h1', undefined, protectedPageStyles.statusTitle);
  if (responseStatus === '') {
    title.textContent = 'Loading...';
    const spinnerRow = createElement('div', undefined, protectedPageStyles.statusRow);
    const spinner = createElement('i', undefined, protectedPageStyles.biArrowRepeat);
    return htmlx`
    <${container}>
      <${statusContainer}>
        <${titleRow}>
          <${title}/>
        </titleRow>
        <${spinnerRow}>
          <${spinner}/>
        </spinnerRow>
      </statusContainer>
    </container>
    `;
  } else if (responseStatus === '401') {
    title.textContent = 'You need to login to view this page';
    const loginButtonRow = createElement('div', undefined, protectedPageStyles.statusRow);
    const loginButton = createElement('button', {
      onclick: async () => {
        try {
          await auth0.loginWithPopup();
        } catch (error) {
          console.error(error);
          return;
        }
        await checkIfAuthorized();
      },
      textContent: 'Login',
    }, protectedPageStyles.actionButton);
    return htmlx`
    <${container}>
      <${statusContainer}>
        <${titleRow}>
          <${title}/>
        </titleRow>
        <${loginButtonRow}>
          <${loginButton}/>
        </loginButtonRow>
      </statusContainer>
    </container>
    `;
  } else if (responseStatus === '403') {
    title.textContent = 'You are not authorized to view this page';
    const redirectButtonRow = createElement('div', undefined, protectedPageStyles.statusRow);
    const redirectButton = createElement('button', {
      onclick: () => {
        historyPush(undefined, '/');
      },
      textContent: 'Home',
    }, protectedPageStyles.actionButton);
    return htmlx`
    <${container}>
      <${statusContainer}>
        <${titleRow}>
          <${title}/>
        </titleRow>
        <${redirectButtonRow}>
          <${redirectButton}/>
        </loginButtonRow>
      </statusContainer>
    </container>
    `;
  } else if (responseStatus === '200') {
    container.classList.remove(protectedPageStyles.messageContainer);
    container.classList.add(protectedPageStyles.contentContainer);
    return htmlx`
      <${props.body}/>
    `;
  } else {
    title.textContent = 'An error occurred, please refresh and try again';
    const messageRow = createElement('div', undefined, protectedPageStyles.statusRow);
    const message = createElement('p', {
      textContent: 'Error code: ' + responseStatus,
    }, protectedPageStyles.statusMessage);
    return htmlx`
    <${container}>
      <${statusContainer}>
        <${titleRow}>
          <${title}/>
        </titleRow>
        <${messageRow}>
          <${message}/>
        </messageRow>
      </statusContainer>
    </container>
    `;
  }
}
