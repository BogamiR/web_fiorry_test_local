// cameraInterop.js

// Log that the module is loaded (for debugging)
console.log("cameraInterop.js: Module loaded as an ES module.");

// Define the object that will be exported as the default
export function takePhoto(onSuccess, onError) { // Now accepts onSuccess and onError callbacks
    console.log("cameraInterop.js: takePhoto: Called from Kotlin.");

    // Use an async IIFE (Immediately Invoked Function Expression) to handle the Promise internally
    (async() => {
        try {
            console.log("cameraInterop.js: takePhoto: Requesting camera access...");
            // This is the line where permission/HTTPS errors often occur
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            console.log("cameraInterop.js: takePhoto: Camera stream obtained.");

            const video = document . createElement ('video');
            video.srcObject = stream;
            video.play();

            video.onloadedmetadata = () => {
                console.log("cameraInterop.js: takePhoto: Video metadata loaded. Capturing photo in 500ms.");
                const canvas = document . createElement ('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const context = canvas . getContext ('2d');

                setTimeout(() => {
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageDataUrl = canvas . toDataURL ('image/png');
                    console.log("cameraInterop.js: takePhoto: Photo captured. Stopping stream. Calling onSuccess callback.");
                    // Stop all tracks to release camera resources
                    stream.getTracks().forEach(track => track . stop ());
                    onSuccess(imageDataUrl); // Send Base64 data to Kotlin
                }, 500);
            };
        } catch (err) {
            // If an error occurs (e.g., NotAllowedError, NotFoundError), log it and send to Kotlin
            const errorMsg = `cameraInterop.js: takePhoto: ERROR: Camera access failed: ${err.message} (Name: ${err.name}).`;
            console.error(errorMsg, err); // Log the full error object for detailed debugging
            onError(errorMsg); // Send error message to Kotlin
        }
    })(); // Execute the async IIFE immediately
}