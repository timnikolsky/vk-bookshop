export default function plural(
    num: number, 
    firstForm: string, 
    secondForm: string,
    thirdForm: string
) {
    if(num % 10 === 1 && num % 100 !== 11)
        return firstForm
    else if(num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20))
        return secondForm
    else
        return thirdForm
}