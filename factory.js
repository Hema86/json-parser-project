'use strict'
let fs = require('fs')

let data = fs.readFileSync('input.json', 'utf-8')
// console.log(data)
data = data.toString()
//  console.log(data)
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
  let regEx = /^-?(0|[\d1-9]\d*)(\.\d+)?(?:[Ee][+-]?\d+)?/
  let result = str.match(regEx)
  if (result !== null) return [result[0] * 1, str.slice(result[0].length, str.length)]
  else return null
}

function stringParser (str) {
  // console.log(str)
  if (!str.startsWith('"')) return null
  str = str.slice(1, str.length)
  let result = ''; let remains
  if (str.startsWith('"')) return [result, str.slice(result.length + 1, str.length)]
  for (let i = 0; i < str.length - 1; i++) {
    if (str.charAt(i) === '\\') {
      if (remains === undefined) remains = str.slice(1, str.length)
      else remains = remains.slice(1, remains.length)
      if (str.charAt(i + 1) === '\\') {
        result += '\\'
        remains = remains.slice(1, remains.length)
        i += 2
      } else if (str.charAt(i + 1) === '"') {
        result += '"'
        remains = remains.slice(1, remains.length)
        i += 2
      } else if (str.charAt(i + 1) === '/') {
        result += '/'
        remains = remains.slice(1, remains.length)
        i += 2
      } else if (str.charAt(i + 1) === 'n') {
        result += '\n'
        remains = remains.slice(1, remains.length)
        i += 2
      } else if (str.charAt(i + 1) === 'f') {
        result += '\f'
        remains = remains.slice(1, remains.length)
        i += 2
      } else if (str.charAt(i + 1) === 'r') {
        result += '\r'
        remains = remains.slice(1, remains.length)
        i += 2
      } else if (str.charAt(i + 1) === 't') {
        result += '\t'
        remains = remains.slice(1, remains.length)
        i += 2
      } else if (str.charAt(i + 1) === 'b') {
        result += '\b'
        remains = remains.slice(1, remains.length)
        i += 2
      } else if (str.charAt(i + 1) === 'u') {
        result += '\\'
        for (let k = 0; k < 5; k++) {
          result += remains[k]
        }
        remains = remains.slice(5, remains.length)
        i += 6
      } else return null
    }
    if (str.charAt(i) === '"') break
    else result += str.charAt(i)
    if (remains === undefined) remains = str.slice(1, str.length)
    else remains = remains.slice(1, remains.length)
  }
  // return result
  return [result, remains.slice(1, remains.length)]
}

function spaceParser (str) {
  let regex = /^\s+/
  str = str.replace(regex, '')
  return str
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
  let result = []
  while (!str.startsWith(']')) {
    str = spaceParser(str)
    let valResult = valueParser(str)
    if (valResult === null) return null
    result.push(valResult[0])
    str = spaceParser(valResult[1])
    if (!str.startsWith(',')) {
      str = spaceParser(str)
      if (!str.startsWith(']')) return null
      continue
    }
    str = str.slice(1, str.length)
    if (str.startsWith(']')) return null
  }

  let remains = str.slice(1, str.length)
  return [result, remains]
}

function objectParser (str) {
  if (!str.startsWith('{')) return null
  str = str.slice(1, str.length)
  let result = {}
  // if (!str.includes('}')) return null
  while (!str.startsWith('}')) {
    str = spaceParser(str)
    let key = stringParser(str)
    if (key === null) return null
    str = spaceParser(key[1])
    // str = key[1].slice(1, str.length)
    if (!str.startsWith(':')) return null
    str = str.slice(1, str.length)
    str = spaceParser(str)
    let value = valueParser(str)
    if (value === null) return null
    result[key[0]] = value[0]
    str = spaceParser(value[1])
    if (!str.startsWith(',')) {
      str = spaceParser(str)
      if (!str.startsWith('}')) return null
      continue
    }
    str = str.slice(1, str.length)
    if (str.startsWith('}')) return null
  }
  return [result, str.slice(1, str.length)]
}

function factoryParser (parsers) {
  return function specificParser (str) {
    for (let parser of parsers) {
      if (parser(str) !== null) {
        return parser(str)
      }
    }
    return null
  }
}
let valResult = valueParser('[,1,2]')
console.log(JSON.stringify(valResult))
// let factoryResult = factoryParser([nullParser, booleanParser, numberParser, stringParser, arrayParser, objectParser])(data)
// console.log(JSON.stringify(factoryResult))
