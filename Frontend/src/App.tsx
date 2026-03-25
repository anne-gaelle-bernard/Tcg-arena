import { useState } from "react";
import Login from "./Login";
import HoopsTCG from "./HoopsTCG";

type Page = "login" | "collection";

export default function App() {
	const [page, setPage] = useState<Page>("login");

	if (page === "collection") {
		return <HoopsTCG onLogout={() => setPage("login")} />;
	}

	return <Login onLogin={() => setPage("collection")} />;
}
