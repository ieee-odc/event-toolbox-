import { useState } from "react";
import "./App.css";
import Events from "./modules/Events/pages/EventsPage";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
  return (
    <div className="App">
      {/* for private routes use Private Route like this
   <Route path= "/participants" element ={<PrivateRoute allowedRoles={['organizer']}>
<Participants />
</PrivateRoute>}  />  */}
      <Routes>
        {/* <Route path= "/login" element ={<Login/>}  />
  <Route path= "/signup" element ={<Signup/>}  />
  <Route path= "/" element ={<Homepage/>}  /> */}
        <Route path="/events" element={<Events />} />
      </Routes>
    </div>
  );
}

export default App;
