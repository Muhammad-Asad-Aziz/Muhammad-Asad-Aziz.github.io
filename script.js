// Damn, ChatGPT bussin' fr fr
// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Toggle function for the navbar
    function toggleNav() {
        const navbar = document.getElementById("navbar");
        if (navbar.style.left === "0px") {
            console.log("Closing navbar"); // Debugging line
            navbar.style.left = "-500px"; // Close the navbar
        } else {
            console.log("Opening navbar"); // Debugging line
            navbar.style.left = "0px"; // Open the navbar
        }
    }

    // Add event listener to each link inside navbar
    const navbarLinks = document.querySelectorAll("#navbar ul li a");
    navbarLinks.forEach(link => {
        link.addEventListener("click", () => {
            console.log("Link clicked, closing navbar"); // Debugging line
            document.getElementById("navbar").style.left = "-500px"; // Close the navbar
        });
    });

    // Attach toggleNav to the menu button
    const menuButton = document.getElementById("menuButton");
    menuButton.addEventListener("click", toggleNav);
});

// Smooth Criminal
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offset = window.innerHeight / 2 - element.offsetHeight / 2;

    window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth"
    });
}
