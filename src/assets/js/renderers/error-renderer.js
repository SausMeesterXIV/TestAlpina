let errorTimeout;

function flashError(e, message) {
    const $popup = document.querySelector("#error-popup");
    const $text = document.querySelector("#error-message");

    $text.textContent = message;

    $popup.style.left = `${e.pageX}px`; // pageX = the distance from the LEFT edge of the entire webpage to your mouse
    $popup.style.top = `${e.pageY}px`; // pageY = the distance from the TOP of the entire webpage to your mouse

    $popup.classList.remove("error-hidden");
    $popup.classList.add("error-visible");
    
    clearTimeout(errorTimeout); // this ensures the error remains on screen as long as the user keeps making mistakes
    const time = 2000; 
    errorTimeout = setTimeout(() => {
        $popup.classList.add("error-hidden");
        $popup.classList.remove("error-visible");
    }, time);
}

export {flashError};