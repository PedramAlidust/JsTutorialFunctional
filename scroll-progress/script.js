document.addEventListener("DOMContentLoaded", function() {
    // Get the initial 'stroke-dashoffset' unit
    var dashOffset = parseInt(getComputedStyle(document.querySelector(".gauge-path")).strokeDashoffset, 10);
  
    // On a scroll event - execute function
    window.addEventListener("scroll", function() {
      // Calculate how far down the page the user is
      var percentageComplete = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 30;
  
      // Get the value to be subtracted from the 'stroke-dashoffset'
      var offsetUnit = percentageComplete * (dashOffset / 100);
  
      // Set the new value of the 'stroke-dashoffset' to create the drawing effect
      document.querySelector(".gauge-path").style.strokeDashoffset = dashOffset - offsetUnit + "px";
    });
  });
  