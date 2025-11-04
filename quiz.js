document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('start-btn');
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const nextBtn = document.getElementById('next-btn');
    const quizContent = document.getElementById('quiz-content');
    const resultElement = document.getElementById('result');
    const scoreTextElement = document.getElementById('score-text');
    const timerElement = document.getElementById('timer');
    const feedbackElement = document.getElementById('feedback');
    const retryBtn = document.getElementById('retry-btn');

    let allQuestions = [];
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let userAnswers = [];
    let timer;
    let timeLeft;



    // 1. 讀取 CSV 檔案
    fetch('questions.csv')
        .then(response => response.text())
        .then(data => {
            allQuestions = data.trim().split('\n').map(line => {
                const parts = line.split(',');
                return {
                    question: parts[0],
                    options: parts.slice(1, -1),
                    answer: parseInt(parts[parts.length - 1], 10)
                };

            });
            startNewQuiz();
        });

    startBtn.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        quizContent.classList.remove('hidden');
        startTimer();
        displayQuestion(); // 在這裡才顯示第一題
    });

    function startTimer() {
        timeLeft = 60;
        timerElement.textContent = `剩餘時間: ${timeLeft} 秒`;
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `剩餘時間: ${timeLeft} 秒`;
            if (timeLeft <= 0) {
                showResults();
            }
        }, 1000);
    }

    // Fisher-Yates shuffle 演算法
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }


    function startNewQuiz() {
        shuffleArray(allQuestions);
        questions = allQuestions.slice(0, 5); // 從打亂的題庫中選取前 5 題
        resetQuizState();
        displayQuestion();
    }


    function resetQuiz() {
        startNewQuiz();
    }

    function resetQuizState() {
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = [];
        resultElement.classList.add('hidden');
        quizContent.classList.remove('hidden');
        nextBtn.textContent = '下一題';
    }

    function displayQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.textContent = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;
        optionsElement.innerHTML = '';

        currentQuestion.options.forEach((option, index) => {
            const optionElement = document.createElement('label');
            optionElement.className = 'option';
            optionElement.innerHTML = `
                <input type="radio" name="option" value="${index}">
                ${option}
            `;
            optionsElement.appendChild(optionElement);
        });

        if (currentQuestionIndex === questions.length - 1) {
            nextBtn.textContent = '完成測驗';
        }
    }


    function showResults() {
        clearInterval(timer);
        quizContent.classList.add('hidden');
        resultElement.classList.remove('hidden');

        for (let i = 0; i < questions.length; i++) {
            // 修正：計算答對的題目
            if (userAnswers[i] === questions[i].answer) {
                score++;
            }
        }

        const finalScore = (score / questions.length) * 100;
        scoreTextElement.textContent = `總題數：${questions.length} 題，您答對了 ${score} 題，最終得分：${finalScore.toFixed(0)} 分。`;

        saveScoreToServer({
            score: score,
            totalQuestions: questions.length,
            percentage: finalScore.toFixed(0),
            timestamp: new Date().toISOString()
        });
    }

    function saveScoreToServer(data) {
        // 注意： '/api/save-score' 是一個範例路徑。
        // 您需要將它換成您自己的後端伺服器端點 (endpoint)。
        fetch('/api/save-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('成功儲存分數:', data);
        })
        .catch((error) => {
            console.error('儲存分數時發生錯誤:', error);
        });
    }

    nextBtn.addEventListener('click', () => {
        const selectedOption = document.querySelector('input[name="option"]:checked');


        if (!selectedOption) {
            alert('請選擇一個答案！');
            return;
        }

        userAnswers[currentQuestionIndex] = parseInt(selectedOption.value, 10);

        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        } else {
            showResults();
        }
    });


    retryBtn.addEventListener('click', resetQuiz);
});