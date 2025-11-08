// utils/normalize.js
function normalize(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .replace(/[-_/]/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\b(development|developer|dev|engineer)\b/g, '')
      .trim();
  }
  
  export default normalize;