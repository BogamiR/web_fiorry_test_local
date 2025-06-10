window.camera = {
    takePhoto: function() {
        return new Promise(async (resolve, reject) => {
            try {
                // Запрашиваем доступ к видеопотоку (камере)
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                const video = document.createElement('video');
                video.srcObject = stream;
                video.play();

                video.onloadedmetadata = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const context = canvas.getContext('2d');

                    // Ждем короткое время для стабилизации видеопотока, затем делаем снимок
                    setTimeout(() => {
                        context.drawImage(video, 0, 0, canvas.width, canvas.height);
                        // Получаем изображение в формате base64
                        const imageDataUrl = canvas.toDataURL('image/png');
                        // Останавливаем видеопоток
                        stream.getTracks().forEach(track => track.stop());
                        resolve(imageDataUrl);
                    }, 500); // 500ms задержка
                };
            } catch (err) {
                reject(new Error('Ошибка доступа к камере: ' + err.message));
            }
        });
    }
};