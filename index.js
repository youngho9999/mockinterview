// DOM 요소 가져오기
const questionTextarea = document.getElementById("interview-question");
const videoInterviewBtn = document.getElementById("video-interview-btn");
const liveInterviewBtn = document.getElementById("live-interview-btn");

/**
 * Textarea의 내용을 Session Storage에 저장하고 interview.html로 이동하는 함수
 */
function startInterview() {
  const questions = questionTextarea.value;

  const questionArray = questions.split("\n");

  sessionStorage.setItem("interviewQuestions", JSON.stringify(questionArray));

  window.location.href = "interview.html";
}

// 각 버튼에 이벤트 리스너 추가
if (videoInterviewBtn) {
  videoInterviewBtn.addEventListener("click", startInterview);
}

if (liveInterviewBtn) {
  liveInterviewBtn.addEventListener("click", startInterview);
}
