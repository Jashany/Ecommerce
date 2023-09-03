let startingPriceValue = 0;
let endingPriceValue = 0;
let isTrading = false;
let totalScore = 1000;

const generateFakeChartData = () => {
    const data = [51, 57, 55, 56, 59, 53, 51, 52, 59, 58, 51, 57, 55, 54, 53, 57, 58, 57, 57, 51, 51, 53, 56, 53, 59, 54, 52, 59, 55, 58, 56, 55, 54, 55, 59, 51, 53, 59, 58, 52, 53, 52, 53, 57, 52, 51, 55, 58, 51, 59, 56, 56, 55, 57, 58, 56, 57, 53, 56, 52, 56, 51, 54];

    return data;
};

/*const updateFakeChartData = (data) => {
    const priceFluctuation = 5;
    const latestPrice = parseFloat(data[data.length - 1]);

    // Simulate price fluctuations using random values
    const newPrice = latestPrice + Math.random() * priceFluctuation * 2 - priceFluctuation;
    data.push(newPrice.toFixed(2));

    // Limit the data to a fixed number of data points for better performance
    const maxDataPoints = 60;
    if (data.length > maxDataPoints) {
        data.shift();
    }

    return data;
};
*/


const updateChart = (tradingChart, secondsElapsed) => {
    if (secondsElapsed >= 60) {
        clearInterval(interval);
        document.getElementById('timer').innerText = 'Time is up!';
        document.getElementById('endingPrice').innerText = tradingChart.data.datasets[0].data[59];
        isTrading = false;
    } else {
        if (secondsElapsed === 1) {
            startingPriceValue = tradingChart.data.datasets[0].data[0];
            document.getElementById('startingPrice').innerText = startingPriceValue;
        }
        tradingChart.data.datasets[0].data = updateFakeChartData(tradingChart.data.datasets[0].data);
        tradingChart.update();
        document.getElementById('timer').innerText = `Time Remaining: ${60 - secondsElapsed} seconds`;
    }
};



const placeBet = (betOption) => {
    if (isTrading) {
        alert('Trading is already in progress.');
        return;
    }

    const betAmount = parseFloat(document.getElementById('betAmount').value);
    if (isNaN(betAmount) || betAmount <= 0) {
        alert('Please enter a valid bet amount greater than 0.');
        return;
    }

    isTrading = true;
    document.getElementById('startingPrice').innerText = '-';
    document.getElementById('endingPrice').innerText = '-';
    document.getElementById('resultMoney').innerText = '-'; // Add result money display element
    document.getElementById('timer').innerText = 'Time Remaining: 60 seconds';
    const chartData = generateFakeChartData();

    const ctx = document.getElementById('trading-chart').getContext('2d');
    const tradingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: chartData.length }, (_, i) => i + 1),
            datasets: [{
                label: 'Asset Price',
                data: chartData,
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: true
                }
            }
        }
    });

    let secondsElapsed = 0;
    interval = setInterval(() => {
        secondsElapsed++;
        if (secondsElapsed >= 60) {
            clearInterval(interval);
            document.getElementById('timer').innerText = 'Time is up!';
            document.getElementById('endingPrice').innerText = tradingChart.data.datasets[0].data[59];
            calculateResultMoney(tradingChart, betOption, betAmount); // Calculate and display result money
            isTrading = false;
        } else {
            if (secondsElapsed === 1) {
                startingPriceValue = tradingChart.data.datasets[0].data[0];
                document.getElementById('startingPrice').innerText = startingPriceValue;
            }
            tradingChart.data.datasets[0].data = updateFakeChartData(tradingChart.data.datasets[0].data);
            tradingChart.update();
            document.getElementById('timer').innerText = `Time Remaining: ${60 - secondsElapsed} seconds`;
        }
    }, 1000);

    setTimeout(() => {
        if (isTrading) {
            alert('Time is up! Your bet was not placed.');
            clearInterval(interval);
            document.getElementById('timer').innerText = 'Time is up!';
            document.getElementById('endingPrice').innerText = tradingChart.data.datasets[0].data[59];
            calculateResultMoney(tradingChart, betOption, betAmount); // Calculate and display result money
            isTrading = false;
        }
    }, 60000);
};

// Function to start trading
const startTrading = () => {
    if (isTrading) {
        alert('Trading is already in progress.');
        return;
    }

    isTrading = true;
    document.getElementById('startingPrice').innerText = '-';
    document.getElementById('endingPrice').innerText = '-';
    document.getElementById('timer').innerText = 'Time Remaining: 60 seconds';
    const chartData = generateFakeChartData();

    const ctx = document.getElementById('trading-chart').getContext('2d');
    const tradingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: chartData.length }, (_, i) => i + 1),
            datasets: [{
                label: 'Asset Price',
                data: chartData,
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: true
                }
            }
        }
    });

    let secondsElapsed = 0;
    interval = setInterval(() => {
        secondsElapsed++;
        updateChart(tradingChart, secondsElapsed);
    }, 1000);
};

const calculateResultMoney = (tradingChart, betOption, betAmount) => {
    const startingPrice = parseFloat(startingPriceValue);
    const endingPrice = parseFloat(tradingChart.data.datasets[0].data[59]);
    const percentageprice = (Math.abs(endingPrice - startingPrice)) / startingPrice * 100;
    let resultMoney = 0;
    console.log(betOption);

    if (betOption === 'low') {
        if (endingPrice < startingPrice) {
            resultMoney = betAmount + ((betAmount * percentageprice) / 100); // Double the bet amount if the ending price is lower
        } else {
            resultMoney = betAmount - ((betAmount * percentageprice) / 100); // Lose the bet amount if the ending price is higher
        }
    } else if (betOption === 'up') {
        if (endingPrice > startingPrice) {
            resultMoney = betAmount + ((betAmount * percentageprice) / 100); // Double the bet amount if the ending price is higher
        } else {
            resultMoney = betAmount - ((betAmount * percentageprice) / 100); // Lose the bet amount if the ending price is lower
        }
    }

    document.getElementById('resultMoney').innerText = resultMoney.toFixed(2);
};