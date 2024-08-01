import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';

export async function exchange(to: string, from: string, amount: number): Promise<number> {
    try {
        // Fetch the exchange rates
        const response = await fetch('https://www.bnr.ro/nbrfxrates.xml');

        // Check if the response was successful
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }

        // Convert the XML response to JSON
        const xml = await response.text();
        const result = await parseStringPromise(xml, {
            mergeAttrs: true,
            explicitArray: false,
            tagNameProcessors: [(name) => name.replace(/.*:/, '')]  // Remove namespace prefixes
        });

        // Get the rates
        const ratesList = result.DataSet.Body.Cube.Rate;
        const ratesMap: { [key: string]: number } = {};
        ratesList.forEach((rate: any) => {
            const currency = rate.currency;
            const value = parseFloat(rate._);
            const multiplier = rate.multiplier ? parseFloat(rate.multiplier) : 1;
            ratesMap[currency] = value / multiplier;
        });

        // Calculate the exchange
        const fromRate = ratesMap[from];
        const toRate = ratesMap[to];

        // Check if the currencies are valid
        if (!fromRate || !toRate) {
            throw new Error('Invalid currency');
        }

        const exchangeRate = toRate / fromRate;
        const exchangedAmount = amount * exchangeRate;

        return exchangedAmount;
    } catch (error) {
        // Handle the error
        console.error('An error occurred:', error);
        throw error;
    }
}
