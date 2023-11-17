import React from 'react'
import { CombineLatestSubscriber } from 'rxjs/internal/observable/combineLatest';
import classes from './footer.module.css';

export default function Footer() {
    return (
        <div className={classes.footerContainer}>
            <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                <div class="col-md-4 d-flex align-items-center">
                    <a href="/" class="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
                        <svg class="bi" width="30" height="24"></svg>
                    </a>
                    <span class="mb-3 mb-md-0 text-muted">© 2023 SB Orion ML Beta, Inc All rights reserved</span>
                </div>

                <ul class="nav col-md-4 justify-content-end list-unstyled d-flex">
                    <li class="ms-3"><a class="text-muted" href="#"><svg class="bi me-2" width="24" height="24"></svg></a></li>
                    <li class="ms-3"><a class="text-muted" href="#"><svg class="bi" width="24" height="24"></svg></a></li>
                    <li class="ms-3"><a class="text-muted" href="#"><svg class="bi" width="24" height="24"></svg></a></li>
                </ul>
            </footer>
        </div>
    )
}
