'use strict';

function replace(str, term) {
  var TAG = 'b';
  var regexp = new RegExp('(?<!<b>[a-z]{0,1000})' + term + '(?![a-z]{0,1000}<\\/b>)', 'gi');
  return str.replaceAll(regexp, '<' + TAG + '>' + term + '</' + TAG + '>');
}

function searchWords(searchTerm) {
  return searchTerm
    .toLowerCase()
    .trim()
    .split(/[ ,\-\+]+/);
}

function sortByLen(words) {
  function compare(a, b) {
    return b.length - a.length;
  }
  return words.sort(compare);
}

function boldIt(str, searchTerm) {
  let cleanedTerms = deMacron(searchTerm);
  let words = searchWords(cleanedTerms);
  words = sortByLen(words);
  let copyStr = str.toLowerCase();
  copyStr = deMacron(copyStr);
  for (var i = 0; i < words.length; i++) {
    copyStr = replace(copyStr, words[i]);
  }
  copyStr = getBackOriginalChars(str, copyStr);
  return copyStr;
}

var macronMap = {
  '\u0101': 'a',
  '\u0113': 'e',
  '\u012B': 'i',
  '\u014D': 'o',
  '\u016B': 'u',
  '\u0100': 'A',
  '\u0112': 'E',
  '\u012A': 'I',
  '\u014C': 'O',
  '\u016A': 'U',
};

function deMacron(str) {
  return str.replace(/[^A-Za-z0-9\[\] ]/g, function (char) {
    return macronMap[char] || char;
  });
}
function macronFree(str) {
  return str === deMacron(str);
}
function getBackOriginalChars(originalStr, boldedStr) {
  let index = 0;
  //const boldArray = Array.from(boldedStr);
  var boldArray = boldedStr.split('');
  let inTag = false;
  for (let i = 0; i < boldArray.length; i++) {
    if (boldArray[i] === '<') {
      inTag = true;
    } else if (boldArray[i] === '>') {
      inTag = false;
    } else if (!inTag) {
      //console.log('compare', boldArray[i], originalStr[index]);
      if (boldArray[i] !== originalStr[index])
        boldArray[i] = originalStr[index];
      index++;
    }
  }
  return boldArray.join('');
}

console.assert(
  ['plan', 'shop', 'hello', 'bro', 'walk', 'talk'].toString() ===
    searchWords('plan,shop  hello, + - bro walk+talk').toString()
);
console.assert(
  '<b>long</b>,,,term planning' === replace('long,,,term planning', 'long')
);
console.assert(
  ['rotorua', 'howick', 'apple', 'tawa', 'g'].toString() ===
    sortByLen(['rotorua', 'tawa', 'howick', 'apple', 'g']).toString()
);
console.assert(
  '<b>long</b>,,,<b>term</b> planning' ===
    boldIt('long,,,term planning', 'term long')
);
//console.log(boldIt('catastrophic results cat.', 'catastrophic cat trop'));
console.assert(
  '<b>catastrophic</b> results <b>cat</b>.' ===
    boldIt('catastrophic results cat.', 'catastrophic cat trop')
);

console.assert(
  'a, e, i, o, u, A, E, I, O, U' === deMacron('\u0101, \u0113, \u012B, \u014D, \u016B, \u0100, \u0112, \u012A, \u014C, \u016A')
);

console.assert(
  '<b>C\u0101t</b>astrophic' ===
    getBackOriginalChars('C\u0101tastrophic', '<b>cat</b>astrophic')
);

console.assert(
  '<b>L\u014DnG</b>,,,<b>t\u0113rM</b> plaXXing' ===
    boldIt('L\u014DnG,,,t\u0113rM plaXXing', 'term long')
);
