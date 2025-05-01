document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const reviewTextArea = document.getElementById('reviewText');
    const productUrlInput = document.getElementById('productUrl');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const scrapeBtn = document.getElementById('scrapeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const clearUrlBtn = document.getElementById('clearUrlBtn');
    const analysisResults = document.getElementById('analysisResults');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const noAnalysisMsg = document.getElementById('noAnalysisMsg');
    const errorCard = document.getElementById('errorCard');
    const errorMessage = document.getElementById('errorMessage');
    
    // Sample review buttons
    const sampleBtn1 = document.getElementById('sampleBtn1');
    const sampleBtn2 = document.getElementById('sampleBtn2');
    const sampleBtn3 = document.getElementById('sampleBtn3');
    
    // Sample URL buttons
    const sampleUrl1 = document.getElementById('sampleUrl1');
    const sampleUrl2 = document.getElementById('sampleUrl2');
    const sampleUrl3 = document.getElementById('sampleUrl3');
    
    // Analysis result elements
    const sentimentIcon = document.getElementById('sentimentIcon');
    const sentimentText = document.getElementById('sentimentText');
    const scoreValue = document.getElementById('scoreValue');
    const summaryText = document.getElementById('summaryText');
    const keyPointsList = document.getElementById('keyPointsList');
    const strengthsList = document.getElementById('strengthsList');
    const weaknessesList = document.getElementById('weaknessesList');
    const improvementsList = document.getElementById('improvementsList');
    const reviewTextContainer = document.getElementById('reviewTextContainer');
    const productNameDisplay = document.getElementById('productNameDisplay');
    const fullReviewText = document.getElementById('fullReviewText');
    
    // Sample reviews
    const sampleReviews = [
        "I absolutely love this smartphone! The camera quality is exceptional, taking crystal clear photos even in low light. Battery life lasts all day even with heavy usage. The processor is lightning fast and handles multitasking with ease. My only complaint is that it heats up a bit when playing graphics-intensive games. Overall, it's definitely worth the premium price for such a high-quality device.",
        
        "This coffee maker is terrible. It broke after just two weeks of use. The water reservoir leaks, and the coffee tastes burnt no matter what settings I use. Customer service was unhelpful when I tried to get a replacement. I would not recommend this product to anyone - save your money and buy a different brand.",
        
        "The wireless earbuds are decent for the price. Sound quality is good but not outstanding. I appreciate the long battery life and comfortable fit. They stay in place during workouts which is a big plus. The touch controls can be a bit finicky sometimes, and the case feels somewhat cheap. For the mid-range price point, they offer good value, but don't expect premium audio quality."
    ];
    
    // Sample URLs (selected for their scraping compatibility)
    const sampleUrls = [
        "https://blog.mozilla.org/en/products/firefox/firefox-privacy-unique-browser/",
        "https://en.wikipedia.org/wiki/Smartphone",
        "https://www.theverge.com/23637700/sony-wh-1000xm5-headphones-review"
    ];
    
    // Event listeners for sample review buttons
    sampleBtn1.addEventListener('click', function() {
        reviewTextArea.value = sampleReviews[0];
    });
    
    sampleBtn2.addEventListener('click', function() {
        reviewTextArea.value = sampleReviews[1];
    });
    
    sampleBtn3.addEventListener('click', function() {
        reviewTextArea.value = sampleReviews[2];
    });
    
    // Event listeners for sample URL buttons
    sampleUrl1.addEventListener('click', function() {
        productUrlInput.value = sampleUrls[0];
    });
    
    sampleUrl2.addEventListener('click', function() {
        productUrlInput.value = sampleUrls[1];
    });
    
    sampleUrl3.addEventListener('click', function() {
        productUrlInput.value = sampleUrls[2];
    });
    
    // Clear button functionality
    clearBtn.addEventListener('click', function() {
        reviewTextArea.value = '';
        hideResults();
        hideError();
    });
    
    // Clear URL button functionality
    clearUrlBtn.addEventListener('click', function() {
        productUrlInput.value = '';
        hideResults();
        hideError();
    });
    
    // Analyze button functionality
    analyzeBtn.addEventListener('click', function() {
        const reviewText = reviewTextArea.value.trim();
        
        if (!reviewText) {
            showError('Please enter a product review to analyze.');
            return;
        }
        
        // Hide any previous results or errors
        hideResults();
        hideError();
        
        // Show loading indicator
        loadingIndicator.classList.remove('d-none');
        loadingIndicator.querySelector('p').textContent = "Analyzing review... Please wait.";
        noAnalysisMsg.classList.add('d-none');
        
        // Call the analyze API
        fetch('/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ review: reviewText }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            displayAnalysisResults(data, false);
        })
        .catch(error => {
            showError('Error analyzing review: ' + error.message);
        })
        .finally(() => {
            // Hide loading indicator
            loadingIndicator.classList.add('d-none');
        });
    });
    
    // Scrape and analyze button functionality
    scrapeBtn.addEventListener('click', function() {
        const productUrl = productUrlInput.value.trim();
        
        if (!productUrl) {
            showError('Please enter a product URL to analyze.');
            return;
        }
        
        // Basic URL validation
        try {
            new URL(productUrl);
        } catch (e) {
            showError('Please enter a valid URL including http:// or https://');
            return;
        }
        
        // Hide any previous results or errors
        hideResults();
        hideError();
        
        // Show loading indicator
        loadingIndicator.classList.remove('d-none');
        loadingIndicator.querySelector('p').textContent = "Analyzing product from URL... This may take a moment.";
        noAnalysisMsg.classList.add('d-none');
        
        // Call the scrape API
        fetch('/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: productUrl }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            displayAnalysisResults(data, true);
        })
        .catch(error => {
            showError('Error analyzing product URL: ' + error.message);
        })
        .finally(() => {
            // Hide loading indicator
            loadingIndicator.classList.add('d-none');
        });
    });
    
    function displayAnalysisResults(data, isFromUrl) {
        // Show results container
        analysisResults.classList.remove('d-none');
        noAnalysisMsg.classList.add('d-none');
        
        // Update sentiment display
        updateSentimentDisplay(data.Sentiment);
        
        // Update score
        scoreValue.textContent = data.Score;
        
        // Update summary
        summaryText.textContent = data.Summary;
        
        // Update authenticity information if available
        if (data.AuthenticityScore !== undefined) {
            const authenticityScore = parseInt(data.AuthenticityScore);
            const isAuthentic = authenticityScore >= 70;
            let badgeText = 'Likely Authentic';
            
            if (authenticityScore < 50) {
                badgeText = 'Potentially Fake';
            } else if (authenticityScore < 70) {
                badgeText = 'Questionable Authenticity';
            } else if (authenticityScore > 90) {
                badgeText = 'Highly Authentic';
            }
            
            // Use the assessment text if provided
            const assessmentText = data.AuthenticityAssessment || 
                                  "Based on analysis of language patterns, specificity, and balance of opinions.";
                                  
            updateTrustAnalysis(isAuthentic, authenticityScore, badgeText, assessmentText);
        }
        
        // Clear and update lists
        populateList(keyPointsList, data['Key Points']);
        populateList(strengthsList, data.Strengths);
        populateList(weaknessesList, data.Weaknesses);
        populateList(improvementsList, data['Improvement Suggestions']);
        
        // Handle generated review content for URL scraping
        if (isFromUrl && data.Review && data.ProductName) {
            reviewTextContainer.classList.remove('d-none');
            productNameDisplay.textContent = data.ProductName;
            fullReviewText.textContent = data.Review;
        } else {
            reviewTextContainer.classList.add('d-none');
        }
    }
    
    function updateSentimentDisplay(sentiment) {
        sentimentText.textContent = sentiment;
        
        // Get the sentiment bar element
        const sentimentBar = document.getElementById('sentimentBar');
        
        // Update icon, color, and bar based on sentiment
        sentimentIcon.className = 'me-3 fs-1 sentiment-icon';
        
        if (sentiment.toLowerCase() === 'positive') {
            sentimentIcon.classList.add('text-success');
            sentimentIcon.innerHTML = '<i class="fas fa-face-smile"></i>';
            sentimentBar.classList.remove('bg-danger', 'bg-warning');
            sentimentBar.classList.add('bg-success');
            sentimentBar.style.width = '80%';
            
            // Update trust analysis
            updateTrustAnalysis(true, 85, 'Likely Authentic', 
                'This review appears to be written by a genuine customer based on specific details and balanced opinions.');
            
        } else if (sentiment.toLowerCase() === 'negative') {
            sentimentIcon.classList.add('text-danger');
            sentimentIcon.innerHTML = '<i class="fas fa-face-frown"></i>';
            sentimentBar.classList.remove('bg-success', 'bg-warning');
            sentimentBar.classList.add('bg-danger');
            sentimentBar.style.width = '70%';
            
            // For negative reviews, check if the score is very low (potentially fake)
            const score = parseInt(scoreValue.textContent);
            if (score < 3) {
                updateTrustAnalysis(false, 40, 'Potentially Fake', 
                    'This review shows patterns consistent with fake negative reviews - extreme criticism without specific details.');
            } else {
                updateTrustAnalysis(true, 75, 'Likely Authentic', 
                    'Despite being negative, this review appears genuine based on specific criticisms and balanced tone.');
            }
            
        } else {
            sentimentIcon.classList.add('text-warning');
            sentimentIcon.innerHTML = '<i class="fas fa-face-meh"></i>';
            sentimentBar.classList.remove('bg-success', 'bg-danger');
            sentimentBar.classList.add('bg-warning');
            sentimentBar.style.width = '50%';
            
            // Update trust analysis
            updateTrustAnalysis(true, 90, 'Highly Authentic', 
                'Neutral reviews that present both pros and cons are typically more reliable and written by actual users.');
        }
    }
    
    function updateTrustAnalysis(isAuthentic, trustScore, badgeText, detailText) {
        // Get trust analysis elements
        const trustBar = document.getElementById('trustBar');
        const authenticityBadge = document.getElementById('authenticityBadge');
        const authenticityText = document.getElementById('authenticityText');
        
        // Update trust meter
        trustBar.style.width = `${trustScore}%`;
        
        // Update badge
        authenticityBadge.textContent = badgeText;
        authenticityBadge.className = 'badge p-2';
        
        if (isAuthentic) {
            trustBar.classList.remove('bg-danger', 'bg-warning');
            trustBar.classList.add('bg-success');
            authenticityBadge.classList.add('bg-success');
        } else {
            trustBar.classList.remove('bg-success', 'bg-warning');
            trustBar.classList.add('bg-danger');
            authenticityBadge.classList.add('bg-danger');
        }
        
        // Update explanatory text
        authenticityText.textContent = detailText;
    }
    
    function populateList(listElement, items) {
        // Clear the list
        listElement.innerHTML = '';
        
        // If items is undefined or not an array, return
        if (!items || !Array.isArray(items)) {
            const li = document.createElement('li');
            li.textContent = 'No data available';
            listElement.appendChild(li);
            return;
        }
        
        // Add each item to the list
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            listElement.appendChild(li);
        });
        
        // If the array is empty
        if (items.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'None found';
            listElement.appendChild(li);
        }
    }
    
    function hideResults() {
        analysisResults.classList.add('d-none');
        noAnalysisMsg.classList.remove('d-none');
    }
    
    function showError(message) {
        errorCard.classList.remove('d-none');
        
        // Check if the error is related to scraping and URL issues
        if (message.includes('URL') || message.includes('website')) {
            // Format the error message with more details and suggestions
            let formattedMessage = message;
            
            // Add suggestion to try sample URLs if they're mentioned
            if (message.includes('sample URLs')) {
                formattedMessage += '<br><br><span class="text-info"><strong>Tip:</strong> Click on the sample URL buttons below the URL input to try with websites known to work well.</span>';
            }
            
            errorMessage.innerHTML = formattedMessage;
        } else {
            // Regular errors
            errorMessage.textContent = message;
        }
    }
    
    function hideError() {
        errorCard.classList.add('d-none');
    }
});
