const form = document.querySelector(".form");
const meetingInput = document.querySelector("#login__username");

function getAction() {
  form.action = `/${meetingInput.value}/joinMeeting/call`;
  form.submit();
}
