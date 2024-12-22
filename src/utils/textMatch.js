String.prototype.afterCleanUp = function () {
  let transformedText = this
    .replaceAll(String.fromCharCode(160), ' ')
    .toLowerCase()
    .trim();
  while (/\s{2,}/.test(transformedText)) {
    transformedText = transformedText.replace(/\s{2,}/g, ' ');
  }
  return transformedText;
};

String.prototype.preCleanUp = function () {
  return this
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s]/g, ' ');
};

const cleanSource = (source) => source
  .preCleanUp()
  .replace(/<br\\?>/ig, ' ')
  .replace(/<\/?[^>]+(>|$)/g, '')
  .replace(/&amp;/ig, '&')
  .replace(/&lt;/ig, '<')
  .replace(/&gt;/ig, '>')
  .replace(/&nbsp;/ig, ' ')
  .replace(/&quot;/ig, '"')
  .replace(/&apos;/ig, '\'')
  .afterCleanUp();

const cleanQuery = (text) => text
  .preCleanUp()
  .afterCleanUp();

const textMatch = (source, query) => cleanSource(source).includes(cleanQuery(query));

export default textMatch;
