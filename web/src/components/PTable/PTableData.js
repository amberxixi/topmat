let symbols = ['',
  'H', 'He',
  'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
  'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar',
  'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr',
  'Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe',
  'Cs', 'Ba',
  'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu',
  'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn',
  'Fr', 'Ra',
  'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr',
  'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn'
]

let masses = [
  1.0, 1.008, 4.002602, 6.94,
  9.0121831, 10.81, 12.011, 14.007,
  15.999, 18.99840316, 20.1797, 22.98976928,
  24.305, 26.9815385, 28.085, 30.973762,
  32.06, 35.45, 39.948, 39.0983,
  40.078, 44.955908, 47.867, 50.9415,
  51.9961, 54.938044, 55.845, 58.933194,
  58.6934, 63.546, 65.38, 69.723,
  72.63, 74.921595, 78.971, 79.904,
  83.798, 85.4678, 87.62, 88.90584,
  91.224, 92.90637, 95.95, 97.90721,
  101.07, 102.9055, 106.42, 107.8682,
  112.414, 114.818, 118.71, 121.76,
  127.6, 126.90447, 131.293, 132.90545196,
  137.327, 138.90547, 140.116, 140.90766,
  144.242, 144.91276, 150.36, 151.964,
  157.25, 158.92535, 162.5, 164.93033,
  167.259, 168.93422, 173.054, 174.9668,
  178.49, 180.94788, 183.84, 186.207,
  190.23, 192.217, 195.084, 196.966569,
  200.592, 204.38, 207.2, 208.9804,
  208.98243, 209.98715, 222.01758, 223.01974,
  226.02541, 227.02775, 232.0377, 231.03588,
  238.02891, 237.04817, 244.06421, 243.06138,
  247.07035, 247.07031, 251.07959, 252.083,
  257.09511, 258.09843, 259.101, 262.11,
  267.122, 268.126, 271.134, 270.133,
  269.1338, 278.156, 281.165, 281.166,
  285.177, 286.182, 289.19, 289.194,
  293.204, 293.208, 294.214 ]

let elements = {}
symbols.forEach((symbol, i) => {
  elements[symbol] = {
    ind: i,
    symbol: symbol,
    mass: masses[i]
  }
})

function symbolToObj (symbol) {
  return elements[symbol]
}

function indToObj (i) {
  return {
    ind: i,
    symbol: symbols[i],
    mass: masses[i]}
}

let cells = []
let i = 1
cells.push(indToObj(i))
i++
for (let j = 0; j < 16; j++) {
  cells.push(null)
}
for (let j = 0; j < 3; j++) {
  cells.push(indToObj(i))
  i++
}
for (let j = 0; j < 10; j++) {
  cells.push(null)
}
for (let j = 0; j < 8; j++) {
  cells.push(indToObj(i))
  i++
}
for (let j = 0; j < 10; j++) {
  cells.push(null)
}
for (let j = 0; j < 44; j++) {
  cells.push(indToObj(i))
  i++
}
cells.push({ind: '57-71', symbol: 'La-Lu'})
i = 72
for (let j = 0; j < 17; j++) {
  cells.push(indToObj(i))
  i++
}
cells.push({ind: '89-103', symbol: 'Ac-Lr'})
i = 104
for (let j = 0; j < 9; j++) {
  cells.push({ind: i, symbol: symbols[i]})
  i++
}
for (let j = 0; j < 6; j++) {
  cells.push(null)
}
i = 57
for (let j = 0; j < 15; j++) {
  cells.push(indToObj(i))
  i++
}
for (let j = 0; j < 3; j++) {
  cells.push(null)
}
i = 89
for (let j = 0; j < 15; j++) {
  cells.push(indToObj(i))
  i++
}
for (let j = 0; j < 3; j++) {
  cells.push(null)
}

export {cells, symbolToObj}
