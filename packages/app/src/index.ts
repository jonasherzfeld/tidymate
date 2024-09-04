function helloWorld() {
    const element = document.getElementById("hello-world");

    if (element) {
        element.textContent = "Hello World!";
    }
}

helloWorld();
console.log("Hello World!");