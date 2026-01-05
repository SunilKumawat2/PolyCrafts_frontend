import React from "react";
import { Link } from "react-router-dom";
import Book_Call from "../../common/book_call_popup/Book_Call";
import { useLoginModal } from "../../../context/LoginModalContext";

const Ready_To_Start = () => {
  const { setLoginShow } = useLoginModal();

  return (
    <>
      <section className="ready-start-section">
        <div className="container-fluid">
          <div className="ready-start-bg">
            <h2 className="gradient-text">Ready to Start Creating?</h2>
            <p>
              Sign up for a free account or explore our membership plans to
              unlock the full polycraftsstudio experience.
            </p>
            <Link
              to="#"
              className="btn btn-primary"
              onClick={() => setLoginShow(true)}
            >
              Let's Start
            </Link>
          </div>
        </div>
      </section>

      {/* <section className="book-call-btn">
        <div className="container-fluid">
          <div className="col-book-btn">
            <button className="btn btn-primary">Book A Call</button>
          </div>
        </div>
      </section> */}
    </>
  );
};

export default Ready_To_Start;
