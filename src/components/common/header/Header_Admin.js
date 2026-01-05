import React from "react";
import Logo from "../../../assets/images/LOGO.svg";
import DpImg from "../../../assets/images/dp-img.jpg";
import plusImg from "../../../assets/images/plus-wh.svg";
import userId from "../../../assets/images/user-id.svg";
import change_password from "../../../assets/images/password.svg";
import cart from "../../../assets/images/cart.svg";
import heart from "../../../assets/images/heart.svg";
import uploadIcon from "../../../assets/images/upload-products.svg";
import ReelIcon from "../../../assets/images/pricing.svg";
import LogoutId from "../../../assets/images/logout.svg";
import { Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Admin_Logout } from "../../../api/admin/Admin";
import { useAdminProfile } from "../../../context/AdminProfileContext";

const Header_Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let base_url = process.env.REACT_APP_BASE_URL;
  const setAdminProfile = useAdminProfile();
  console.log("setAdminProfile", setAdminProfile?.AdminProfile);
  localStorage.setItem("admin_id", setAdminProfile?.AdminProfile?.id);
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return; // ❌ stop if user cancels

    try {
      const response = await Admin_Logout();
      console.log("Logout response:", response);

      if (response?.data?.status === true) {
        // ✅ Clear token & refresh
        localStorage.removeItem("ploycartfts_admin_token");
        // window.location.reload(); // refresh to re-render routes
        navigate(`/admin-login`);
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
              <Link to="/admin-orders" className="nav-logo">
                <img src={Logo} alt="Logo" className="main-logo" />
              </Link>
            </div>
            <Navbar.Collapse id="basic-navbar-nav">
              <div className="navbar-links-outer">
                <Nav className="navbar-links left-links">
                  <Nav.Link as={Link}
                    className={`${location.pathname === `/admin-orders` ? "active" : ""
                      }`}
                    to={`/admin-orders`}
                  >
                    <img src={ReelIcon} alt="download" /> <span>Dashboard</span>
                  </Nav.Link>
                  <Nav.Link as={Link}
                    className={`${location.pathname === `/admin-uplaod-video` ? "active" : ""
                      }`}
                    to={`/admin-uplaod-video`}
                  >
                    <img src={uploadIcon} alt="download" />{" "}
                    <span>All Products</span>
                  </Nav.Link>
                </Nav>
                <Nav className="navbar-links">
                  <Nav.Link
                    as={Link}
                    to={`/admin-contact-request`}
                    className={`${location.pathname === `/admin-contact-request`
                        ? "active"
                        : ""
                      }`}
                  >
                    <img src={uploadIcon} alt="download" />{" "}
                    <span>All Contact</span>
                  </Nav.Link>

                  <Nav.Link
                    as={Link}
                    to={`/admin-faq`}
                    className={`${location.pathname === `/admin-faq` ? "active" : ""
                      }`}
                  >
                    <img src={uploadIcon} alt="download" />{" "}
                    <span>All FAQ's</span>
                  </Nav.Link>
                  <Dropdown className="nav-dropdown">
                    <Dropdown.Toggle
                      className="nav-link-toggle"
                      variant="primary"
                    >
                      More
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="px-3">
                      <Dropdown.Item
                        as={Link}
                        to={`/admin-seo-contents`}
                        className={`nav-link justify-content-start py-2 my-1 ${location.pathname === `/admin-seo-contents`
                            ? "active"
                            : ""
                          }`}
                      >
                        All SEO
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to={`/admin-user-list`}
                        className={`nav-link justify-content-start py-2 my-1 ${location.pathname === `/admin-user-list`
                            ? "active"
                            : ""
                          }`}
                      >
                        Users
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to={`/admin-orders`}
                        className={`nav-link justify-content-start py-2 my-1 ${location.pathname === `/admin-orders` ? "active" : ""
                          }`}
                      >
                        Orders
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to={`/admin-uplaod-video`}
                        className={`nav-link justify-content-start py-2 my-1 ${location.pathname === `/admin-uplaod-video`
                            ? "active"
                            : ""
                          }`}
                      >
                        Upload Videos
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to={`/admin-subscription-plans`}
                        className={`nav-link justify-content-start py-2 my-1 ${location.pathname === `/admin-subscription-plans`
                            ? "active"
                            : ""
                          }`}
                      >
                        Subscription Plans
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to={`/admin-home-video-sections`}
                        className={`nav-link justify-content-start py-2 my-1 ${location.pathname === `/admin-home-video-sections`
                            ? "active"
                            : ""
                          }`}
                      >
                        Home Video Sections
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to={`/admin-consultation-booking`}
                        className={`nav-link justify-content-start py-2 my-1 ${location.pathname === `/admin-consultation-booking`
                            ? "active"
                            : ""
                          }`}
                      >
                        Consulting booking
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to={`/admin-global-page-content`}
                        className={`nav-link justify-content-start py-2 my-1 ${
                          location.pathname === `/admin-global-page-content`
                            ? "active"
                            : ""
                        }`}
                      >
                        Global Page Content
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to={`/admin-subscription-features`}
                        className={`nav-link justify-content-start py-2 my-1 ${
                          location.pathname === `/admin-subscription-features`
                            ? "active"
                            : ""
                        }`}
                      >
                        Subscription Feature
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  {/* <Nav.Link
                    as={Link}
                    to={`/admin-seo-contents`}
                    className={`${location.pathname === `/admin-seo-contents` ? "active" : ""}`}
                  >
                    <img src={uploadIcon} alt="download" /> <span>All Seo </span>
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to={`/admin-uplaod-video`}
                    className={`${location.pathname === `/admin-uplaod-video` ? "active" : ""}`}
                  >
                    <img src={uploadIcon} alt="download" /> <span>Upload Videos </span>
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to={`/admin-subscription-plans`}
                    className={`${location.pathname === `/admin-subscription-plans` ? "active" : ""}`}
                  >
                    <span>Subscription Plans </span>
                  </Nav.Link> */}
                  <div className="store-links border-0">
                    <Link>
                      <img src={heart} alt="heart" />
                    </Link>
                    <Link>
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
                    <h6>{setAdminProfile?.AdminProfile?.name}</h6>
                    <span className="amt">ADMIN</span>
                  </div>
                  {setAdminProfile?.AdminProfile?.image_url ? (
                    <img
                      src={setAdminProfile?.AdminProfile?.image_url}
                      alt="DpImg"
                    />
                  ) : (
                    <img src={DpImg} alt="DpImg" />
                  )}
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu align="end">
                <div className="profile-dropdown-menu">
                  <div className="top-image">
                    {setAdminProfile?.AdminProfile?.image_url ? (
                      <img
                        src={setAdminProfile?.AdminProfile?.image_url}
                        alt="DpImg"
                      />
                    ) : (
                      <img src={DpImg} alt="DpImg" />
                    )}
                    <h6 className="name">
                      {setAdminProfile?.AdminProfile?.name}
                    </h6>
                  </div>
                  <div className="credits-avail">
                    <h6>Credit available</h6>
                    <div className="inner-info">
                      <h4>100</h4>
                      <Link to={``} className="btn btn-primary">
                        <img src={plusImg} alt="plusImg" />
                        <span> Add </span>
                      </Link>
                    </div>
                  </div>
                  <div className="profile-links">
                    <Link to={`/admin-profile`}>
                      <img src={userId} alt="userId" />
                      <span>My Profile</span>
                    </Link>
                    <Link to={`/admin-password-change`}>
                      <img
                        src={change_password}
                        alt="change_password"
                        style={{ width: "25px" }}
                      />
                      <span>Change Password</span>
                    </Link>
                    <div onClick={handleLogout}>
                      <Link to={`/`}>
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

export default Header_Admin;
