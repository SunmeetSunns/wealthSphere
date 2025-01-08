// Function to assess risk based on cryptocurrency data
function assessRisk(crypto) {
    // Calculate gain/loss percentage
    const gainLoss = crypto.currentValue - crypto.purchasePrice;
    const percentageChange = (gainLoss / crypto.purchasePrice) * 100;

    // Initialize risk level
    let riskLevel;

    // Determine risk level based on percentage change
    if (percentageChange < -20) {
        riskLevel = 'High Risk'; // Significant loss
    } else if (percentageChange >= -20 && percentageChange <= 10) {
        riskLevel = 'Moderate Risk'; // Small loss or small gain
    } else {
        riskLevel = 'Low Risk'; // Significant gain
    }

    // Additional checks for cryptocurrency type
    if (crypto.type === 'altcoin' && percentageChange < 0) {
        riskLevel = 'Very High Risk'; // Altcoins may be riskier
    }

    // Optional: Check exposure based on quantity and current value
    const exposure = crypto.quantity * crypto.currentValue;
    const threshold = 10000; // Example threshold for exposure

    if (exposure > threshold) {
        riskLevel += ' - High Exposure Risk'; // High exposure based on quantity
    }

    // Return the assessment result
    return {
        orderId: crypto.orderId,
        type: crypto.type,
        currentValue: crypto.currentValue,
        purchasePrice: crypto.purchasePrice,
        percentageChange: percentageChange.toFixed(2) + ' %',
        riskLevel: riskLevel
    };
}

const Crypto = require('../models/cryptoCurrency');
const stocks = require('../models/stocks');
const Cash = require('../models/cash')
const FD=require('../models/fd')
exports.getAllCryptoRiskAssessment = async (req, res) => {
    try {
        // Fetch all cryptocurrencies from the database
        const cryptos = await Crypto.find();

        // Array to hold individual risk assessments
        const riskAssessments = [];
        let totalGainLoss = 0;
        let totalExposure = 0;

        // Loop through each cryptocurrency to assess risk
        cryptos.forEach(crypto => {
            const assessment = assessRisk(crypto);
            riskAssessments.push(assessment);

            // Aggregate total gain/loss and total exposure for overall risk
            totalGainLoss += (crypto.currentValue - crypto.purchasePrice) * crypto.quantity;
            totalExposure += crypto.quantity * crypto.currentValue;
        });

        // Calculate overall risk assessment
        let overallRiskLevel;
        const overallPercentageChange = (totalGainLoss / totalExposure) * 100;

        if (overallPercentageChange < -20) {
            overallRiskLevel = 'High Risk';
        } else if (overallPercentageChange >= -20 && overallPercentageChange <= 10) {
            overallRiskLevel = 'Moderate Risk';
        } else {
            overallRiskLevel = 'Low Risk';
        }

        // Optional: Include overall exposure level
        const overallExposureThreshold = 10000; // Example threshold
        if (totalExposure > overallExposureThreshold) {
            overallRiskLevel += ' - High Overall Exposure Risk';
        }

        // Respond with individual assessments and overall assessment
        res.status(200).json({
            individualAssessments: riskAssessments,
            overallAssessment: {
                totalExposure: totalExposure,
                totalGainLoss: totalGainLoss,
                overallRiskLevel: overallRiskLevel
            }
        });

    } catch (error) {
        console.error('Error fetching cryptocurrencies:', error);
        res.status(500).json({ error: 'An error occurred while fetching cryptocurrencies.' });
    }
};

function assessStockRisk(stock) {
    // Calculate gain/loss percentage
    const gainLoss = stock.currentPrice - stock.purchasePrice;
    const percentageChange = (gainLoss / stock.purchasePrice) * 100;

    // Initialize risk level
    let riskLevel;

    // Determine risk level based on percentage change
    if (percentageChange < -20) {
        riskLevel = 'High Risk'; // Significant loss
        svg='/assets/stock-up.svg'
    } else if (percentageChange >= -20 && percentageChange <= 10) {
        riskLevel = 'Moderate Risk'; // Small loss or small gain
    } else {
        riskLevel = 'Low Risk'; // Significant gain
        svg='assets/stock-down.svg'
    }

    return {
        orderId: stock.orderId,
        stock: stock.company,
        symbol: stock.symbol,
        currentValue: stock.currentPrice,
        purchasePrice: stock.purchasePrice,
        percentageChange: percentageChange.toFixed(2) + ' %',
        riskLevel: riskLevel,
        svg:svg
    };
}

const Stock = require('../models/stocks')
exports.getAllStockRiskAssessment = async (req, res) => {
    try {
        const stock = await Stock.find()
        const riskAssessments = [];
        let totalGainLoss = 0;

        stock.forEach(stock => {
            const assessment = assessStockRisk(stock)
            riskAssessments.push(assessment)
            totalGainLoss += (stock.currentPrice - stock.purchasePrice) * stock.quantity
        })
        res.status(200).json({
            individualAssessments: riskAssessments,
            overallAssessment: {
                totalGainLoss: totalGainLoss,
            }
        });
    }
    catch (err) {
        console.error('Error fetching stocks:', err);
        res.status(500).json({ error: 'An error occurred while fetching stocks.' });
    }
}
exports.getCashSummary = async (req, res) => {
    try {
        const cashData = await Cash.find();
        const currencySummary = [];
        let totalAmountInINR = 0;

        // Group by currency and calculate totals
        cashData.forEach(cash => {
            // Find if the currency is already added to the summary
            let currencyItem = currencySummary.find(item => item.currency === cash.currency);

            if (!currencyItem) {
                // Add a new currency entry if not present
                currencyItem = {
                    currency: cash.currency,
                    svg: cash.svg_url,
                    symbol: cash.symbol,
                    totalAmount: 0,
                    totalAmountInINR: 0,
                };
                currencySummary.push(currencyItem);
            }

            // Update totals for the currency
            currencyItem.totalAmount += cash.amount;
            currencyItem.totalAmountInINR += cash.amountinINR;

            // Update overall INR total
            totalAmountInINR += cash.amountinINR;
        });

        // Send the response
        res.status(200).json({
            currencySummary,
            overallSummary: {
                totalAmountInINR,
            },
        });
    } catch (err) {
        console.error('Error fetching cash data:', err);
        res.status(500).json({ error: 'An error occurred while fetching cash data.' });
    }
};
exports.getMaturityScheduleByBank = async (req, res) => {
    try {
        // Fetch all FDs from the database
        const fdData = await FD.find();

        // Prepare an object to store maturity data grouped by bank
        const maturityScheduleByBank = {};

        // Iterate over each FD and group by bank
        fdData.forEach(fd => {
            const bankName = fd.bankName;
            const maturityMonth = new Date(fd.maturityDate).toLocaleString('default', {
                month: 'long',
                year: 'numeric',
            });

            // Calculate the maturity amount
            const maturityAmount = fd.depositAmount + (fd.depositAmount * fd.interestRate / 100 * fd.tenure / 12);

            // Initialize the bank entry if not already present
            if (!maturityScheduleByBank[bankName]) {
                maturityScheduleByBank[bankName] = {};
            }

            // Initialize the maturityMonth entry for the bank if not present
            if (!maturityScheduleByBank[bankName][maturityMonth]) {
                maturityScheduleByBank[bankName][maturityMonth] = {
                    maturityMonth,
                    numberOfFDs: 0,
                    totalDepositAmount: 0,
                    totalMaturityAmount: 0,
                };
            }

            // Update the maturity data for the specific bank and maturityMonth
            maturityScheduleByBank[bankName][maturityMonth].numberOfFDs += 1;
            maturityScheduleByBank[bankName][maturityMonth].totalDepositAmount += fd.depositAmount;
            maturityScheduleByBank[bankName][maturityMonth].totalMaturityAmount += maturityAmount;
        });

        // Convert the object into an array for better frontend handling
        const formattedMaturitySchedule = [];

        // Convert each bank's maturity data into an array format
        for (const bankName in maturityScheduleByBank) {
            const bankData = maturityScheduleByBank[bankName];
            const bankMaturityReport = {
                bankName,
                maturityDetails: Object.values(bankData),
            };
            formattedMaturitySchedule.push(bankMaturityReport);
        }

        // Send the response
        res.status(200).json({
            success: true,
            data: formattedMaturitySchedule,
        });
    } catch (err) {
        console.error('Error generating maturity schedule report by bank:', err);
        res.status(500).json({ error: 'An error occurred while generating the report.' });
    }
};

