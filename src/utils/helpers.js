import jwt_decode from "jwt-decode";

export const cleanClinicHistory = (clinicHistory = "") => {
  if (!clinicHistory) {
    return "";
  }
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

export const sortByProperty = (array, property, order = "asc") => {
  const compare = (a, b) => {
    let propertyValueA = a[property];
    let propertyValueB = b[property];

    if (order === "desc") {
      propertyValueA = b[property];
      propertyValueB = a[property];
    }

    if (propertyValueA < propertyValueB) {
      return -1;
    } else if (propertyValueA > propertyValueB) {
      return 1;
    } else {
      return 0;
    }
  };
  return array.sort(compare);
};

export const calculateAverageWaitingTime = (patientTurns) => {
  if (!patientTurns || patientTurns.length === 0) {
    return 0;
  }

  let totalWaitingTime = 0;
  let numberOfPatients = 0;

  for (const patient of patientTurns) {
    const timestamp = new Date(patient.timestamp).getTime();
    const updatedAt = new Date(patient.updatedAt).getTime();

    if (!isNaN(timestamp) && !isNaN(updatedAt)) {
      const waitingTime = updatedAt - timestamp;
      totalWaitingTime += waitingTime;
      numberOfPatients++;
    }
  }

  if (numberOfPatients === 0) {
    return 0;
  }

  // Calculate the average waiting time in miliseconds
  const averageWaitingTime = totalWaitingTime / numberOfPatients;
  return averageWaitingTime;
};

export const getEstimatedTimeToBeAttended = (order, averageWaitingTime) => {
  const nowTime = new Date().getTime();
  const timeToAdd = Number(averageWaitingTime) * order;
  const estimatedDateTime = new Date(nowTime + timeToAdd);
  return `${estimatedDateTime.getHours()}:${estimatedDateTime.getMinutes()}`;
};

export const buildDateFromPicker = (dateObject) => {
  const { $d } = dateObject;
  if (isNaN($d.getDate())) {
    return "";
  }
  return new Date($d.getTime()).toISOString();
};

export const buildTimeFromPicker = (dateObject) => {
  const { $d } = dateObject;
  if (isNaN($d.getDate())) {
    return "";
  }
  return `${$d.getHours()}:${$d.getMinutes()}`;
};

export const formatDate = (dateString) => {
  if (!dateString) {
    return "";
  }
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatDateTime = (dateString) => {
  if (!dateString) {
    return "";
  }
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

export const cleanStringForEvent = (string) => {
  return string.replace(/[,\\]/g, "");
};
