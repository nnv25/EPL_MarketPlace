import "./Footer.css";
import { assets } from "../../assets/assets_flowers";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-top">
        <a className="footer-top__link" href="#">
          НАВЕРХ
        </a>
        <img className="footer-top__img" src={assets.arrowUp} alt="" />
      </div>
      <div className="footer-middle">
        <div className="footer-middle__social">
          <p className="footer-middle__txt">
            МЫ В СОЦСЕТЯХ:
          </p>
          <img className="epl-social__img" src={assets.epl_social} alt="" />
        </div>
        <img className="footer-logo" src={assets.footer_logo} alt="" />
      </div>
      <div className="footer-bottom">
        <p className="footer-bottom__txt">
          Для корректной работы сайта, персонализации пользователей и других целей,<br/>
          используются файлы cookie, предусмотренных политикой конфиденциальности
        </p>
        <p className="footer-bottom__copyright">
          © 2013—2025 epldiamond. Все права защищены.
        </p>
      </div>

      {/* <div className="footer-content">
        <div className="footer-content-left">
          <p className="footer-social__txt">
            МЫ В СОЦСЕТЯХ:
          </p>
          <img className="epl-social__img" src={assets.epl_social} alt="" />
          <div className="footer-content__personal">
            <p className="footer-content__confidentional">
              Для корректной работы сайта, персонализации пользователей и других целей, 
              используются файлы cookie, предусмотренных политикой конфиденциальности
            </p>
          </div>
        </div>
        <div className="footer-content-center">
          <ul>
            <li><a href="https://docs.google.com/document/d/1eYwceOAcQY68kIWL-pEWZOUye4oD1tCky7gDzskVdyM/edit?tab=t.0" target="_blank">Пользовательское соглашение</a></li>
            <li><a href="https://docs.google.com/document/d/1A6j78me-dLFZReE5QOsv6iZj36P1T6u4r5fuu5SBjWw/edit?tab=t.0" target="_blank">Политика конфиденциальности</a></li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>Контакты</h2>
          <ul>
            <li>e-mail: meta.systems@yandex.ru</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Все права защищены 2024 ООО «Метасистемы» ИНН 1400037751 ОГРН 1241400007749
      </p> */}
    </div>
  );
};

export default Footer;
