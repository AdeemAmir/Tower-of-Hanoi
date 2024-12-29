export const hanSol = (nDiscs) => {
  const x = []
  const hanoi = (n, origin, destiny, aux) => {
    if (n == 1) {
      // Base case: If there's only one disc, move it directly to destiny
      x.push({ disc: n, origin, destiny })
      return;
    }
    // move n - 1 discs from origin to aux, say destiny as an aux peg
    hanoi(n - 1, origin, aux, destiny)
    // Move the nth disc from origin to destiny
    x.push({ disc: n, origin, destiny })
    // Move n - 1 discs from aux to destiny, say origin as an aux peg
    hanoi(n - 1, aux, destiny, origin)
  }
  hanoi(nDiscs, 0, 2, 1)
  return x;
}