export const getVietnameseFormattedDate = (dateInput = new Date()) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  const formatter = new Intl.DateTimeFormat("vi-VN", options);
  let formattedString = formatter.format(dateInput);
  formattedString = formattedString.replace(
    /^(Thứ [A-Za-z]+)/,
    (match) => match.charAt(0).toUpperCase() + match.slice(1).toLowerCase(),
  );
  return formattedString;
};
