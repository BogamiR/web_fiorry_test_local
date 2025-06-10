// galleryInterop.js

// Log that the module is loaded (for debugging)
console.log("galleryInterop.js: Module loaded as an ES module.");

// Define the object that will be exported as the default
export function selectImage(onSuccess, onError) {
    console.log("galleryInterop.js: selectImage: Called from Kotlin.");
    const fileInput = document . getElementById ('fileInput');

    if (!fileInput) {
        const errorMsg = "galleryInterop.js: selectImage: ERROR: HTML input element with id 'fileInput' not found. Ensure it's in index.html.";
        console.error(errorMsg); // Log to browser console
        onError(errorMsg); // Send error back to Kotlin
        return;
    }
    console.log("galleryInterop.js: selectImage: fileInput element found.");

    // Clear any previous onchange handler to avoid conflicts
    fileInput.onchange = null;

    fileInput.onchange = (event) => {
        console.log("galleryInterop.js: selectImage: fileInput.onchange triggered.");
        const file = event . target . files [0];
        if (file) {
            console.log(
                "galleryInterop.js: selectImage: File selected:",
                file.name,
                "Type:",
                file.type
            );
            const reader = new FileReader();
            reader.onload = (e) => {
                console.log("galleryInterop.js: selectImage: FileReader.onload complete. Calling onSuccess callback.");
                onSuccess(e.target.result); // Pass the Base64 data URL to Kotlin
            };
            reader.onerror = (e) => {
                const errorMsg = 'galleryInterop.js: selectImage: FileReader error: '+(e.target.error ? e.target.error.message : 'Unknown error');
                console.error(errorMsg, e.target.error); // Log detailed error
                onError(errorMsg); // Send error back to Kotlin
            };
            reader.readAsDataURL(file);
        } else {
            const errorMsg = 'galleryInterop.js: selectImage: User cancelled file selection or no file chosen.';
            console.log(errorMsg); // Not strictly an error, but informs of cancellation
            onError(errorMsg); // Inform Kotlin about cancellation
        }
        // Reset the input value to allow selecting the same file again
        fileInput.value = '';
        // Remove the handler after use to prevent stale references
        fileInput.onchange = null;
    };

    // Attempt to programmatically click the file input
    try {
        console.log("galleryInterop.js: selectImage: Calling fileInput.click()...");
        fileInput.click();
    } catch (e) {
        const errorMsg = `galleryInterop.js: selectImage: ERROR: Failed to programmatically click file input: ${e.message}`;
        console.error(errorMsg, e); // Log if click() itself throws an error
        onError(errorMsg);
    }
}