export const getSingaporeDate = (date = new Date()) => {
    const offsetDate = new Date(date);
    offsetDate.setHours(offsetDate.getHours() + 8);
    return offsetDate;
  };

