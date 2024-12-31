import { ellipse } from "motion/react-client"

export function round1Digit (number) {
    return Math.round(number * 10) / 10
}

export function round2Digits (number) {
    return Math.round(number * 100) / 100
}

export function round3Digits (number) {
    return Math.round(number * 1000) / 1000
}

export function format1Digit (number) {
    if (isNaN(number)) 
        return "-"
    else
        return number.toFixed(1);
}

export function formatEUR (number) {
    if (isNaN(number)) 
        return "-"
    else
        return (Math.round(number * 100) / 100).toFixed(2) + " EUR"
}
