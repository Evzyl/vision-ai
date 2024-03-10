import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
function App() {
  let [User, setUser] = useState({
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  });

  function LoadUser(data) {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    });
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Home User={User} setUser={setUser} />} />
        <Route path="/auth">
          <Route path=":page" element={<Auth LoadUser={LoadUser} />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
