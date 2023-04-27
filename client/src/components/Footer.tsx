import React from "react";

const today = new Date();

const Footer = () => {

	return (
		<>
	<footer className="">
		&copy; {today.getFullYear()} YOUR NAME HERE. All rights reserved.
	</footer>
	<style>
		{`
			footer {
				padding: 25px;
				text-align: center;
			}
		`}
	</style>
	</>
	)
}

export default Footer;