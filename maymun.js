const revealBtn = document.getElementById("reveal-code-btn");
const realCode = document.getElementById("real-code");

revealBtn.addEventListener("click", () => {
  realCode.style.display = "block";
  revealBtn.disabled = true;
});

