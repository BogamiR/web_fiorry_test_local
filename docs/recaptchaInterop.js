let widgetId = null;

export function setupRecaptcha(containerId, siteKey) {
    ensureRecaptchaReady(() => {
        const container = document.getElementById(containerId);
        if (!container) {
            return;
        }

        if (widgetId === null) {
            widgetId = grecaptcha.render(container, {
                sitekey: siteKey,
                size: "invisible",
                callback: function(token) {
                    if (window.__recaptchaCallback) {
                        window.__recaptchaCallback(token);
                    }
                }
            });
        } else {
            grecaptcha.reset(widgetId);
        }

        grecaptcha.execute(widgetId);
    });
}

export function ensureRecaptchaReady(callback) {
    if (typeof grecaptcha !== 'undefined' && grecaptcha.render) {
        callback();
    } else {
        const interval = setInterval(() => {
            if (typeof grecaptcha !== 'undefined' && grecaptcha.render) {
                clearInterval(interval);
                callback();
            }
        }, 100);
    }
}

export function initRecaptchaCallback(callback) {
    window.__recaptchaCallback = function(token) {
        callback(token)
    };
}
