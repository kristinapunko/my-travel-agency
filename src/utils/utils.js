// Функція для форматування дати
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const currentYear = new Date().getFullYear();
    return `${day} ${month}${year !== currentYear ? ` ${year}` : ''}`;
  };
  
  // Функція для розрахунку днів і ночей
  export const calculateDaysAndNights = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end - start;
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    const nightsDifference = daysDifference - 1;
    return `${daysDifference} днів + ${nightsDifference} ночей`;
  };
  
  // Функція для форматування ціни
  export const formatPrice = (price) => {
    return new Intl.NumberFormat('uk-UA', { style: 'decimal' }).format(price);
  };

  // Лайкання турів
  