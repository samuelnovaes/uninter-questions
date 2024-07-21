const cleanText = (text = '') => text
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/\s+/g, ' ')
  .toLowerCase();

const textMatch = (source, query) => cleanText(source).includes(cleanText(query));

export default textMatch;
