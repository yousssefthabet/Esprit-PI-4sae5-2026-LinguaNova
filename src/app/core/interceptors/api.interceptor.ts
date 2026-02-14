import { HttpInterceptorFn } from '@angular/common/http';
import { API_CONFIG } from '../constants/app.constants';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    // Check if the URL should be intercepted:
    // 1. It's a relative path starting with /
    // 2. It doesn't already point to the API_CONFIG.BASE_URL

    let targetUrl = req.url;

    if (req.url.startsWith('/')) {
        targetUrl = `${API_CONFIG.BASE_URL}${req.url}`;
    } else if (req.url.startsWith('http://localhost:4200/api')) {
        // Fix for cases where somehow the UI origin was prepended but intended for API
        targetUrl = req.url.replace('http://localhost:4200/api', API_CONFIG.BASE_URL);
    } else if (!req.url.startsWith('http') && !req.url.startsWith('assets/')) {
        // Fallback for relative paths without leading slash
        targetUrl = `${API_CONFIG.BASE_URL}/${req.url}`;
    }

    if (targetUrl !== req.url) {
        // console.log(`[ApiInterceptor] Transforming ${req.url} -> ${targetUrl}`);
        const apiReq = req.clone({ url: targetUrl });
        return next(apiReq);
    }

    return next(req);
};
