import React, { useState } from "react";
import styles from "./App.module.css";
import List from "./ExpandbleList/ExpandableList.jsx";
import objects from "./objects.json";
import Map from "./PanZoomSvg/PanZoomSVG.jsx";
import Scheme from "./SvgImages/Scheme.jsx";
import Carousel from "./Carousel/Carousel.jsx";

export default function App() {
const images = ["avtopoliv/src/assets/photo1.jpg", "avtopoliv/src/assets/photo2.jpg"]

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
        <button className={styles.headerButton}>Услуги</button>
        <button className={styles.headerButton}>Наши работы</button>
        <button className={styles.headerButton}>Контакты</button>
      </header>
      <div className={styles.container}>
        <div className={styles.fakeHeader}></div>
        <Carousel slides={images} autoplaySpeed={4000}/>
        <div className={styles.services}>
          <h2 className={styles.servicesTitle}>Автополив</h2>
          <div className={styles.service}>
            <h2 className={styles.serviceTitle}></h2>
            <div className={styles.priceAndButton}>
              <button className={styles.serviceButton}>Заказать</button>
              <h4 className={styles.servicePrice}>От 40.000 ₽ за сотку</h4>
            </div>
          </div>
        </div>
        <div className={styles.objects}>
          <h2 className={styles.servicesTitle}>Наши работы</h2>
          <Map className={styles.objectsSchemeContainer}>
            <Scheme />
          </Map>
          <List items={objects} className={styles.objectsList} />
        </div>
      </div>
    </div>
  );
}
