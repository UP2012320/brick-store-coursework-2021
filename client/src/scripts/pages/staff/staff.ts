import {auth0, getAuthorizationHeader} from 'Scripts/auth0';
import createSidebar from 'Scripts/components/layout/staff/sidebar';
import {nameof, SERVER_BASE} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles, historyPush} from 'Scripts/uiUtils';
import staffStyles from './staff.module.scss';

const key = nameof(createStaff);

export default function createStaff () {
  const [responseStatus, setResponseStatus] = useState(key, '');

  const checkIfAuthorized = async () => {
    const authorizationHeader = await getAuthorizationHeader();

    if (!authorizationHeader) {
      setResponseStatus('401');
      return;
    }

    let response;

    try {
      response = await fetch(new URL('/api/v1/staff/authorized', SERVER_BASE).href, {
        headers: authorizationHeader,
      });
    } catch (error) {
      console.error(error);
      setResponseStatus('500');
      return;
    }

    setResponseStatus(response.status.toString());
  };

  useEffect(key, () => {
    checkIfAuthorized();
  }, []);

  const container = createElementWithStyles('div', undefined, staffStyles.messageContainer);
  const statusContainer = createElementWithStyles('div', undefined, staffStyles.statusContainer);

  const titleRow = createElementWithStyles('div', undefined, staffStyles.statusRow);
  const title = createElementWithStyles('h1', undefined, staffStyles.statusTitle);

  if (responseStatus === '') {
    title.textContent = 'Loading...';
    const spinnerRow = createElementWithStyles('div', undefined, staffStyles.statusRow);
    const spinner = createElementWithStyles('i', undefined, staffStyles.biArrowRepeat);

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
    const loginButtonRow = createElementWithStyles('div', undefined, staffStyles.statusRow);
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
    }, staffStyles.actionButton);

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
    const redirectButtonRow = createElementWithStyles('div', undefined, staffStyles.statusRow);
    const redirectButton = createElementWithStyles('button', {
      onclick: () => {
        historyPush(undefined, '/');
      },
      textContent: 'Home',
    }, staffStyles.actionButton);

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
    container.classList.remove(staffStyles.messageContainer);
    container.classList.add(staffStyles.contentContainer);

    const sidebar = createSidebar({
      options: [
        {
          href: '/staff/add-product',
          title: 'Add Product',
        },
      ],
      title: 'Management Tools',
    });

    const body = createElementWithStyles('div', undefined, staffStyles.bodyContainer);

    return htmlx`
    <${container}>
      <${sidebar}/>
      <${body}>

      </${body}>
    </container>
    `;
  } else {
    title.textContent = 'An error occurred, please refresh and try again';

    const messageRow = createElementWithStyles('div', undefined, staffStyles.statusRow);
    const message = createElementWithStyles('p', {
      textContent: 'Error code: ' + responseStatus,
    }, staffStyles.statusMessage);

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
