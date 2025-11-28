const radios = document.querySelectorAll("input[name='contactType']");
const messageBox = document.getElementById("messageBox");

radios.forEach(radio => {
    radio.addEventListener("change", () => {
        if (radio.value === "hi") {
            messageBox.value = "";
        } else {
            messageBox.value = "We're interested in your services! Please contact us";
        }
    });
});
