// function generateIBAN(countryCode, bankCode, accountNumber) {
//     // Check lengths
//     if (bankCode.length !== 4) throw new Error("Bank code must be 4 characters long");
//     if (accountNumber.length !== 16) throw new Error("Account number must be 16 characters long");

//     // Replace letters with corresponding numbers
//     const lettersToNumbers = {
//         A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, G: 16, H: 17,
//         I: 18, J: 19, K: 20, L: 21, M: 22, N: 23, O: 24, P: 25,
//         Q: 26, R: 27, S: 28, T: 29, U: 30, V: 31, W: 32, X: 33,
//         Y: 34, Z: 35
//     };

//     function replaceLetters(str) {
//         return str.split('').map(char => {
//             return lettersToNumbers[char] !== undefined ? lettersToNumbers[char] : char;
//         }).join('');
//     }

//     // Generate BBAN (bankCode + accountNumber)
//     const bban = bankCode + accountNumber;

//     // Generate preliminary IBAN (BBAN + country code + '00' for check digits)
//     const preliminaryIBAN = bban + countryCode + "00";

//     // Replace letters in the preliminary IBAN with numbers
//     const numericIBAN = replaceLetters(preliminaryIBAN);

//     // Calculate the remainder of numericIBAN when divided by 97
//     const remainder = BigInt(numericIBAN) % 97n;

//     // Calculate the check digits
//     const checkDigits = (98n - remainder).toString().padStart(2, '0');

//     // Generate the final IBAN
//     const iban = countryCode + checkDigits + bban;

//     return iban;
// }

// const countryCode = "RO";
// const bankCode = "PNFL";
// const accountNumber = "1234567890123456";

// const iban = generateIBAN(countryCode, bankCode, accountNumber);
// console.log(iban); // Output: The generated IBAN
