function replace(str, term){
  var TAG = 'b';
  const regexp = new RegExp('(?<!<b>[a-z]*)' + term + '(?![a-z]*<\\/b>)', 'gi');
  var match;
  var newStr = "";
  var lastBefore = 0;
  while ((match = regexp.exec(str)) !== null) {
      console.log( 'before: -->' + str.substring(lastBefore, match.index) + '<--' );
      console.log( 'found: -->' + str.substring(match.index, regexp.lastIndex) + '<--');
      console.log( 'remainder: -->' + str.substring(regexp.lastIndex, str.length) + '<--');
      newStr += str.substring(lastBefore, match.index) + '<' + TAG + '>' + str.substring(match.index, regexp.lastIndex) + '</' + TAG + '>';
      lastBefore = regexp.lastIndex;
  }
  newStr += str.substring(lastBefore, str.length);
  return newStr;
}

function searchWords(searchTerm){
  return searchTerm.toLowerCase().trim().split(/[ ,\-\+]+/);
}

function sortByLen(words){
  function compare(a, b){
      return b.length - a.length;
  }
  return words.sort(compare)
}

function boldIt(str, searchTerm){
  var words = searchWords(searchTerm);
  words = sortByLen(words);
  var newStr = str;
  for (var i=0; i < words.length; i++){
      newStr = replace(newStr, words[i]);
  }
  return newStr;
}

console.assert(['plan', 'shop', 'hello', 'bro', 'walk', 'talk'].toString() === searchWords('plan,shop  hello, + - bro walk+talk').toString());
console.assert("<b>long</b>,,,term planning" === replace("long,,,term planning", 'long')  );
console.assert(['rotorua', 'howick', 'apple', 'tawa', 'g'].toString() === sortByLen(['rotorua', 'tawa', 'howick', 'apple', 'g']).toString()  );
console.assert("<b>long</b>,,,<b>term</b> planning" === boldIt("long,,,term planning", 'term long')  );
console.log(  boldIt("catastrophic results cat.", 'catastrophic cat trop')  );
console.assert("<b>catastrophic</b> results <b>cat</b>." === boldIt("catastrophic results cat.", 'catastrophic cat trop')  );
