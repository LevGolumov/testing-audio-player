import { useContext, useRef, useState } from "react";
import { LinkContext } from "../context/link-context";
import warning from "../../img/warning.svg"

function Input(props) {
  const linkCtx = useContext(LinkContext);
  const inputRef = useRef();
  const [input, setInput] = useState("")
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

  function WarningSVG(props){
    return <svg className={props.className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#C6A827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8V12" stroke="#C6A827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="16" r="0.5" fill="black" stroke="#C6A827"/>
    </svg>
    
  }

  function onBlurHandler(){
    if (input === ""){

      setError({ isError: true, errorMessage: "Please, insert a link" })
    }
  }

  function onFocusHandler(){
    setError({ isError: false, errorMessage: "" })
}

function onInputChangeHandler(event){
  console.log(event.target.value)
  setInput(event.target.value)
}

  return (
    <div className="input">
      <h1>Insert the link</h1>
      <form className="input__form" onSubmit={submitHandler}>
        <input
          ref={inputRef}
          className={`input__field ${error.isError && "input__field--error"}`}
          placeholder="https://"
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          onChange={onInputChangeHandler}
          value={input}
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
        {error.isError && <WarningSVG className="input__warning" />}
      </form>
      {error.isError && (
        <p className="input__substring">{error.errorMessage}</p>
      )}
      {isChecking && <p className="input__substring">Checking...</p>}
    </div>
  );
}

export default Input;
