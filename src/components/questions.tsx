import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useApi } from "../api";
import "./card.css";
import "./questions.css";

function Questions() {
  const api = useApi();
  const [questions, setQuestions] = useState([]);
  const [contents, setContents] = useState("");
  const [summary, setSummary] = useState("");
  const [newQ, setNewQ] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    name: "",
    given_name: "",
    family_name: "",
    picture: "",
    exp: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    const response = await axios.get(
      "https://taz.harding.edu/api/questions?start=1",
      {
        headers: {
          Authorization: `Bearer ${api.token}`,
        },
      }
    );

    const { questions } = response.data;
    setQuestions(questions);
    console.log(questions);
  }

  function createPost() {
    setNewQ(false);
    axios
      .post(
        "https://taz.harding.edu/api/questions",
        {
          author: user.username,
          summary: summary,
          contents: contents,
        },
        {
          headers: {
            Authorization: `Bearer ${api.token}`,
            "content-type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        fetchQuestions();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await axios.get("https://taz.harding.edu/api/user", {
        headers: {
          Authorization: `Bearer ${api.token}`,
        },
      });

      const user = response.data;
      setUser(user);
      console.log(user);
    };

    fetchUserData();
  }, [api]);

  async function likeQuestion(id: string, user: string) {
    try {
      const response = await axios.post(
        `https://taz.harding.edu/api/likes/${id}/${user}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${api.token}`,
            "content-type": "application/json",
          },
        }
      );
      console.log(response.data);
      fetchQuestions();
    } catch (e) {
      console.log(e);
    }
  }
  
  async function unlikeQuestion (id: string, user: string) {
    try {
      const response = await axios.delete(
        `https://taz.harding.edu/api/likes/${id}/${user}`,
        {
          headers: {
            Authorization: `Bearer ${api.token}`,
            "content-type": "application/json",
          },
        }
      );

      console.log(response.data);
      fetchQuestions();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      {(
        <>
          {/* PAGE TITLE */}
          <h1 id="title">Questions</h1>
          <section className="cards-container">
            {/* LOOP OVER ALL QUESTIONS AND PRINT INFO */}
            {questions.map((question: any) => (
              // CARD FORMAT
              <div className="card">
                <div className="body">
                  {/* SUMMARY */}
                  <p className="text">{question.summary}</p>
                  
                  {/* AUTHOR */}
                  <span className="username">Posted by {question.author}</span>
                  
                  {/* LIKE BUTTON */}
                  <div className="footer">
                    <div>
                      <div>
                        {!question.likedByUser ? (
                          <button
                            onClick={() => {
                              likeQuestion(question.id, user.username);
                            }}
                          >
                            <img
                              alt="like icon"
                              src="data:image/png;base64,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"
                            />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              unlikeQuestion(question.id, user.username);
                            }}
                          >
                            <img
                              alt="unlike icon"
                              src="data:image/png;base64,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"
                            />
                          </button>
                        )}
                        {question.likeCount}
                      </div>
                    </div>
                    {/* LINK TO SEE REPLIES TO A Q */}
                    <div className="viewer">
                      <a
                        href=""
                        onClick={() => {
                          navigate(`/questions/${question.id}`);
                        }}
                      >
                        View replies
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
          {/* BUTTON TO ADD A NEW Q */}
          <button
            className="cssbuttons-io-button"
            onClick={() => setNewQ(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path
                fill="currentColor"
                d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"
              ></path>
            </svg>
            <span>Add</span>
          </button>
        </>
      )}
      {/* FORM TO SUBMIT NEW Q */}
      {newQ && (
        <>
            <form id = "newQuestionForm" className = "card" onSubmit={createPost}>
                <div className= "body">
                <div id = "postInputs">
                  {/* SUMMARY TEXT BOX */}
                  <p className="input-container">
                      <input type="text"  autoFocus minLength= {10} maxLength = {100} onChange={(e) => setSummary(e.target.value)} placeholder="Summary (optional)" name="text" id="text" className="input-field" autoComplete="name"/>
                      <label className="input-label" htmlFor="text">Summary</label>
                  </p>
                  {/* CONTENT TEXT BOX */}
                  <p className="input-container">
                      <input type="text"  required minLength= {1} maxLength = {1000}  onChange={(e) => setContents(e.target.value)} placeholder="Contents" name="text" id="text" className="input-field" autoComplete="name"/>
                      <label className="input-label" htmlFor="text">Contents</label>
                  </p>
                </div>
                
                {/* POST BUTTON */}
                <section className = "buttons">
                  <button onClick={() => setNewQ(true)} autoFocus id="postBtn">
                    <div className="svg-wrapper-1">
                      <div className="svg-wrapper">
                        <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0 0h24v24H0z" fill="none"></path>
                          <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z" fill="currentColor"></path>
                        </svg>
                      </div>
                    </div>
                    <span>Post</span>
                  </button>
                  {/* CANCEL BUTTON */}
                  <button onClick={() => setNewQ(false)} id = "cancelBtn">
                    Cancel
                  </button>
                </section>
                </div>
            </form>
        </>
      )}
    </div>
  );
}

export default Questions;
