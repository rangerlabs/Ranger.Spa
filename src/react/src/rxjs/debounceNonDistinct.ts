import { Observable, timer, empty, Subscriber, Subject } from 'rxjs';
import { debounce, takeLast } from 'rxjs/operators';

declare module 'rxjs' {
    interface Observable<T> {
        debounceNonDistinct(delay: number): Observable<T>;
    }
}

export default function PrototypeExtensions() {
    Observable.prototype.debounceNonDistinct = function debounceNonDistinct<T>(delay: number) {
        const source$: Observable<T> = this;

        return new Observable<T>((observer) => {
            let lastSeen = {};

            return source$
                .pipe(
                    debounce((value: T) => {
                        if (value !== lastSeen) {
                            lastSeen = value;
                            return timer(delay);
                        } else {
                            return empty();
                        }
                    }),
                    takeLast(1)
                )
                .subscribe(observer);
        });
    };
}
