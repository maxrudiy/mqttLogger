const ISOTimeStringToLocaleTimeString = (time) => new Date(time).toLocaleTimeString(navigator.language);

export { ISOTimeStringToLocaleTimeString };
