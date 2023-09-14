import jwt_decode from "jwt-decode";

export const cleanClinicHistory = (clinicHistory) => {
  return clinicHistory.trim();
};

export const filterValidCharacters = (word) => {
  const regex = /[a-zA-ZáéíóúñÁÉÍÓÚÑüÜ\s]/u;

  const cleanedCharacters = [...word].filter((char) => regex.test(char));

  if (cleanedCharacters.length === 0) {
    return "";
  }

  const capitalizedWord = cleanedCharacters.join("");
  return capitalizedWord.charAt(0).toUpperCase() + capitalizedWord.slice(1);
};

export const cleanAndCapitalizeParagraph = (paragraph) => {
  const words = paragraph.toLowerCase().split(/\s+/);
  const cleanedAndCapitalizedWords = words.map((word) =>
    filterValidCharacters(word)
  );
  return cleanedAndCapitalizedWords.join(" ");
};

export const onlyDigits = (value) => {
  const regex = /^[0-9]+$/;
  return regex.test(value);
};

export const decodeJwt = (token) => jwt_decode(token);
