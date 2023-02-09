import React, { useState } from "react";

// Setting up the context for the future convenience , if we want to add router or something fancy

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
