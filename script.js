document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('angleCanvas');
    const ctx = canvas.getContext('2d');
    const feedbackEl = document.getElementById('feedback');
    const scoreEl = document.getElementById('score');
    const buttons = document.querySelectorAll('.controls button');

    let score = 0;
    let currentAngleDegrees = 0;
    let currentAngleType = '';
    let waitingForNext = false; // Flag to prevent multiple clicks during feedback

    // --- Angle Generation ---
    function getRandomAngle() {
        const types = ['acute', 'right', 'obtuse', 'straight'];
        const typeIndex = Math.floor(Math.random() * types.length);
        currentAngleType = types[typeIndex];

        switch (currentAngleType) {
            case 'acute':
                // Generate angle between 10 and 80 degrees for clarity
                currentAngleDegrees = Math.random() * 70 + 10;
                break;
            case 'right':
                currentAngleDegrees = 90;
                break;
            case 'obtuse':
                // Generate angle between 100 and 170 degrees for clarity
                currentAngleDegrees = Math.random() * 70 + 100;
                break;
            case 'straight':
                currentAngleDegrees = 180;
                break;
        }
        // Round to one decimal place for cleaner display if needed later
        currentAngleDegrees = Math.round(currentAngleDegrees * 10) / 10;
        console.log(`Generated: ${currentAngleDegrees}° (${currentAngleType})`); // For debugging
    }

    // --- Drawing ---
    function drawAngle() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2 + 50; // Adjust center down a bit
        const lineLength = 100;
        const angleRadians = currentAngleDegrees * Math.PI / 180;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Style lines
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        // Draw first line (horizontal to the right)
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + lineLength, centerY);
        ctx.stroke();

        // Draw second line based on angle (rotating counter-clockwise)
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        // Calculate end point using trigonometry
        const endX = centerX + lineLength * Math.cos(-angleRadians); // Negative for clockwise rotation from horizontal
        const endY = centerY + lineLength * Math.sin(-angleRadians);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Draw vertex circle
        ctx.fillStyle = '#0056b3';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
        ctx.fill();

        // Optional: Draw angle arc for non-straight angles
        if (currentAngleDegrees < 178) { // Avoid tiny arc for 180
             ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
             ctx.lineWidth = 1.5;
             ctx.beginPath();
             // Arc goes from the first line angle (0) to the second line angle (-angleRadians)
             ctx.arc(centerX, centerY, lineLength * 0.3, 0, -angleRadians, true); // true for counter-clockwise path needed due to negative angle
             ctx.stroke();
        }
    }

    // --- Feedback and Scoring ---
    function showFeedback(message, isCorrect) {
        feedbackEl.textContent = message;
        feedbackEl.className = 'feedback'; // Reset classes
        if (isCorrect === true) {
            feedbackEl.classList.add('correct');
        } else if (isCorrect === false) {
            feedbackEl.classList.add('incorrect');
        }
    }

    function updateScore(newScore) {
        score = newScore;
        scoreEl.textContent = score;
    }

    // --- Game Flow ---
    function nextRound() {
        waitingForNext = false;
        buttons.forEach(button => button.disabled = false); // Re-enable buttons
        getRandomAngle();
        drawAngle();
        showFeedback("Select an angle type below.", null); // Reset feedback
    }

    function handleAnswer(event) {
        if (waitingForNext) return; // Don't process clicks while waiting

        const selectedType = event.target.getAttribute('data-type');
        waitingForNext = true; // Prevent further clicks immediately
        buttons.forEach(button => button.disabled = true); // Disable buttons during feedback


        if (selectedType === currentAngleType) {
            showFeedback(`Correct! It's a ${currentAngleType} angle.`, true);
            updateScore(score + 1);
        } else {
            showFeedback(`Incorrect. That was a ${currentAngleType} angle.`, false);
            // Optional: Reset score on incorrect answer
            // updateScore(0);
        }

        // Wait a moment, then start the next round
        setTimeout(nextRound, 2000); // 2-second delay
    }

    // --- Initialization ---
    buttons.forEach(button => {
        button.addEventListener('click', handleAnswer);
    });

    // Start the first round
    nextRound();
});