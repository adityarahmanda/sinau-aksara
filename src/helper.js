const wyanjana = [['h', 4],['n', 7],['c', 1],['r', 9],['k', 11],
                  ['d', 2],['t', 9],['s', 9],['w', 5],['l', 6],
                  ['p', 9],['dh', 3],['j', 3],['y', 3],['ny', 1],
                  ['m', 7],['g', 14],['b', 5],['th', 1],['ng', 3]];

const swara = [['a', 48],['i', 19],['u', 14],['e', 7],['o', 7],['é', 10]];

const panyigeg = [['h', 9],['n', 31],['c', 0],['r', 4],['k', 4],
                  ['d', 1],['t', 4],['s', 5],['w', 0],['l', 3],
                  ['p', 2],['dh', 0],['j', 0],['y', 0],['ny', 0],
                  ['m', 2],['g', 2],['b', 1],['th', 0],['ng', 39]];

const sandangan = [['y', 1],['r', 1],['l', 1],['w', 0]];
const rekan = [['kh', 1],['q', 0],['dz', 1],['f', 1],['v', 0],['gh', 1]];

const aksara = [wyanjana, swara, panyigeg, sandangan, rekan];

const structures = [[[1], 1],  
                    [[2], 1], 
                    [[0, 1], 20],
                    [[4, 1], 0],
                    [[1, 2], 1],
                    [[0, 1, 2], 0], 
                    [[0, 3, 1], 0]];
                    
const containsAll = (arr1, arr2) => 
                arr2.every(arr2Item => arr1.includes(arr2Item))

const sameMembers = (arr1, arr2) => 
                        containsAll(arr1, arr2) && containsAll(arr2, arr1);

export const regexFromArray = (array) => {
  let pattern = "(";
  for(let i = 0; i < array.length; i++) {
    pattern += array[i][0];
    pattern += (i !== (array.length - 1)) ? "|" : ")";
  }
  return new RegExp(pattern, 'gi');
}

export const checkStructure = (structure) => {
  for(let i = 0; i < structures.length; i++) {
    if(sameMembers(structure, structures[i][0])) {
      return i;
    }
  }
  return null;
}

export const getStructureNumber = (string) => { 
  const characters = string.match(/[^aiueo]+|[aiueo]/gi);
  let structure = [];

  for(let i = 0; i < characters.length; i++) {
    for(let j = 0; j < aksara.length; j++) {
      if (regexFromArray(aksara[j]).test(characters[i])) {
        structure.push(j);
        break;
      }
    }
  }

  if(characters.length === 1 && structure[0] === 0) {
    structure[0] = 2;
  } else if(characters.length === 2 && structure[1] === 0) {
    structure[1] = 2;
  } else if(characters.length === 3 && structure[2] === 0) {
    structure[2] = 2;
  }

  return checkStructure(structure);
}

export const shuffleArray = (array) => {
    for(let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export const addWeightToArray = (array, data, value) => {
  for(let i = 0; i < array.length; i++){
    if(array[i][0] === data[0]) {
      array[i][1] += value;  
      return;
    }
  }
}

export const existInArray = (data, array) => {
  for(let i = 0; i < array.length; i++) {
    if(data === array[i]) return true;
  }
  return false;
}

export const random = (min, max) => {
  return Math.floor(min + Math.random() * ((max - min) + 1));
}

export const randomWeight = (data) => {
  let total = 0;

  for (let i = 0; i < data.length; ++i) {
    total += data[i][1];
  }

  const threshold = Math.random() * total;

  total = 0;
  for (let i = 0; i < data.length - 1; ++i) {
    total += data[i][1];

    if (total >= threshold) {
        return data[i][0];
    }
  }

  return data[data.length - 1][0];
}

export const generateSyllable = (structures) => {
  let syllable = "";
  let structure = randomWeight(structures);
  
  for(let i = 0; i < structure.length; i++) {
    syllable += randomWeight(aksara[structure[i]]);
  }

  return syllable;
}

export const toMurda = (aksaraWord) => {
  let aksaraMurda = [['ꦤ', 'ꦟ'], ['ꦏ', 'ꦑ'], ['ꦠ​', 'ꦡ'], ['ꦱ', 'ꦯ'],
                     ['ꦥ​', 'ꦦ'], ['ꦚ', 'ꦘ'], ['ꦒ', 'ꦓ'], ['ꦧ', 'ꦨ']];

  for(let i = 0; i < aksaraMurda.length; i++) {
    let pattern = new RegExp(aksaraMurda[i][0]);
    
    let replaced = aksaraWord.search(pattern) >= 0;
    if(replaced){
      return aksaraWord.replace(pattern, aksaraMurda[i][1]);
    }
  }

  return aksaraWord;
}

export const aksarafy = (word) => {
  //fixing special character
  let result = word
  .replace(/\s+$/g, "")
  .replace(/,/gi, "꧈").replace(/\./gi, "꧉")
  .replace(/[0-9]/gi, function (c) { return String.fromCodePoint(c.charCodeAt(0) + 43424);})
  //simplifying aksara
  .replace(/kh/gi, "k+").replace(/dz/gi, "d+").replace(/f|v/gi, "p+").replace(/z/gi, "j+").replace(/gih/gi, "g+")
  .replace(/d(?!h)/gi, "f").replace(/ny/gi, "v").replace(/dh/gi, "d").replace(/th/gi, "q").replace(/ng/gi, "z")
  .replace(/ua/gi, "uwa").replace(/ia/gi, "iya")
  //replacing rekan
  .replace(/\+/gi, "꦳")
  //replacing panyigeg
  .replace(/r(?=[bcdfghjklmnpqrstvwxyz\s])|r$/gi, "ꦂ")
  .replace(/z(?=[bcdfghjklmnpqrstvwxyz\s])|z$/gi, "ꦁ")
  .replace(/h(?=[bcdfghjklmnpqrstvwxyz\s])|h$/gi, "ꦃ")
  //replacing sandhangan
  .replace(/(?<=[bcdfghjklmnpqrstvwxyz\s]+)y/gi, "ꦾ")
  .replace(/(?<=[bcdfghjklmnpqrstvwxyz\s]+)re/gi, "ꦽ")
  .replace(/(?<=[bcdfghjklmnpqrstvwxyz\s]+)ru/gi, "ꦿꦸ")
  .replace(/(?<=[bcdfghjklmnpqrstvwxyz\s]+)(r)/gi, "ꦿ")
  //pinning pasangan
  .replace(/(?<![^aiueoé\s])[aiueoé]/gi, match => "h" + match)
  .replace(/\s/gi, "")
  .replace(/(?<=[bcdfghjklmnpqrstvwxyz])[bcdfghjklmnpqrstvwxyz]/gi, match => "꧀" + match)
  .replace(/[bcdfghjklmnpqrstvwxyz]$/gi, match => match + "꧀")
  //replacing wyanjana
  .replace(/h/gi, "ꦲ").replace(/n/gi, "ꦤ").replace(/c/gi, "ꦕ").replace(/r/gi, "ꦫ").replace(/k/gi, "ꦏ")
  .replace(/f/gi, "ꦢ").replace(/t/gi, "ꦠ​").replace(/s/gi, "ꦱ​").replace(/w/gi, "ꦮ​").replace(/l/gi, "ꦭ")
  .replace(/p/gi, "ꦥ​").replace(/d/gi, "ꦝ​").replace(/j/gi, "ꦗ").replace(/y/gi, "ꦪ​").replace(/v/gi, "ꦚ")
  .replace(/m/gi, "ꦩ​").replace(/gi/gi, "ꦒ").replace(/b/gi, "ꦧ").replace(/q/gi, "ꦛ").replace(/z/gi, "ꦔ")
  //replacing swara
  .replace(/a/g, "").replace(/e/g, "ꦼ").replace(/i/g,  "ꦶ")
  .replace(/u/g, "ꦸ").replace(/o/g, "ꦺꦴ").replace(/é/g, "ꦺ");

  return result;
}

export const syllabify = (word) => {
  if(word === "") return "";

  let replacedWord = word.replace(/ua/g, "uwa");
  const syllableRegex = /[aeioué](ng|r|h)?|[^aeioué]+(?:[aeioué](ng|r|h)(?=[^aeioué]|$)|[aeioué]?)/gi;

  let syllables = replacedWord.match(syllableRegex);
  console.log(syllables);
  
  return syllables;
}

export const generateChoices = (word) => {
  let choices = Array(4).fill(word);
  let structureNumber = 0;
  
  const cloneStructures = [...structures];
  for(let i = 0; i < cloneStructures.length; i++) {
    cloneStructures[i] = [...cloneStructures[i]];
  }

  structureNumber = getStructureNumber(word);
  addWeightToArray(cloneStructures, cloneStructures[structureNumber], 30);
  
  let syllable = "";
  for(let i = 1; i < choices.length; i++) {
    do {
      syllable = generateSyllable(cloneStructures);
    } while(existInArray(syllable, choices));
    
    choices[i] = syllable;
  }

  return shuffleArray(choices);
}

export const countWords = (quiz) => {
  let count = 0;
  for(let i = 0; i < quiz.level.length; i++) {
      count += quiz.level[i].length;
  }
  return count;
}

export const countProgressLevelWords = (quiz, currentLevel) => {
  let count = 0;
  for(let i = 0; i < currentLevel; i++) {
      count += quiz.level[i].length;
  }
  return count;
}

export const countProgressWords = (quizzes, user) => {
  let count = 0;
  for(let i = 0; i < quizzes.length; i++) {
    count += countProgressLevelWords(quizzes[i], user.quiz[i].level);
  }
  return count;
}