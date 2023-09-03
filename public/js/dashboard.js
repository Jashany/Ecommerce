 /*   // Array of paragraphs and video URLs
    const paragraphs = [
        "TrulyMadly Faces Data Breach Allegations - User Trust Plummets Amidst Privacy Scandal!",
        "Grindr Launches Innovative AI-Driven Safety Features, Redefining Online Dating Security The company's latest innovations include real-time photo verification, advanced profile authenticity checks, and an improved harassment detection system.",
        "Tinder's 'Climate Match' Feature Sparks Romance for Eco-Conscious Daters"
    ];

    const videos = [
        "/videos/video.mp4",
        "/videos/video2.mp4",
        "/videos/video3.mp4"
    ];

    const rate = [
        15,20,30
    ];

    let currentIndex = 0;
    let resultMoney = 0;
   
let timerInterval;



    // Function to update the content
    function updateContent() {
        document.getElementById("paragraph").textContent = paragraphs[currentIndex];
        document.getElementById("videoElement").src = videos[currentIndex];
        clearInterval(timerInterval);
    }

    // Function to handle the "Next" button click
    document.getElementById("nex-button").addEventListener("click", function() {
        // Increment the index
        currentIndex++;

        // Check if we've reached the end of the content
        if (currentIndex >= paragraphs.length) {
            currentIndex = 0; // Loop back to the beginning
        }

        // Update the content
        updateContent();
    });


    const calculateResultMoney = (betOption) => {
        const betAmount = parseFloat(document.getElementById('betAmount').value); // Get the user's input bet amount
        
        
        const startingPrice = [10, 20, 30];
        const endingPrice = [50, 60, 70];
        const currentIndex = 0; // You should determine the correct index based on your logic
        
        const percentageprice = (Math.abs(endingPrice[currentIndex] - startingPrice[currentIndex])) / startingPrice[currentIndex] * 100;
        
        if (betOption === 'low') {
            if (endingPrice[currentIndex] < startingPrice[currentIndex]) {
                resultMoney = betAmount + ((betAmount * percentageprice) / 100);
            } else {
                resultMoney = betAmount - ((betAmount * percentageprice) / 100);
            }
        } else if (betOption === 'up') {
            if (endingPrice[currentIndex] > startingPrice[currentIndex]) {
                resultMoney = betAmount + ((betAmount * percentageprice) / 100);
            } else {
                resultMoney = betAmount - ((betAmount * percentageprice) / 100);
            }
        }
        const lowButton = document.getElementById('up-button');
        const highButton = document.getElementById('down-button');
        //document.getElementById('resultMoney').innerText = resultMoney.toFixed(2); // Display result money with 2 decimal places
        lowButton.disabled = true;
        highButton.disabled = true;
        startTimer();
    }

    console.log(resultMoney)

    function startTimer() {
        let seconds = 0;
        timerInterval = setInterval(function () {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            document.getElementById('timer').textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        }, 1000);
    }
    
    function resetbutton() {
        clearInterval(timerInterval); // Clear the timer interval
        const lowButton = document.getElementById('up-button');
        const highButton = document.getElementById('down-button');
        lowButton.disabled = false;
        highButton.disabled = false;
        const inputField = document.getElementById('betAmount');
        inputField.value = '';
        document.getElementById('timer').textContent = '0:00'; // Reset the timer display
        console.log(resultMoney)
    }
    // Initial content update
    updateContent();
*/

    const paragraphs = [
        "Amazon Unveils Groundbreaking 'MindLink' Technology, Promising Instant Connection Between Shoppers and Products" ,
        "Shopify Unveils Groundbreaking Virtual Shopping Experience: 'ShopifyVerse'",
        "PayPal Unveils Cryptocurrency Integration, Shaking Financial Landscape"
    ];
    
    const videos = [
        "/videos/video1.mp4",
        "/videos/video2.mp4",
        "/videos/video3.mp4"
    ];
    
    const rate = [
        15, 20, 30
    ];
    
    let currentIndex = 0;
    let resultMoney = 0;
    let totalPoints = 10000;
    let timerInterval;
    
    function updateContent() {
        document.getElementById("paragraph").textContent = paragraphs[currentIndex];
        let video = document.getElementById("videoElement");
        video.src = videos[currentIndex];
        clearInterval(timerInterval); // Clear previous timer interval
        document.getElementById('resultMoney').textContent = ''; // Clear result money display
        
        fetch('/updatePoints', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ totalPoints }),
        })
        .then(response => {
            if (response.ok) {
                // Points updated successfully, you can update the UI accordingly
                // For example, display a success message or update the points on the UI.
                // You can also refresh the page to get the updated points from the server.
            } else {
                // Handle error
                console.error('Failed to update points');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
    

    document.getElementById("nex-button").addEventListener("click", function () {
        currentIndex++;
        
        
        const nextbutton = document.getElementById("nex-button")
        if(currentIndex === 2){
            nextbutton.disabled = true;
        }
        updateContent();
    });
    
    function calculateResultMoney(betOption) {

        const betAmount = parseFloat(document.getElementById('betAmount').value);
        const startingPrice = [2, 1, 2];
        const endingPrice = [1,2, 1];
        
        if (betAmount < totalPoints ) {
        if (betOption === 'low') {
            if (endingPrice[currentIndex] < startingPrice[currentIndex]) {
                resultMoney = betAmount + ((betAmount * 50) / 100);
            } else {
                resultMoney = betAmount - ((betAmount * 50) / 100);
            }
        } else if (betOption === 'up') {
            if (endingPrice[currentIndex] > startingPrice[currentIndex]) {
                resultMoney = betAmount + ((betAmount*50) / 100);
            } else {
                resultMoney = betAmount - ((betAmount *50) / 100);
            }
        }
        totalPoints -= betAmount;
        const lowButton = document.getElementById('up-button');
        const highButton = document.getElementById('down-button');
        lowButton.disabled = true;
        highButton.disabled = true;

    }
    else{
        alert("You dont have enough credits");
    }
      
        
        
    
        // Start the timer when the video starts playing
        video.addEventListener('play', startTimer);
    
        // Stop the timer when the video ends
        video.addEventListener('ended', stopTimer);
        
    }
    
    function startTimer() {
        
        let seconds = 0;
        timerInterval = setInterval(function () {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            //document.getElementById('timer').textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        }, 1000);
    }
    
    function stopTimer() {
        clearInterval(timerInterval); // Stop the timer
        totalPoints += resultMoney;
        document.getElementById('resultMoney').textContent = `${resultMoney.toFixed(2)}`;
        document.getElementById('totalScore').textContent = `${totalPoints.toFixed(2)}`;
    }
    
    function resetbutton() {
        clearInterval(timerInterval); // Clear the timer interval
        const lowButton = document.getElementById('up-button');
        const highButton = document.getElementById('down-button');
        lowButton.disabled = false;
        highButton.disabled = false;
        const inputField = document.getElementById('betAmount');
        inputField.value = '';
        percentageprice = 0;
        
        //document.getElementById('timer').textContent = '0:00'; // Reset the timer display
        document.getElementById('resultMoney').textContent = ''; // Clear result money display
    }
    
    updateContent();
    