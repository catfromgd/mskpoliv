import React, { useState } from "react";
import styles from "./App.module.css";
import List from "./ExpandbleList/ExpandableList.jsx";
import objects from "./objects.json";
import Map from "./PanZoomSvg/PanZoomSVG.jsx";
import Scheme from "./SvgImages/Scheme.jsx";
import Carousel from "./Carousel/Carousel.jsx";
import { useRef } from "react";

export default function App() {
  const servicesRef = useRef(null);
  const scrollToServices = () => {
    servicesRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const objectsRef = useRef(null);
  const scrollToObjects = () => {
    objectsRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const contactsRef = useRef(null);
  const scrollToContacts = () => {
    contactsRef.current.scrollIntoView({ behavior: "smooth" });
  };


  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.logoDiv}>
          <img
            src="src/assets/logo-mskpoliv.png"
            alt="no logo"
            className={styles.logoImg}
          />
          <h1 className={styles.logo}>mskpoliv.ru</h1>
        </div>
        <button className={styles.headerButton} onClick={() => scrollToServices()}><span className={styles.headerButtonText}>Услуги</span></button>
        <button className={styles.headerButton} onClick={() => scrollToObjects()}><span className={styles.headerButtonText}>Наши работы</span></button>
        <button className={styles.headerButton} onClick={() => scrollToContacts()}><span className={styles.headerButtonText}>Контакты</span></button>
      </header>
      <div className={styles.fakeHeader}></div>
      <Carousel slides={["src/assets/photo1.jpg", "src/assets/photo2.jpg"]} autoplaySpeed={4000} />
      <div className={styles.container}>
        <div className={styles.services} ref={servicesRef}>
          <h2 className={styles.sectionTitle}>Автополив</h2>
          <div className={styles.service}>
            <h2 className={styles.serviceTitle}></h2>
            <div className={styles.priceAndButton}>
              <button className={styles.serviceButton} onClick={() => scrollToContacts()}>Заказать</button>
              <h4 className={styles.servicePrice}>От 40.000 ₽ за сотку</h4>
            </div>
          </div>
        </div>
        <div className={styles.objects} ref={objectsRef}>
          <h2 className={styles.sectionTitle}>Наши работы</h2>
          <Map className={styles.objectsSchemeContainer}>
            <Scheme />
          </Map>
          <h4>Населённые пункты, в которых работают наши системы автополива</h4>
          <List items={objects} className={styles.objectsList} />
        </div>
      </div>
      <footer className={styles.footer} ref={contactsRef}>
        <h2 className={styles.sectionTitle}>Оставить заявку</h2>
        <div className={styles.footerForm}>
          <script src="https://forms.yandex.ru/_static/embed.js"></script>
          <iframe
            src="https://forms.yandex.ru/u/6883a5e490fa7b095e2a068b?iframe=1"
            frameborder="0"
            name="ya-form-6883a5e490fa7b095e2a068b"
            width="650"
            height={'400px'}
          ></iframe>
        </div>
      </footer>
    </div>
  );
}
