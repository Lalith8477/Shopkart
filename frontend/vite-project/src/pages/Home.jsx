import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

function Home() {

    const { user } = useAuth();

    return (
        <div className="home-container">

            <Navbar />

            <div className="home-content">

                <h1>Welcome to ShopKart</h1>

                <div className="profile-card">

                    <h2>Customer Information</h2>

                    <p>
                        <strong>Name:</strong> {user?.fullName}
                    </p>

                    <p>
                        <strong>Email:</strong> {user?.email}
                    </p>

                    <p>
                        <strong>Phone:</strong> {user?.phone}
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Home;
