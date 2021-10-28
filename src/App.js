import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/dashboard/Dashboard";
import VideoCallDashboard from "./components/videoCall/VideoCallDashboard";
import { VideoCallContextProvider } from "./context/VideocallContext";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <VideoCallContextProvider>
      <Router>
        <Switch>
          <Route path="/" exact component={Login}></Route>
          <ProtectedRoute
            path="/dashboard"
            exact
            component={Dashboard}
          ></ProtectedRoute>
          <ProtectedRoute
            path="/videocall"
            exact
            component={VideoCallDashboard}
          ></ProtectedRoute>
          <Route path="*" component={Login}></Route>
        </Switch>
      </Router>
    </VideoCallContextProvider>
  );
};

export default App;
