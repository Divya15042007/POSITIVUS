const boxes = document.querySelectorAll(".process-box");

boxes.forEach(box => {
    const btn = box.querySelector(".toggle-btn");

    btn.addEventListener("click", () => {
        
        // CLOSE all boxes except the clicked one
        boxes.forEach(b => {
            if (b !== box) b.classList.remove("active");
        });

        // TOGGLE the clicked one
        box.classList.toggle("active");
    });
});
