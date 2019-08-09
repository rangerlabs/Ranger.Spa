import { Observable, timer, empty, Subscriber, Subject } from "rxjs";
import { debounce } from "rxjs/operators";

declare module "rxjs" {
    interface Observable<T> {
        debounceNonDistinct(delay: number): Observable<T>;
    }
}

Observable.prototype.debounceNonDistinct = function debounceNonDistinct<T>(delay: number) {
    const source$: Observable<T> = this;

    return new Observable<T>(observer => {
        // Using an object as the default value
        // so that the first time we check it
        // if its the same its guaranteed to be false
        // because every object has a different identity.
        // Can't use null or undefined because source may
        // emit these!
        let lastSeen = {};

        return source$
            .pipe(
                debounce((value: T) => {
                    // If the last value has the same identity we'll
                    // actually debounce
                    if (value !== lastSeen) {
                        lastSeen = value;
                        return timer(delay);
                    } else {
                        // This will complete() right away so we don't actually debounce/buffer
                        // it at all
                        return empty();
                    }
                })
            )
            .subscribe(observer);
    });
};
