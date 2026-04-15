import { HttpInterceptorFn } from '@angular/common/http';
import { API_CONFIG } from '../constants/app.constants';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    // Leave course microservice paths unchanged (proxied to :8081)
    if (req.url.startsWith('/PIproject')) {
        return next(req);
    }

    let targetUrl = req.url;

    if (req.url.startsWith('/')) {
        targetUrl = `${API_CONFIG.BASE_URL}${req.url}`;
    } else if (req.url.startsWith('http://localhost:4200/api')) {
        targetUrl = req.url.replace('http://localhost:4200/api', API_CONFIG.BASE_URL);
    } else if (!req.url.startsWith('http') && !req.url.startsWith('assets/')) {
        targetUrl = `${API_CONFIG.BASE_URL}/${req.url}`;
    }

    if (targetUrl !== req.url) {
        const apiReq = req.clone({ url: targetUrl });
        return next(apiReq);
    }

    return next(req);
};
