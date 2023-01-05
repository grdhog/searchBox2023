'use strict';


function replacer(match, p1, p2, p3, offset, string) {
  console.log(match);
  console.log(p1);
  console.log(p2);
  console.log(p3);
  if (typeof p1 === 'undefined' && typeof p3 === 'undefined') {
    //not between b tags
    return '<b>' + p2 + '</b>';
  }
  return match;
}

function replace(str, term) {
  //IE11 can't do lookbehind or lookforward - below alternative.
  var regexp = RegExp('(<b>[a-z]*)?(' + term + ')([a-z]*<\\/b>)?', 'gi');
  //OLD var regexp = new RegExp('(?<!<b>[a-z]*)' + term + '(?![a-z]*<\\/b>)', 'gi');
  //IE11 can't do replaceAll but if globale regexp we are cool.
  return str.replace(regexp, replacer);
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
  let copyStr = deMacron(str);
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
  //IE11 can do Array.from(boldedStr);
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
  'a, e, i, o, u, A, E, I, O, U' ===
    deMacron(
      '\u0101, \u0113, \u012B, \u014D, \u016B, \u0100, \u0112, \u012A, \u014C, \u016A'
    )
);

console.assert(
  '<b>C\u0101t</b>astrophic' ===
    getBackOriginalChars('C\u0101tastrophic', '<b>cat</b>astrophic')
);

console.log('test 1', replace('L\u014DnG,,,t\u0113rM plaXXing', 'term') );

console.log('test 2', replace( deMacron('L\u014DnG,,,t\u0113rM plaXXing'), 'term') );

console.log( boldIt('L\u014DnG,,,t\u0113rM plaXXing', 'term long') );

console.assert(
  '<b>L\u014DnG</b>,,,<b>t\u0113rM</b> plaXXing' ===
    boldIt('L\u014DnG,,,t\u0113rM plaXXing', 'term long')
);