import './Header.css';
import { assets } from "../../assets/assets_flowers";

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className='header-content__img'>
          <img className='header_img' src={assets.header_img} alt="" />
        </div>
        <div className='header-content__dscr'>
          <h1 className='header-content__h1'>Миссия ЭПЛ</h1>
          <p className='header-content__txt'>
            Мы работаем для того, <br />
            чтобы лучшие (самые качественные) в Мире изделия,<br />
            услуги и атмосфера Счастья от ЭПЛ покорили сердца людей всей Земли!<br />
            И в этом Мире стало больше Счастья!
          </p>
        </div>
        <p className="author">
          Основатель «ЭПЛ»<br />
          Федоров Петр Степанович<br />
          и команда «ЭПЛ»
        </p>
      </div>
    </header>
  )
}

export default Header