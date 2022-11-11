<main id="main">
	<section id="appointment" class="appointment section-bg">
		<form action="" method="post" class="form">
			<div class="section-title">
				<h2>Create an account</h2>
				<div class="social-links text-center text-md-right pt-3 pt-md-0">
					<p>You can, alternatively, use:</p>
					<a href={null} class="twitter"><i class="fa-brands fa-twitter"></i></a>
					<a href={null} class="facebook"><i class="fa-brands fa-facebook"></i></a>
					<a href={null} class="instagram"><i class="fa-brands fa-instagram"></i></a>
					<a href={null} class="google-plus"><i class="fa-brands fa-skype"></i></a>
					<a href={null} class="linkedin"><i class="fa-brands fa-linkedin"></i></a>
				</div>
			</div>
			<div class="mb-3">
				<label for="email" class="form-label">Email address</label>
				<input
					type="email"
					class="form-control"
					id="email"
					aria-describedby="email-help"
				/>
				<div id="email-help" class="form-text">We'll never share your email with anyone else.</div>
			</div>
			<div class="mb-3">
				<label for="password" class="form-label">Password</label>
				<input type="password" class="form-control" id="password" />
			</div>
			<div class="mb-3">
				<label for="confirm-password" class="form-label">Confirm Password</label>
				<input type="password" class="form-control" id="confirm-password" />
			</div>
			<div class="mb-3 form-check">
				<p>Already have an account? <a href="/accounts/login">Login</a></p>
			</div>
			<div class="text-center"><button type="submit">Register</button></div>
		</form>
	</section>
</main>
