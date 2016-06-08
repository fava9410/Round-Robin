$(document).ready(function(){
    var canvas = document.getElementById("lienzo");
    var context = canvas.getContext('2d');
    var dragging = false;
    var lastX;
    var marginLeft = 0;

    canvas.addEventListener('mousedown', function(e) {
        var evt = e || event;
        dragging = true;
        lastX = evt.clientX;
        e.preventDefault();
    }, false);

    window.addEventListener('mousemove', function(e) {
        var evt = e || event;
        if (dragging) {
            var delta = evt.clientX - lastX;
            lastX = evt.clientX;
            marginLeft += delta;
            canvas.style.marginLeft = marginLeft + "px";
        }
        e.preventDefault();
    }, false);

    window.addEventListener('mouseup', function() {
        dragging = false;
    }, false);
});