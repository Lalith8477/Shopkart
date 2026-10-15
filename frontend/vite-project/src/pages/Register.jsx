import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../services/api";

function Register() {

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: ""
    });

    const [errorMsg, setErrorMsg] = useState("")
    const [loader, setLoader] = useState(false)

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({...form,
            [e.target.name]: e.target.value
        });

        setErrorMsg("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.fullName || !form.email || !form.password || !form.phone) {
            setErrorMsg("Please fill in all fields.");
            return;
        }
        setLoader(true)
        setErrorMsg("");

        try {
          await axiosInstance.post("/customers/register", form);

          console.log("Customer Registered");
          navigate("/login");

        } catch (error) {
            console.log(error);

            setErrorMsg(
                error.response?.data?.message ||
                "Registration failed"
            );

        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="form-container">

            <h1>Create ShopKart Account</h1>

            {errorMsg && (
                <p className="error">
                    {errorMsg}
                </p>
            )}

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={form.fullName}
                    onChange={handleChange}
                    disabled={loader}
                />

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

                <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={loader}
                />

                <button type="submit" disabled={loader}>

                    {loader ? "Creating Account..." : "Create Account"}

                </button>

            </form>

            <p>
                Already have an account?{" "}

                <Link to="/login">
                    Login
                </Link>

            </p>

        </div>
    );
}

export default Register;
