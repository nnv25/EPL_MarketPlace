import React from 'react'
import "./Navbar2.css";
import { useContext, useState } from "react";
import { assets } from "../../assets/assets_flowers"; // Импорт ресурсов
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../Context/StoreContext";

const Navbar2 = () => {
const [menu, setMenu] = useState("Главная"); // Состояние для текущего меню


  const navigate = useNavigate()

  return (
    <div className='navbar2'>
        <ul className="navbar-menu">
        {" "}
        {/* Меню */}
        <Link to='/' onClick={() => setMenu("Главная")} className={menu === "Главная" ? "active" : ""}>Главная</Link>
        <li
          onClick={() => setMenu("Магазины")} // Установка "Магазины" как активного меню
          className={menu === "Магазины" ? "active" : ""} // Класс для активного меню
        >
          <a
            href="/#stores" // This will navigate to the section with the id "stores"
            onClick={() => setMenu("Магазины")}
            className={menu === "Магазины" ? "active" : ""}
          >
            Магазины
          </a>
        </li>
        <li
          onClick={() => setMenu("Контакты")} // Установка "Контакты" как активного меню
          className={menu === "Контакты" ? "active" : ""} // Класс для активного меню
        >
          <a
            href="#footer" // This will navigate to the section with the id "stores"
            onClick={() => setMenu("Контакты")}
            className={menu === "Контакты" ? "active" : ""}
          >
            Контакты
          </a>
        </li>
      </ul>
    </div>
  )
}

export default Navbar2