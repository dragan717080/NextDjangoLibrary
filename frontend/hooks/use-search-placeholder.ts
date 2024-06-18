import { useEffect, useState } from "react";

const useSearchPlaceholder = () => {
  const [placeholder, setPlaceholder] = useState("Start your search");

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth <= 700) {
      setPlaceholder("Search");
    }
  }, []);

  return placeholder;
};

export default useSearchPlaceholder;
