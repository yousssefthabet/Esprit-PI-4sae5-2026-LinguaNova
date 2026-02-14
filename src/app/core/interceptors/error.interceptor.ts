import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An error occurred';

            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = `Error: ${error.error.message}`;
            } else {
                // Server-side error
                errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
            }

            // Log error (in production, send to logging service)
            console.error('HTTP Error:', errorMessage);

            // Return error observable
            return throwError(() => new Error(errorMessage));
        })
    );
};
