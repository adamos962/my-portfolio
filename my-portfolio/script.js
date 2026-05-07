function greetVisitor() {
	const heading = document.querySelector("h1");

	if (heading) {
		heading.textContent += " Vítejte!";
	}
}

document.addEventListener("DOMContentLoaded", greetVisitor);

document.querySelector("button").addEventListener("click", () => document.body.classList.toggle("dark-mode"));