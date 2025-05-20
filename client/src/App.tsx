import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import ExploreEvents from "@/pages/ExploreEvents";
import SubmitEvent from "@/pages/SubmitEvent";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/explore" component={ExploreEvents} />
      <Route path="/submit" component={SubmitEvent} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return <Router />;
}

export default App;
