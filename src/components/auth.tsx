import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApi } from '../api';

/*==========================================================
 * Authenticate component:
 *   Processes response from Google
 */

export default function Authenticate() {
  const [next, setNext] = useState<string|null>(null);
  const [error, setError] = useState<string|null>(null);
  const location = useLocation();
  const api = useApi();

  // Must do processing as an effect, because we cannot change other
  // components' state while rendering
  useEffect(() => {
    const params = new URLSearchParams(location.hash.substring(1));
    const token = params.get('id_token');
    if (token) {
      api.setToken(token);
    }
    else {
      setError(encodeURIComponent(params.get('error') || 'unknown'));
    }

    let state = params.get('state');
    if (typeof state === 'string' && state.match(/^(\/[-.\w]+)+$/)) {
      setNext(state);
    }
    else {
      setNext('/home');
    }
  }, [location, api]);

  // Once processing is done, send them to the correct location
  if (next !== null) {
    if (error === null) {
      return <Navigate to={next} replace={true} />
    }
    else {
      return <Navigate to={next + '?error=' + error} replace={true} />
    }
  }
  else {
    return <h4>Loading...</h4>;
  }
}
