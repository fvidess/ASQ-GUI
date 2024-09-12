import { ReactElement, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useApi } from "../api";

export interface RequireLoginProps {
  children: ReactNode;
}

/*==========================================================
 * RequireLogin component:
 *   Only shows children if we have a log-in for the API
 */

export default function RequireLogin({ children }: RequireLoginProps): ReactElement {
  const api = useApi();

  if (api.loggedIn) {
    return <>{children}</>
  }
  else {
    return <Login />
  }
}

/*==========================================================
 * Login component:
 *   Shows log-in page with link to Google
 */

// helper function
function addParams(params: URLSearchParams, values: { [key: string]: string }) {
  for (const key in values) {
    params.set(key, values[key]);
  }
}

export function Login() {
  let location = useLocation();
  let params = new URLSearchParams(location.search.substring(1));
  let error = params.get('error');

  const href = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  addParams(href.searchParams, {
    client_id: '923167133428-nfsjgjq82p4gqqoca5htfqgslmbi6uv9.apps.googleusercontent.com',
    redirect_uri: 'http://localhost:3000/asq/auth',
    response_type: 'id_token',
    scope: 'openid email profile',
    state: location.pathname,
    nonce: crypto.randomUUID(),
  });

  return (
    <>
      <h1>Log-in Required</h1>
      { error && <p>{error}</p> }
      <p>
        <a href={href.toString()}>Click here</a> to log in with Google.
      </p>
    </>
  )
}
