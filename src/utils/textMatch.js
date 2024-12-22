const removeDuplicatedSpaces = (text) => {
  let transformedText = text;
  while (/\s{2,}/.test(transformedText)) {
    transformedText = transformedText.replace(/\s{2,}/g, ' ');
  }
  return transformedText;
};

const cleanSource = (source) => {
  let transformedText = source
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s]/g, ' ')
    .replace(/<br\\?>/ig, ' ')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/&amp;/ig, '&')
    .replace(/&lt;/ig, '<')
    .replace(/&gt;/ig, '>')
    .replace(/&nbsp;/ig, ' ')
    .replace(/&quot;/ig, '"')
    .replace(/&apos;/ig, '\'')
    .replaceAll(String.fromCharCode(160), ' ')
    .toLowerCase()
    .trim();
  transformedText = removeDuplicatedSpaces(transformedText);
  return transformedText;
};

const cleanQuery = (text) => {
  let transformedText = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s]/g, ' ')
    .replaceAll(String.fromCharCode(160), ' ')
    .toLowerCase()
    .trim();
  transformedText = removeDuplicatedSpaces(transformedText);
  return transformedText;
};

const textMatch = (source, query) => {
  const textSource = cleanSource(source);
  const textQuery = cleanQuery(query);
  return textSource.includes(textQuery);
};

export default textMatch;
