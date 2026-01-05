import Logo from "../../../assets/images/LOGO.svg";
import DpImg from "../../../assets/images/dp-img.jpg";
import plusImg from "../../../assets/images/plus-wh.svg";
import userId from "../../../assets/images/user-id.svg";
import change_password from "../../../assets/images/password.svg";
import download from "../../../assets/images/download.svg";
import cart from "../../../assets/images/cart.svg";
import heart from "../../../assets/images/heart.svg";
import ReelIcon from "../../../assets/images/pricing.svg";
import LogoutId from "../../../assets/images/logout.svg";
import { Button, Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation, NavLink } from "react-router-dom";
import { User_Logout } from "../../../api/auth/Auth";
import { useWallet } from "../../../context/WalletContext";

const Header_Login = () => {
  const location = useLocation();
  const get_cart_item_id = localStorage.getItem("cart_item_id");
  let base_url = process.env.REACT_APP_BASE_URL;
  const { walletBalance } = useWallet();

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return; // ❌ stop if user cancels

    try {
      const response = await User_Logout();
      console.log("Logout response:", response);

      if (response?.data?.status === true) {
        // ✅ Clear token & refresh
        localStorage.removeItem("polycarft_user_token");
        window.location.reload(); // refresh to re-render routes
        localStorage.clear();
      } else {
        alert(response?.data?.message || "Logout failed.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.clear()
      window.location.reload()
      // alert("Something went wrong while logging out.");  
    }
  };

  return (
    <>
      <header className="main-header px-85">
        <Navbar expand="lg" className="header-inner p-0">
          <Container fluid>
            <div className="logo-toggler">
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Link to="/" className="nav-logo">
                <img src={Logo} alt="Logo" className="main-logo" />
              </Link>
            </div>
            <Navbar.Collapse id="basic-navbar-nav">
              <div className="navbar-links-outer">
                {/* Left links */}
                <Nav className="navbar-links left-links">
                  <Nav.Link
                    as={NavLink}
                    to="/"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <img src={ReelIcon} alt="Templates" />{" "}
                    <span>Templates</span>
                  </Nav.Link>
                  {get_cart_item_id && (
                    <Nav.Link
                      as={NavLink}
                      to="/upload-3d-modal"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <img src={ReelIcon} alt="Templates" />{" "}
                      <span>Upload Products</span>
                    </Nav.Link>
                  )}
                </Nav>

                {/* Right links */}
                <Nav className="navbar-links">
                  {/* <Nav.Link as={NavLink} to="#" className={() => ""}>
  <img src={pencilIcon} alt="Poly Editor" /> <span>Poly Editor</span>
</Nav.Link> */}

                  <Nav.Link
                    as={NavLink}
                    to="/pricing"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <img src={ReelIcon} alt="My Orders" /> <span>Pricing</span>
                  </Nav.Link>

                  <Nav.Link
                    as={NavLink}
                    to="/my-orders"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <img src={ReelIcon} alt="My Orders" />{" "}
                    <span>My Orders</span>
                  </Nav.Link>

                  {/* Store links */}
                  <div className="store-links">
                    {/* <Link to="/">
                      <img src={download} alt="download" />
                    </Link>
                    <Link to="/">
                      <img src={heart} alt="heart" />
                    </Link> */}
                    <Link to="/upload-products">
                      <img src={cart} alt="cart" />
                    </Link>
                  </div>
                </Nav>
              </div>
            </Navbar.Collapse>
            <Dropdown className="profile-dropdown">
              <Dropdown.Toggle variant="success">
                <div className="info-box">
                  <div className="text-end">
                    <h6>Credits</h6>
                    <span className="amt">{walletBalance?.wallet_balance}</span>
                  </div>

                  {walletBalance?.image_url ? (
                    <img src={walletBalance?.image_url} alt="DpImg" />
                  ) : (
                    <img src={DpImg} alt="DpImg" />
                  )}
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu align="end">
                <div className="profile-dropdown-menu">
                  <div className="top-image">
                    {walletBalance?.image_url ? (
                      <img src={walletBalance?.image_url} alt="DpImg" />
                    ) : (
                      <img src={DpImg} alt="DpImg" />
                    )}
                    <h6 className="name">{walletBalance?.name}</h6>
                  </div>
                  <div className="credits-avail">
                    <h6>Credit available</h6>
                    <div className="inner-info">
                      <h5>{walletBalance?.wallet_balance}</h5>
                      <Link
                        to={`/purchase`}
                        className={`btn btn-primary ${location.pathname === `/purchase` ? "active" : ""
                          }`}
                      >
                        <img src={plusImg} alt="plusImg" />
                        <span> Add </span>
                      </Link>
                    </div>
                  </div>
                  <div className="profile-links">
                    <Link to={`/user-profile`}>
                      <img src={userId} alt="userId" />
                      <span>My Profile</span>
                    </Link> 
                    <Link to={`/current-subscrption`}>
                      <img src={userId} alt="userId" />
                  <span>Current Subscription</span>
                    </Link>
                    <Link to={`/payment-transctions`}>
                      <img src={userId} alt="userId" />
                      <span>Payment Transctions</span>
                    </Link>
                    <Link to={`/change-password`}>
                      <img
                        src={change_password}
                        alt="change_password"
                        style={{ width: "25px" }}
                      />
                      <span>Change Password</span>
                    </Link>
                    <div onClick={handleLogout}>
                      <Link to="/">
                        <img src={LogoutId} alt="LogoutId" />
                        <span>Log out</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </Container>
        </Navbar>
      </header>
    </>
  );
};

export default Header_Login;
