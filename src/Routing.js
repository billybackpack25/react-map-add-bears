import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './Home';
import Query from './query';
import {queryClient} from './query';
import {QueryClientProvider} from 'react-query';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <Router>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
        <Route path="/query">
            <Query />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
    </Router>
    </QueryClientProvider>
  );
}