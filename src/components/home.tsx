import { Link } from 'react-router-dom';
import { useApi } from '../api';

/*==========================================================
 * Home component
 */

export default function Home() {
  const api = useApi();

  return (
    <>
      <h1>Home</h1>
      <p>
        Access token: {api.token}
      </p>
      <p>
        <Link to="/logout">Log out</Link>
      </p>
    </>
  )
}
