import './hero.css'

export default function Hero() {
    return (
        <>
            <header className="hero-container">
                <div className="hero-background">
                    <img src="Portland.png" alt="Background"/>
                </div>
                <div className="banner-footer">
                    <div className="search-bar">
                        <input type="text" placeholder="Search your address" />
                    </div>
                </div>
            
                <div className="title-container">
                    <div className="text-group">
                        <h1 className="title-text">Change is in the Air</h1>
                        <h2 className="subtitle-text">Portland Metropolitan AQI</h2>
                    </div>

                    <div className="aqi-container">
                        <div className="aqi-box">
                            <h3 className="aqi-title">Current AQI</h3>
                            <p className="aqi-value">34</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="card-grid">
                <div className="card">
                    <p className="card-label">PM2.5</p>
                    <p className="card-value">--</p>
                    <p className="card-unit">µg/m³</p>
                </div>
                <div className="card">
                    <p className="card-label">PM10</p>
                    <p className="card-value">--</p>
                    <p className="card-unit">µg/m³</p>
                </div>
                <div className="card">
                    <p className="card-label">Ozone (O₃)</p>
                    <p className="card-value">--</p>
                    <p className="card-unit">ppb</p>
                </div>
                <div className="card">
                    <p className="card-label">Carbon Monoxide (CO)</p>
                    <p className="card-value">--</p>
                    <p className="card-unit">ppm</p>
                </div>
                <div className="card">
                    <p className="card-label">Nitrogen Dioxide (NO₂)</p>
                    <p className="card-value">--</p>
                    <p className="card-unit">ppb</p>
                </div>
                <div className="card">
                    <p className="card-label">Sulfur Dioxide (SO₂)</p>
                    <p className="card-value">--</p>
                    <p className="card-unit">ppb</p>
                </div>
            </div>
        </>
    )
}