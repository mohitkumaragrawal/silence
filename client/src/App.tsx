import { BrowserRouter } from "react-router-dom";
import { ReactNotifications } from "react-notifications-component";

import { AuthContextProvider } from "./auth/auth.context";
import Layout from "./components/Layout";
import Routes from "./Routes";

function App() {
  return (
    <BrowserRouter>
      <ReactNotifications />
      <AuthContextProvider>
        <Layout>
          <Routes />
        </Layout>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
