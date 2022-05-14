import {auth0} from 'Scripts/auth0';
import {nameof} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles, historyPush} from 'Scripts/uiUtils';
import {type HasBodyProps, type ReUsableComponentProps} from 'Types/types';
import protectedPageStyles from './protectedPage.module.scss';

export interface ProtectedPageProps extends ReUsableComponentProps, HasBodyProps {
  checkIfAuthorized: () => Promise<string>;
}

export default function createProtectedPage (props: ProtectedPageProps) {
  props.key ??= nameof(createProtectedPage);

  const [responseStatus, setResponseStatus] = useState(props.key, '');

  const checkIfAuthorized = async () => {
    setResponseStatus(await props.checkIfAuthorized());
  };

  useEffect(props.key, () => {
    checkIfAuthorized();
  }, []);

  const container = createElementWithStyles('div', undefined, protectedPageStyles.messageContainer);
  const statusContainer = createElementWithStyles('div', undefined, protectedPageStyles.statusContainer);

  const titleRow = createElementWithStyles('div', undefined, protectedPageStyles.statusRow);
  const title = createElementWithStyles('h1', undefined, protectedPageStyles.statusTitle);

  if (responseStatus === '') {
    title.textContent = 'Loading...';
    const spinnerRow = createElementWithStyles('div', undefined, protectedPageStyles.statusRow);
    const spinner = createElementWithStyles('i', undefined, protectedPageStyles.biArrowRepeat);

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
    const loginButtonRow = createElementWithStyles('div', undefined, protectedPageStyles.statusRow);
    const loginButton = createElementWithStyles('button', {
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
    const redirectButtonRow = createElementWithStyles('div', undefined, protectedPageStyles.statusRow);
    const redirectButton = createElementWithStyles('button', {
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

    const messageRow = createElementWithStyles('div', undefined, protectedPageStyles.statusRow);
    const message = createElementWithStyles('p', {
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
