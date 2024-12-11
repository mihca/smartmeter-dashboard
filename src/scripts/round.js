export function round1Digit (number) {
    return Math.round(number * 10) / 10
}

export function round2Digits (number) {
    return Math.round(number * 100) / 100
}

export function round3Digits (number) {
    return Math.round(number * 1000) / 1000
}

export function formatEUR (number) {
    return Math.round(number * 100) / 100 + " EUR"
}
