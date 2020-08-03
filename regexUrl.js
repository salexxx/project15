// eslint-disable-next-line no-useless-escape
const regexUrl = /^(https|http):\/\/(www\.{1})?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|[\w\.\-_]+\.[a-z]{2,})(:\d{2,5})?((\/[a-z0-9-%_]{1,})*)?(\/|#)?$/;
module.exports = regexUrl;
