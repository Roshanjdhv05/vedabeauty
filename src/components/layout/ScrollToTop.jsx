import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // If we are navigating to a new page, scroll to top
    // However, for "back" navigation, the browser usually handles scroll restoration 
    // IF the page content is already there.
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
