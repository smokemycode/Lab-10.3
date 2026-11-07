import Dashboard from "./components/Dashboard/Dashboard";
import { AppProviders } from "./context/AppProviders";

// App just renders the Dashboard — Dashboard owns all the state and layout.
export default function App() {
  return (
    <AppProviders>
      <Dashboard />
    </AppProviders>
  );
}