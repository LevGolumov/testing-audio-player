import { useContext, useState } from "react";
import { LinkContext } from "../context/link-context";

function Input(props) {
  const linkCtx = useContext(LinkContext);
  const [input, setInput] = useState("");
  const [isHttps, setIsHttps] = useState(true);
  const [error, setError] = useState({ isError: false, errorMessage: "" });
  const [isChecking, setIsChecking] = useState(false);

  // Making setting errors easier
  function errorMessages(trigger) {
    switch (trigger){
      case "none":
        setError({
              isError: false,
              errorMessage: "",
            });
        break
      case "http":
        setError({
              isError: true,
              errorMessage: "Please, insert an https:// link",
            });
        break
      case "empty":
        setError({
              isError: true,
              errorMessage: "Link must not be empty",
            });
        break
      case "no-audio":
        setError({
              isError: true,
              errorMessage: "The link doesn't contain audio",
            });
        break
      default:
        break
    }
  }

  // Saving input to the state and managing errors
  function onInputChangeHandler(event) {
    const input = event.target.value;
    setInput(input);

    // Checking if the string contains errors
    if (input.includes("http:")) {
      setIsHttps(false);
      errorMessages("http");
    } else {
      // If there are no errors,
      // resetting previously setted states if needed
      if (!isHttps) {
        setIsHttps(true);
      }

      if (error.isError) {
        errorMessages("none");
      }
    }
  }
  
  // Checking if the link contains playable media
  // async because of the audio.play() promise
  async function checkLink(inputLink) {
    // Showing user that we are working on their's link
    setIsChecking(true);
    // Resetting error messeges just in case we didn't do that already
    if (error.isError) {
      errorMessages("none");
    }

    // Checking link before sending a request
    if (inputLink.includes("http://")) {
      errorMessages("http");
      setIsChecking(false);
      return;
    } else if (inputLink === "") {
      errorMessages("empty");
      setIsChecking(false);
      return;
    }

    let newLink = inputLink
    // Adding "https://" if there is none
    if (!newLink.startsWith("https://")){
      newLink = "https://" + newLink
    }
    const audio = new Audio(newLink);

    // trying to play audio to check if the link is valid
    try {
      await audio.play();
      // pausing, or else the music will play
      audio.pause();
      setIsChecking(false);
      // saving link to the context
      linkCtx.setLink(newLink);
      // redirecting to the player page
      props.setPage("player");
    } catch (err) {
      setIsChecking(false);
      errorMessages("no-audio");
    }
  }

  // handling the form submission
  function submitHandler(event) {
    event.preventDefault();
    checkLink(input);
  }

  // adding errors on click outside the input
  function onBlurHandler() {
    if (input === "") {
      errorMessages("empty");
    } else if (!isHttps) {
      errorMessages("http");
    }
  }

  // clearing errors on input click
  // so that user won't see errors all the time
  function onFocusHandler() {
    errorMessages("none");
  }

  // making the Input return cleaner, outsoursing the svgs' in their own components
  function WarningSVG(props) {
    return (
      <svg
        className={props.className}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          stroke="#C6A827"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 8V12"
          stroke="#C6A827"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="16" r="0.5" fill="black" stroke="#C6A827" />
      </svg>
    );
  }

  function ArrowSVG(props) {
    return <svg
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
  }

  return (
    <div className="input">
      <h1>Insert the link</h1>
      <form className="input__form" onSubmit={submitHandler}>
        <input
          className={`input__field ${
            (error.isError || !isHttps) && "input__field--error"
          }`}
          placeholder="https://"
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          onChange={onInputChangeHandler}
          value={input}
        ></input>
        <button className="input__btn">
          <ArrowSVG />
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
