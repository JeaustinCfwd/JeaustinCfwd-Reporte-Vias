import React, { useRef, useEffect, useState } from "react";
import "../styles/AnimatedComment.css";

const AnimatedComment = ({ children }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.3, // cuando el 30% del comentario esté visible
      }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`animated-comment ${visible ? "show" : "hide"}`}
    >
      {children}
    </div>
  );
};

export default AnimatedComment;
