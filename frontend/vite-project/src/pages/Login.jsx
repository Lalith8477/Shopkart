import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {

    const [form, setForm] = useState({
        email: "",
        password: ""
    })

    const [errorMsg, setErrorMsg] = useState("");
    const [loader, setLoader] = useState(false);

    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleChange = (e) => {
        setForm({...form,
          [e.target.name]: e.target.value
        });

        setErrorMsg("");
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        if (!form.email || !form.password) {
            setErrorMsg("Please fill in all fields.")
            return;
        }
        setLoader(true)
        setErrorMsg("")

        try {
            await axiosInstance.post("/customers/login", form)

            console.log("User Logged In");

            const response = await axiosInstance.get("/customers/me")
            setUser(response.data.customerProfile);

            navigate("/home");
        } catch (error) {
            console.log(error);
            setErrorMsg("Invalid Credentials");
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="form-container">

            <h1>ShopKart Login</h1>

            {errorMsg && (
                <p className="error">
                    {errorMsg}
                </p>
            )}

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={loader}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    disabled={loader}
                />

                <button type="submit" disabled={loader}>
                    {loader ? "Logging in..." : "Login"}
                </button>

            </form>

            <p>
                Don't have an account?{" "}

                <Link to="/register">
                    Register
                </Link>
            </p>

        </div>
    );
}

export default Login;
