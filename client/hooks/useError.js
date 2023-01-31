import { useEffect, useRef, useState } from "react";

export default function useError() {
  const [isVisible, setisVisible] = useState(false);
  const timerRef = useRef(null);

  function toggleVisibility() {
    setisVisible(true);
    timerRef.current = setTimeout(() => setisVisible(false), 1000);
  }

  useEffect(() => {
    // Clear the interval when the component unmounts
    return () => clearTimeout(timerRef.current);
  }, []);

  return [isVisible, toggleVisibility];
}
