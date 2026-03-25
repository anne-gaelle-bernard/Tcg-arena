import { useState } from "react";

interface LoginProps {
	onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
	const [tab, setTab] = useState<"signin" | "register">("signin");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [message, setMessage] = useState("");

	// Register fields
	const [fullName, setFullName] = useState("");
	const [regEmail, setRegEmail] = useState("");
	const [regPassword, setRegPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	function handleSignIn(e: React.FormEvent) {
		e.preventDefault();
		if (!email || !password) {
			setMessage("Please fill in all fields.");
			return;
		}
		setMessage("");
		onLogin();
	}

	function handleRegister(e: React.FormEvent) {
		e.preventDefault();
		if (!fullName || !regEmail || !regPassword || !confirmPassword) {
			setMessage("Please fill in all fields.");
			return;
		}
		if (regPassword !== confirmPassword) {
			setMessage("Passwords do not match.");
			return;
		}
		setMessage("");
		onLogin();
	}

	return (
		<main
			style={{
				margin: 0,
				padding: 0,
				display: "grid",
				gridTemplateColumns: "55% 45%",
				height: "100vh",
				width: "100vw",
				overflow: "hidden",
				fontFamily: "Inter, Segoe UI, Arial, sans-serif",
				color: "#f2e6d8",
				background: "#0a0604",
			}}
		>
			{/* Left side – background image */}
			<section
				aria-label="Basketball promo visual"
				style={{
					padding: 0,
					background:
						"linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.45)), url('./Frontend/assets/b15.png')",
					backgroundSize: "contain",
					backgroundPosition: "left center",
					backgroundRepeat: "no-repeat",
					backgroundAttachment: "fixed",
					height: "100%",
					width: "100%",
				}}
			/>

			{/* Right side – form */}
			<section
				style={{
					padding: "32px 28px",
					background: "#2a1a11",
					height: "100%",
					overflowY: "auto",
					display: "flex",
					flexDirection: "column",
					boxSizing: "border-box",
				}}
			>
				<h2 style={{ margin: "0 0 8px 0", fontSize: 32, color: "#f2e6d8" }}>
					{tab === "signin" ? "Welcome Back" : "Create Account"}
				</h2>
				<p style={{ margin: "0 0 16px 0", color: "#c2a88f", fontSize: 13, lineHeight: 1.4 }}>
					{tab === "signin"
						? "Ready to hit the court? Sign in to your account."
						: "Join the arena and start your collection."}
				</p>

				{/* Tabs */}
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "1fr 1fr",
						borderBottom: "1px solid #6a472a",
						marginBottom: 18,
					}}
				>
					<button
						onClick={() => { setTab("signin"); setMessage(""); }}
						style={{
							display: "block",
							textAlign: "center",
							background: "transparent",
							color: tab === "signin" ? "#ffd3a1" : "#d0b091",
							border: 0,
							borderBottom: tab === "signin" ? "2px solid #ff9d2e" : "2px solid transparent",
							padding: "8px 0",
							fontWeight: 700,
							cursor: "pointer",
							fontSize: 14,
						}}
					>
						Sign In
					</button>
					<button
						onClick={() => { setTab("register"); setMessage(""); }}
						style={{
							display: "block",
							textAlign: "center",
							background: "transparent",
							color: tab === "register" ? "#ffd3a1" : "#d0b091",
							border: 0,
							borderBottom: tab === "register" ? "2px solid #ff9d2e" : "2px solid transparent",
							padding: "8px 0",
							fontWeight: 700,
							cursor: "pointer",
							fontSize: 14,
						}}
					>
						Create Account
					</button>
				</div>

				{tab === "signin" ? (
					<form onSubmit={handleSignIn} noValidate>
						<label style={labelStyle}>Email Address</label>
						<div style={fieldStyle}>
							<span style={iconStyle}>@</span>
							<input
								type="email"
								placeholder="coach@hoopstgc.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								style={inputStyle}
							/>
						</div>

						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<label style={{ ...labelStyle, margin: "12px 0 5px 0" }}>Password</label>
							<a href="#" style={{ color: "#ffc169", textDecoration: "none", fontSize: 12 }}>
								Forgot Password?
							</a>
						</div>
						<div style={fieldStyle}>
							<span style={iconStyle}>*</span>
							<input
								type={showPassword ? "text" : "password"}
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								style={inputStyle}
							/>
							<button
								type="button"
								onClick={() => setShowPassword((v) => !v)}
								style={{ border: 0, background: "transparent", cursor: "pointer", color: "#d4b698" }}
							>
								{showPassword ? "Hide" : "Show"}
							</button>
						</div>

						<button type="submit" style={primaryBtnStyle}>
							Enter the Arena →
						</button>
						{message && (
							<p style={{ minHeight: 20, margin: "8px 2px 0", color: "#ffdcae", fontSize: 13 }}>
								{message}
							</p>
						)}
					</form>
				) : (
					<form onSubmit={handleRegister} noValidate>
						<label style={labelStyle}>Full Name</label>
						<div style={fieldStyle}>
							<span style={iconStyle}>✦</span>
							<input
								type="text"
								placeholder="Michael Jordan"
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								style={inputStyle}
							/>
						</div>

						<label style={labelStyle}>Email Address</label>
						<div style={fieldStyle}>
							<span style={iconStyle}>@</span>
							<input
								type="email"
								placeholder="player@hoopstgc.com"
								value={regEmail}
								onChange={(e) => setRegEmail(e.target.value)}
								style={inputStyle}
							/>
						</div>

						<label style={labelStyle}>Password</label>
						<div style={fieldStyle}>
							<span style={iconStyle}>*</span>
							<input
								type="password"
								placeholder="••••••••"
								value={regPassword}
								onChange={(e) => setRegPassword(e.target.value)}
								style={inputStyle}
							/>
						</div>

						<label style={labelStyle}>Confirm Password</label>
						<div style={fieldStyle}>
							<span style={iconStyle}>*</span>
							<input
								type="password"
								placeholder="••••••••"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								style={inputStyle}
							/>
						</div>

						<button type="submit" style={primaryBtnStyle}>
							Create My Account →
						</button>
						{message && (
							<p style={{ minHeight: 20, margin: "8px 2px 0", color: "#ffdcae", fontSize: 13 }}>
								{message}
							</p>
						)}
					</form>
				)}

				<p style={{ margin: "12px 0 10px", textAlign: "center", fontSize: 10, letterSpacing: "0.08em", color: "#9f7a59" }}>
					OR CONTINUE WITH
				</p>
				<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginTop: 10 }}>
					<button style={socialBtnStyle} type="button">Google</button>
					<button style={socialBtnStyle} type="button">Apple</button>
				</div>
				<p style={{ marginTop: 12, fontSize: 11, color: "#9e7b5c", lineHeight: 1.45 }}>
					By continuing, you agree to the Terms of Service and Privacy Policy.
				</p>
			</section>
		</main>
	);
}

const labelStyle: React.CSSProperties = {
	display: "block",
	fontSize: 12,
	color: "#d7bb9d",
	margin: "12px 0 5px 0",
	fontWeight: 500,
};

const fieldStyle: React.CSSProperties = {
	display: "flex",
	alignItems: "center",
	gap: 8,
	border: "1px solid #5a3b25",
	borderRadius: 6,
	background: "#2a1c14",
	padding: "9px 11px",
	fontSize: 13,
	boxSizing: "border-box",
};

const iconStyle: React.CSSProperties = {
	color: "#c79f78",
	width: 18,
	textAlign: "center",
};

const inputStyle: React.CSSProperties = {
	flex: 1,
	minWidth: 0,
	border: 0,
	outline: "none",
	background: "transparent",
	color: "#fce9d3",
	fontSize: 14,
};

const primaryBtnStyle: React.CSSProperties = {
	width: "100%",
	border: 0,
	borderRadius: 6,
	background: "linear-gradient(90deg, #ff962f, #ffb34b)",
	color: "#2f180a",
	fontWeight: 800,
	padding: "11px 10px",
	cursor: "pointer",
	marginTop: 12,
	fontSize: 14,
	boxSizing: "border-box",
};

const socialBtnStyle: React.CSSProperties = {
	border: "1px solid #5d3c26",
	background: "#1f130d",
	color: "#efd6bb",
	borderRadius: 8,
	padding: 10,
	cursor: "pointer",
	fontWeight: 600,
};
