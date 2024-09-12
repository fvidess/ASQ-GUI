import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApi } from '../api';

/*==========================================================
 * Logout component:
 *   Clears current API token
 */

export default function Logout() {
  const [done, setDone] = useState(false);
  const api = useApi();

  // Must do the logout as an effect, because we cannot change other
  // components' state while rendering
  useEffect(() => {
    api.setToken(null);
    setDone(true);
  }, [api]);

  return done ? <Navigate to={"/home"} /> : <h1>Logging out</h1>;
}
