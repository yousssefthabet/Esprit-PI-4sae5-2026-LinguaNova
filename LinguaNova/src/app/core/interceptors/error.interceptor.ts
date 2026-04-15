import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            const errorMessage = error.error instanceof ErrorEvent
                ? `Error: ${error.error.message}`
                : (error.error?.message || error.error?.error || error.message || `Error Code: ${error.status}`);
            console.error('HTTP Error:', errorMessage);
            if (error.error && typeof error.error === 'object' && error.error.message) {
                console.error('Backend message:', error.error.message);
            }
            // Rethrow the same error so callers still have error.status and error.error (backend body)
            return throwError(() => error);
        })
    );
};
