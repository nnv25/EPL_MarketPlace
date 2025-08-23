import React from 'react';
import './PageSelector.css'; // Создайте стили для компонента

const PageSelector = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1} // Деактивируем кнопку, если это первая страница
      >
        Назад
      </button>

      <span>Страница {currentPage} из {totalPages}</span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages} // Деактивируем кнопку, если это последняя страница
      >
        Вперед
      </button>
    </div>
  );
};

export default PageSelector;