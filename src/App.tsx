import Layout from "./components/Layout";
import CalendarPage from "./pages/CalendarPage";
import HomePage from "./pages/HomePage";
import { useTabStore } from "./stores/tab";

export default function App() {
  let page = null;

  const tabStore = useTabStore();

  switch (tabStore.activeTabId) {
    case "Home":
      page = <HomePage />;
      break;
    case "Calendar":
      page = <CalendarPage />;
      break;
    default:
      console.log(tabStore.activeTabId);
      page = <div>Not found</div>;
  }

  return <Layout>{page}</Layout>;
}
