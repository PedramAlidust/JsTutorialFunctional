document.addEventListener("DOMContentLoaded", function () {
    // Show the popup after the page loads
    showPopup();
});

function showPopup() {
    var popupContainer = document.getElementById("popupContainer");
    popupContainer.style.visibility = "visible";
    popupContainer.style.opacity = "1";
}

function closePopup() {
    var popupContainer = document.getElementById("popupContainer");
    popupContainer.style.visibility = "hidden";
    popupContainer.style.opacity = "0";
}

function redirectToBuyingPage() {
    // Redirect to the buying page, you can replace the URL with your actual buying page URL
    window.location.href = "https://www.aryatehran.com/";
}
