document.addEventListener("DOMContentLoaded", async () => {
  const videoElement = document.getElementById("user-video");
  const nextButton = document.getElementById("next-button");
  const prevButton = document.getElementById("prev-button");
  const hideButton = document.getElementById("hide-button");
  const questionDisplay = document.getElementById("current-question-display");

  let questions = [];
  let currentQuestionIndex = -1;

  const videoList = [
    "korean_2_1.mp4",
    "korean_2_2.mp4",
    "korean_2_3.mp4",
    "korean_2_4.mp4",
    "korean_2_5.mp4",
  ];

  // 1. Session Storage에서 질문 가져오기
  questions = JSON.parse(sessionStorage.getItem("interviewQuestions") || "[]");

  // 2. 웹캠 스트림 시작 함수
  async function startVideo() {
    const selectedVideo = videoList[Math.floor(Math.random() * videoList.length)];

    videoElement.src = `./videos/${selectedVideo}`;
    videoElement.loop = true;
    videoElement.play();
  }

  // 3. 현재 질문 표시 함수
  function displayCurrentQuestion() {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      questionDisplay.textContent = `질문 ${currentQuestionIndex + 1}: ${
        questions[currentQuestionIndex]
      }`;
    } else if (questions.length > 0 && currentQuestionIndex >= questions.length) {
      questionDisplay.textContent = "모든 질문에 대한 답변을 완료했습니다!";
    } else {
      questionDisplay.textContent = "연습할 질문이 없습니다. 이전 페이지에서 질문을 입력해주세요.";
    }
  }

  hideButton.addEventListener("click", () => {
    const heading = document.getElementById("current-question-display");

    if (heading.style.visibility === "hidden") {
      heading.style.visibility = "visible";
      hideButton.innerText = "질문 숨기기";
    } else {
      heading.style.visibility = "hidden";
      hideButton.innerText = "질문 보이기";
    }
  });

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  }

  function handleNextClick() {
    prevButton.disabled = false;
    currentQuestionIndex++;
    speak();

    if (currentQuestionIndex < questions.length) {
      displayCurrentQuestion();
    }
    if (currentQuestionIndex == questions.length - 1) {
      nextButton.disabled = true;
    }
  }

  const debouncedNextClick = debounce(handleNextClick, 250);

  // 4. "다음" 버튼 클릭 이벤트
  if (nextButton) {
    nextButton.addEventListener("click", debouncedNextClick);
  }

  function handlePrevClick() {
    nextButton.disabled = false;
    currentQuestionIndex--;
    speak();

    if (currentQuestionIndex >= 0) {
      displayCurrentQuestion();
    }

    if (currentQuestionIndex == 0) {
      prevButton.disabled = true;
    }
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      debouncedPrevClick();
    } else if (event.key === "ArrowRight") {
      debouncedNextClick();
    }
  });

  const debouncedPrevClick = debounce(handlePrevClick, 250);
  prevButton.addEventListener("click", debouncedPrevClick);

  function speak() {
    const text = questions[currentQuestionIndex];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR"; // 한국어
    utterance.pitch = 0;
    speechSynthesis.speak(utterance);
  }

  // 초기화: 영상 시작
  await startVideo();
});
