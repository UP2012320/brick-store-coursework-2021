import {getAuthorizationHeader} from 'Scripts/auth0';
import {nameof} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';

const key = nameof(createStaffPage);

export default function createStaffPage () {
  const [responseStatus, setResponseStatus] = useState(key, '');

  const checkIfAuthorized = async () => {
    const authorizationHeader = await getAuthorizationHeader();

    if (!authorizationHeader) {
      setResponseStatus('401');
      return;
    }

    let response;

    try {
      response = await fetch('/api/v1/authorized', {
        headers: authorizationHeader,
      });
    } catch (error) {
      console.error(error);
      setResponseStatus('500');
      return;
    }

    if (!response.ok) {
      setResponseStatus(response.status.toString());
    }
  };

  useEffect(key, () => {
    checkIfAuthorized();
  }, []);

  return htmlx`<p>Inventory Management</p>`;
}
