export default function Head(props) {
    return (
        <header id="header" className="header d-flex align-items-center">
            <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
                <a href="index.html" className="logo d-flex align-items-center">
                    <h1>Celo<span>Blogger</span></h1>
                </a>
                <i className="mobile-nav-toggle mobile-nav-show bi bi-list" />
                <i className="mobile-nav-toggle mobile-nav-hide d-none bi bi-x" />
                <nav id="navbar" className="navbar">
                    <ul>
                        <li><a href="index.html" className="active">Balance: {props.balance} cUSD</a></li>
                    </ul>
                </nav>{/* .navbar */}
            </div>
        </header>

    )
}

