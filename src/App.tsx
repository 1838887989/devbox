import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { I18nProvider } from "./contexts/I18nContext";
import { EnvironmentProvider } from "./contexts/EnvironmentContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Languages from "./pages/Languages";
import Tools from "./pages/Tools";
import Settings from "./pages/Settings";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <EnvironmentProvider>
        <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/languages" element={<Languages />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
        </BrowserRouter>
        </EnvironmentProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
