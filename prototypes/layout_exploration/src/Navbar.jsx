// File: Navbar.jsx
// Author: Lex Albrandt
// Purpose: This file is the react component for the site navbar

// Imports
import "./Navbar.css";
import { useState } from "react";

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	function handleMenuToggle() {
		setIsMenuOpen((currentValue) => !currentValue);
	}

	return (
		<nav className="navbar">
			<section className="navbar-container">
				<h1>Clean Air Project</h1>
				<button
					className="navbar-toggle"
					onClick={handleMenuToggle}
					type="button"
				>
					<span className="bar"></span>
					<span className="bar"></span>
					<span className="bar"></span>
				</button>
				<ul className={isMenuOpen ? "navbar-menu active" : "navbar-menu"}>
					<li>Home</li>
					<li>Your Neighborhood AQI</li>
					<li>Learn More</li>
					<li>The Blueprint Foundation</li>
				</ul>
			</section>
		</nav>
	);
}
