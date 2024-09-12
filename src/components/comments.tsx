import React, { useState, useEffect } from "react";
import axios from "axios";
import { useApi } from "../api";
import "./comment.css";

type CommentProps = {
  questionid?: string;
  username: string;
  picture: string;
};

function Comments({ questionid, username, picture }: CommentProps) {
  const [answers, setAnswers] = useState<any[]>([]);
  const [contents, setContents] = useState("");
  const api = useApi();

  useEffect(() => {
    fetchAnswer();
  }, [api, questionid]);

  async function fetchAnswer() {
    const response = await axios.get(
      `https://taz.harding.edu/api/questions/${questionid}/answers?start=1`,
      {
        headers: {
          Authorization: `Bearer ${api.token}`,
        },
      }
    );

    const { answers } = response.data;
    setAnswers(answers);
    console.log(answers);
  }

  function createAns() {
    axios
      .post(
        `https://taz.harding.edu/api/questions/${questionid}/answers`,
        {
          author: username,
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
        console.log(response.data.json);
        fetchAnswer();
      })
      .catch((error) => {
        console.log(error);
      });
    setContents("");
  }

  async function likeAnswer(id: string, user: string) {
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
      fetchAnswer();
    } catch (e) {
      console.log(e);
    }
  }

  async function unlikeAnswer(id: string, user: string) {
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
      fetchAnswer();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      {answers.map((answer) => {
        return (
          <div className="card2">
            <div className="comments">
              <div className="comment-react">
                {!answer.likedByUser ? (
                  <button
                    onClick={() => {
                      likeAnswer(answer.id, username);
                    }}
                  >
                    <img
                      className="heartImg"
                      alt="like icon"
                      src="data:image/png;base64,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"
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      unlikeAnswer(answer.id, username);
                    }}
                  >
                    <img
                      className="heartImg"
                      alt="unlike icon"
                      src="data:image/png;base64,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"
                    />
                  </button>
                )}
                <hr />
                <span>{answer.likeCount}</span>
              </div>
              <div className="comment-container">
                <div className="user">
                  <div className="user-pic">
                    <a href={picture}>
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        height="20"
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinejoin="round"
                          fill="#707277"
                          strokeLinecap="round"
                          strokeWidth="2"
                          stroke="#707277"
                          d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z"
                        ></path>
                        <path
                          strokeWidth="2"
                          fill="#707277"
                          stroke="#707277"
                          d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z"
                        ></path>
                      </svg>
                    </a>
                  </div>
                  <div className="user-info">
                    <span>{answer.author}</span>
                  </div>
                </div>
                <p className="comment-content">{answer.contents}</p>
              </div>
            </div>
          </div>
        );
      })}
      {/* REPLY BOX */}
      <div className="text-box">
        <div className="box-container">
          <textarea
            required
            placeholder="Reply"
            value={contents}
            onChange={(e) => setContents(e.target.value)}
          ></textarea>
          <div>
            <div className="formatting">
              <button
                type="submit"
                className="send"
                title="Send"
                onClick={createAns}
              >
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  height="18"
                  width="18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    stroke="#ffffff"
                    d="M12 5L12 20"
                  ></path>
                  <path
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    stroke="#ffffff"
                    d="M7 9L11.2929 4.70711C11.6262 4.37377 11.7929 4.20711 12 4.20711C12.2071 4.20711 12.3738 4.37377 12.7071 4.70711L17 9"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Comments;
