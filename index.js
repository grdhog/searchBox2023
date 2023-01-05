"use strict"

function replace(str, term) {
  var TAG = 'b';
  const regexp = new RegExp('(?<!<b>[a-z]*)' + term + '(?![a-z]*<\\/b>)', 'gi');
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
  copyStr = getBackOriginalChars(str, copyStr)
  return copyStr;
}

var macronMap = {
  ā: 'a',
  ē: 'e',
  ī: 'i',
  ō: 'o',
  ū: 'u',
  Ā: 'A',
  Ē: 'E',
  Ī: 'I',
  Ō: 'O',
  Ū: 'U',
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
  const boldArray = Array.from(boldedStr);
  let inTag = false;
  for (let i=0; i < boldArray.length; i++){
    if (boldArray[i] === '<'){
      inTag = true;
    }
    else if (boldArray[i] === '>'){
      inTag = false;
    }
    else if (!inTag) {
      //console.log('compare', boldArray[i], originalStr[index]);
      if (boldArray[i] !== originalStr[index]) boldArray[i] = originalStr[index];
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
  'a, e, i, o, u, A, E, I, O, U' === deMacron('ā, ē, ī, ō, ū, Ā, Ē, Ī, Ō, Ū')
);
console.assert(macronFree('a, e, i, o, u, A, E, I, O, U'));
console.assert(!macronFree('ā, ē, ī, ō, ū, Ā, Ē, Ī, Ō, Ū'));

console.assert('<b>Cāt</b>astrophic' === getBackOriginalChars('Cātastrophic', '<b>cat</b>astrophic') );

console.assert(
  '<b>LōnG</b>,,,<b>tērM</b> plaXXing' ===
    boldIt('LōnG,,,tērM plaXXing', 'term long')
);