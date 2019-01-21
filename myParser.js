'use strict'
function nullParser (str) {
  if (str.startsWith('null')) return [null, str.slice(4, str.length)]
  else return null
}

function booleanParser (str) {
  if (str.startsWith('true')) {
    return [true, str.slice(4, str.length)]
  } else if (str.startsWith('false')) {
    return [false, str.slice(5, str.length)]
  } else return null
}

function numberParser (str) {
  let regEx = /^-?\d*\.?\d+(?:[Ee][+-]?\d+)?/
  let result = str.match(regEx)
  if (result !== null) return [result[0] * 1, str.slice(result[0].length, str.length)]
  else return null
}

function stringParser (str) {
  console.log(str)
  if (!str.startsWith('"')) return null
  str = str.slice(1, str.length)
  // if (str.startsWith('"')) return ['', '']
  let result = ''
  if (str.startsWith('\\')) {
    str = str.slice(1, str.length)
    if (str.startsWith('\\')) {
      result += '\\'
    }
    if (str.startsWith('"')) {
      result += '"'
    }
    if (str.startsWith('/')) {
      result += '/'
    }
    if (str.startsWith('n')) {
      result += '\n'
    }
    if (str.startsWith('f')) {
      result += '\f'
    }
    if (str.startsWith('r')) {
      result += '\r'
    }
    if (str.startsWith('t')) {
      result += '\t'
    }
    if (str.startsWith('b')) {
      result += '\b'
    }
  } else {
    for (let val of str) {
      if (val !== '"') { result += val }
      // result += val
    }
  }
  return [result, '']
  // return result
}

function spaceParser (str) {
  if (str.startsWith(' ')) return str.slice(1, str.length)
  else return str
}

function valueParser (str) {
  let parserArr = [nullParser, booleanParser, numberParser, stringParser, arrayParser, objectParser]
  for (let parser of parserArr) {
    let result = parser(str)
    if (result !== null) return result
  }
  return null
}

function arrayParser (str) {
  if (!str.startsWith('[')) return null
  str = str.slice(1, str.length)
  str = spaceParser(str)
  let result = []
  while (!str.startsWith(']')) {
    str = spaceParser(str)
    let valResult = valueParser(str)
    if (valResult === null) return null
    result.push(valResult[0])
    if (valResult[1].startsWith(',')) {
      str = valResult[1].slice(1, str.length)
      str = spaceParser(str)
      if (str.startsWith(']')) return null
    } else str = valResult[1]
    str = spaceParser(str)
  }
  let remains = str.slice(1, str.length)
  return [result, remains]
}

function objectParser (str) {
  if (!str.startsWith('{')) return null
  str = str.slice(1, str.length)
  str = spaceParser(str)
  let result = {}
  if (!str.includes('}')) return null
  while (!str.startsWith('}')) {
    let key = valueParser(str)
    if (key === null) return null
    if (!key[1].startsWith(':')) return null
    str = key[1].slice(1, str.length)
    str = spaceParser(str)
    let value = valueParser(str)
    if (value === null) return null
    result[key[0]] = value[0]
    if (value[1].startsWith(',')) {
      str = value[1].slice(1, str.length)
      str = spaceParser(str)
      if (str.startsWith('}')) return null
    } else str = value[1]
    str = spaceParser(str)
  }
  return [result, str.slice(1, str.length)]
}

// let spaceResult = spaceParser(' 1 2 3 ')
// console.log(spaceResult)
// let objResult = objectParser('{"id":123}')
// console.log(JSON.stringify(objResult))
// let valResult = valueParser('1,2]]')
// console.log(valResult)
// let arrResult = arrayParser('[]')
// console.log(JSON.stringify(arrResult))
// let nullResult = nullParser('null1')
// console.log(nullResult)
// let boolResult = booleanParser('false')
// console.log(boolResult)
// let numResult = numberParser('123')
// console.log(numResult)
let strResult = stringParser('"ab\n"')
console.log(strResult)
