import Player from "./components/Player/Player";
import Input from "./components/Input/Input";
import { useState } from "react";
import LinkContextProvider from "./components/context/link-context";
function App() {
  const [page, setPage] = useState("input");
  return (
    <div className="App">
      <LinkContextProvider>
        {page === "input" && <Input setPage={setPage} />}
        {page === "player" && <Player setPage={setPage} />}
      </LinkContextProvider>
    </div>
  );
}

export default App;
