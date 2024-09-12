import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Authenticate from './auth';
import Home from './home';
import RequireLogin from './login';
import { ApiContext, useNewApi } from '../api';
import Logout from './logout';
import Questions from './questions';
import QuestionInfo from './questionInfo';

/*==========================================================
 * App component
 */

export default function App() {
  // Create API instance to share with application
  const api = useNewApi();

  // Render routes
  return (
    <ApiContext.Provider value={api}>
      <BrowserRouter basename="/asq">
        <Routes>

          {/* Home page */}
          <Route path="/home" element={
            <RequireLogin>
              <Home />
            </RequireLogin>
          } />

          {/* When we come back from Google with token */}
          <Route path="/auth" element={<Authenticate />} />

          {/* Clears the token */}
          <Route path="/logout" element={
              <Logout />
          } />

          <Route path="/*" element={
            <Navigate to="/home" replace={true} />
          } />


          <Route path="/questions/:questionid" element = {
            <QuestionInfo/>
          }/>

          <Route path="/questions" element={
            <Questions/>
          }/>
          
        </Routes>
      </BrowserRouter>
    </ApiContext.Provider>
  )
}
