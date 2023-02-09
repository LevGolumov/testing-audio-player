import React, { useState } from "react";

export const LinkContext = React.createContext({
  link: "",
  setLink: () => {}
});

function LinkContextProvider(props) {
  const [link, setLink] = useState("");


  const contextValue = {
    link,
    setLink
  };

  return (
    <LinkContext.Provider value={contextValue}>
      {" "}
      {props.children}{" "}
    </LinkContext.Provider>
  );
}

export default LinkContextProvider;
