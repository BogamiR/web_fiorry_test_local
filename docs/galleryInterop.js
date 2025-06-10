window.gallery = {
    selectImage: function() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';

            input.onchange = (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        resolve(e.target.result);
                    };
                    reader.onerror = (e) => {
                        reject(new Error('Ошибка чтения файла: ' + e.target.error));
                    };
                    reader.readAsDataURL(file);
                } else {
                    reject(new Error('File not selected'));
                }
            };
            input.click();
        });
    }
};