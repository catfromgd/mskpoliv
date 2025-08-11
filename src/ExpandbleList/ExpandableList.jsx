import React, { useState, useRef, useEffect } from "react";
import styles from "./ExpandableList.module.css";

export default function ExpandableList({
  items,
  collapsedHeight = 100,
  expandedHeight = 300,
}) {
  const [expanded, setExpanded] = useState(false);
  const listRef = useRef(null);
  const [showShadow, setShowShadow] = useState(true);

  useEffect(() => {
    if (!expanded) return;

    function onScroll() {
      if (!listRef.current) return;
      const el = listRef.current;
      setShowShadow(
        el.scrollHeight > el.clientHeight &&
          el.scrollTop + el.clientHeight < el.scrollHeight
      );
    }

    const el = listRef.current;
    el.addEventListener("scroll", onScroll);

    onScroll();

    return () => {
      el.removeEventListener("scroll", onScroll);
    };
  }, [expanded]);

  const expandedScrollBlock = () => {
    setExpanded(!expanded);
    listRef.current.scrollTop = 0;
  };

  return (
    <div className={styles.container}>
      <div
        ref={listRef}
        className={`${styles.list} ${
          expanded ? styles.expanded : styles.collapsed
        }`}
        style={{
          maxHeight: expanded ? expandedHeight : collapsedHeight,
        }}
      >
        {items.map((item, i) => (
          <div key={i} className={styles.item}>
            {item}
          </div>
        ))}
        {!expanded && <div className={styles.fade} />}
      </div>

      <button onClick={() => expandedScrollBlock()} className={styles.button}>
        {expanded ? "Скрыть" : "Показать больше"}
      </button>
    </div>
  );
}
