import { createContext, useContext, useState } from 'react';

/*==========================================================
 * Context for providing API object
 */
export const ApiContext = createContext<Api>(undefined as any);

/*==========================================================
 * Hook to use a provided API object
 */
export function useApi() {
  return useContext(ApiContext);
}

/*==========================================================
 * Hook to create a new API object (stored as state)
 */
export function useNewApi() {
  let [api, setApi] = useState<Api>(() => new Api(sessionStorage.getItem('asq-token')));

  // Override the setToken method to create a new API object
  api.setToken = function setToken(token: string|null) {
    if (token !== api.token) {
      if (token) {
        sessionStorage.setItem('asq-token', token);
      }
      else {
        sessionStorage.removeItem('asq-token');
      }
      setApi(new Api(token));
    }
  }

  return api;
}

/*==========================================================
 * Actual API class
 */
export class Api {

  // The access token, or null if not logged in
  token: string|null;

  // Notify API owner to use new token (will be overridden)
  setToken(token: string|null) { };

  // Property to test if logged in
  get loggedIn() {
    return this.token !== null;
  }

  // Constructor
  constructor(token: string|null) {
    this.token = token;
  }

  // API METHODS:

  async exampleMethod() {
    let response = await fetch('http://localhost:8000/api/endpoint', {
      mode: 'cors',
      headers: {
        'Authorization': 'Bearer ' + this.token,
      },
    });

    if (response.ok) {
      return response.json();
    }
    else if (response.status === 401) {
      this.setToken(null);
    }
    else {
      throw response.json();
    }
  }
}

