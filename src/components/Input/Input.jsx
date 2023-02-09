import { useContext, useRef, useState } from "react";
import { LinkContext } from "../context/link-context";

function Input(props) {
  const linkCtx = useContext(LinkContext);
  const inputRef = useRef();
  const [error, setError] = useState({ isError: false, errorMessage: "" });
  const [isChecking, setIsChecking] = useState(false);

  async function checkLink(inputLink) {
    setIsChecking(true);
    if (error.isError) {
      setError({ isError: false, errorMessage: "" });
    }

    if (inputLink.includes("http://")) {
      setError({
        isError: true,
        errorMessage: "Please, insert an https:// link",
      });
      return;
    }

    let newLink;
    if (!inputLink.startsWith("https://")) {
      newLink = "https://" + inputLink;
    } else {
      newLink = inputLink;
    }
    const audio = new Audio(newLink);

    try {
      await audio.play();
      audio.pause();
      setIsChecking(false);
      linkCtx.setLink(newLink)
      props.setPage("player")
    } catch (err) {
      setIsChecking(false);
      setError({
        isError: true,
        errorMessage: "The link doesn't contain audio",
      });
    }
  }

  function submitHandler(event) {
    event.preventDefault();
    const enteredLink = inputRef.current.value;
    checkLink(enteredLink);
  }

  return (
    <div className="input">
      <h1>Insert the link</h1>
      <form className="input__form" onSubmit={submitHandler}>
        <input
          ref={inputRef}
          className="input__field"
          placeholder="https://"
        ></input>
        <button className="input__btn">
          <svg
            width="40"
            height="36"
            viewBox="0 0 40 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M39.7197 18.6943C40.0934 18.3069 40.0934 17.6931 39.7197 17.3057L23.7197 0.721686L23.0253 0.00202179L21.586 1.39067L22.2803 2.11033L36.6457 17H1H0V19H1H36.6457L22.2803 33.8897L21.586 34.6093L23.0253 35.998L23.7197 35.2783L39.7197 18.6943Z"
              fill="#1B191C"
            />
          </svg>
        </button>
      </form>
      {error.isError && (
        <p className="input__substring">{error.errorMessage}</p>
      )}
      {isChecking && <p className="input__substring">Checking...</p>}
    </div>
  );
}

export default Input;
