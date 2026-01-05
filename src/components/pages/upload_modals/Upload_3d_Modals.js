import React, { useEffect, useState } from "react";
import Footer from "../../common/footer/Footer";
import Header_Login from "../../common/header/Header_Login";
import UplaodIcon from "../../../assets/images/upload-icon.svg";
import PlusIcon from "../../../assets/images/plus-icon.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  User_Add_Product_Name,
  User_Show_Product_Name_List,
  Upload_3D_file,
  Show_Uploaded_products_images,
  upload_product_Label,
  Show_Uploaded_products_Label,
  User_Purchase_Product,
  Delete_Modal_file,
  Delete_Product,
  upload_product_Delete_Label,
} from "../../../api/product/Product";

const Upload_3d_Modals = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item;
  const [uploadedModels, setUploadedModels] = useState({});
  const [loadingUploads, setLoadingUploads] = useState({});
  const [products, setProducts] = useState([]);
  const [uploadedLabels, setUploadedLabels] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPurchaseLink, setShowPurchaseLink] = useState(false);
  const get_cart_cardit_video_name = localStorage.getItem(
    "cart_cardit_video_name"
  );
  const get_cart_available_aspect_ratios = JSON.parse(
    localStorage.getItem("cart_available_aspect_ratios") || "[]"
  );

  const createEmptyProduct = () => ({
    id: Date.now(),
    name: "",
    submitted: false,
    modelFile: null,
    labels: [null],
    comments: "",
  });

  const handleNameSubmit = async (id) => {
    const product = products.find((p) => p.id === id);
    if (!product || !product.name.trim()) return;

    try {
      const userData = { product_name: product.name, have_3d_model: "Yes" };
      const cart_item_id = localStorage.getItem("cart_item_id");

      // Call API
      const res = await User_Add_Product_Name(userData, cart_item_id);
      User_Show_Product_Name_List({}, cart_item_id);
      window.location.reload();
      // Update local state fully
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
              ...p,
              submitted: true, // mark as submitted
              name: product.name.trim(), // update name immediately
              have_3d_model: res?.have_3d_model === "Yes" ? "1" : "0", // update 3D model flag
            }
            : p
        )
      );
    } catch (error) {
      console.error("Product name submit failed:", error);
    }
  };

  const handleChange = (id, field, value) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleLabelChange = async (productId, labelIndex, file) => {
    try {
      if (!file) return;

      // Update local state so UI shows selection (optional)
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
              ...p,
              labels: p.labels.map((l, idx) =>
                idx === labelIndex ? file : l
              ),
            }
            : p
        )
      );

      const cart_item_id = localStorage.getItem("cart_item_id");
      const formData = new FormData();
      formData.append("label_image", file);

      // Upload label
      const res = await upload_product_Label(cart_item_id, productId, formData);
      User_Show_Product_Name_List({}, cart_item_id);
      fetchProducts();
      if (res?.data?.status && res.data?.data?.image_url) {
        // Save uploaded label URL for preview
        // setUploadedLabels((prev) => ({
        //   ...prev,
        //   [productId]: {
        //     ...prev[productId],
        //     [labelIndex]: res.data.data.image_url,
        //   },
        // }));
        setUploadedLabels((prev) => {
          const current = [...(prev[productId] || [])];
          current[labelIndex] = res.data.data.image_url;
          return { ...prev, [productId]: current };
        });
        
      }
    } catch (err) {
      console.error("Label upload failed:", err);
      if(err?.data?.status == false){
        alert(err?.data?.errors?.label_image[0]);
      }
    }
  };

  const handleDeleteLabel = async (product, label) => {
    const get_cart_item_id = localStorage.getItem("cart_item_id");
    if (label && label.id) {
      const formData = new FormData();
      formData.append("_method", "DELETE");
      try {
        if (!window.confirm("Are you sure you want to delete this label?")) return;

        await upload_product_Delete_Label(
          get_cart_item_id,
          product.id,
          label.id,
          formData
        );
        window.location.reload();
        // Remove from state
        setUploadedLabels((prev) => {
          const updated = { ...prev };
          updated[product.id] = updated[product.id].filter(
            (l) => l.id !== label.id
          );
          return updated;
        });
      } catch (err) {
        console.error("Error deleting label:", err);
        alert("Failed to delete label. Please try again.");
      }
    } else {
      console.warn("Label has no id, removed locally only");
    }
  };

  const handleAddLabel = (productId) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, labels: [...p.labels, null] } : p
      )
    );
  };

  const handleAddMore = () => {
    setProducts((prev) => [...prev, createEmptyProduct()]);
  };

  const fetchProducts = async () => {
    try {
      const cart_item_id = localStorage.getItem("cart_item_id");
      const res = await User_Show_Product_Name_List({}, cart_item_id);

      if (res?.data?.data && res.data.data.length > 0) {
        // ✅ Filter only products with have_3d_model === "0"
        const filteredProducts = res.data.data.filter(
          (p) => p.have_3d_model != "0" || p.have_3d_model == 0
        );

        const loadedProducts = filteredProducts.map((p) => ({
          ...p,
          submitted: true,
          images: {
            front: p.front_view_image || null,
            side: p.side_view_image || null,
            top: p.top_view_image || null,
            bottom: p.bottom_view_image || null,
            rear: p.rear_view_image || null,
          },
          dimensions: {
            width: p.width || "",
            height: p.height || "",
            depth: p.depth || "",
          },
          labels: [null],
          comments: p.comment || "",
        }));

        setProducts(loadedProducts);

        // ✅ Calculate total price only for these filtered products
        const total = loadedProducts.reduce(
          (sum, product) => sum + parseFloat(product.price || 0),
          0
        );

        setTotalPrice(total);
      } else {
        setProducts([createEmptyProduct()]);
        setTotalPrice(0);
      }
    } catch (error) {
      console.error("Failed to load product list:", error);
      setProducts([createEmptyProduct()]);
      setTotalPrice(0);
    }
  };


  useEffect(() => {
    fetchProducts();
  }, []);

  const handle3DModelUpload = async (productId, file) => {
    if (!file) return alert("Please select a file first.");

    const validExtensions = [
      ".3ds", ".dae", ".fbx", ".ma", ".mb", ".mtl", ".obj", ".stl", ".usd"
    ];

    const fileExt = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExtensions.includes(fileExt)) {
      return alert(`Invalid file type (${fileExt}). Please upload one of: ${validExtensions.join(", ")}`);
    }

    try {
      const cart_item_id = localStorage.getItem("cart_item_id");
      const token = localStorage.getItem("polycarft_user_token");

      if (!cart_item_id || !token) {
        return alert("Missing required session data. Please log in again.");
      }

      // ✅ Show loader for this product
      setLoadingUploads((prev) => ({ ...prev, [productId]: true }));

      const formData = new FormData();
      formData.append("3d_model_file", file);
      formData.append("_method", "PATCH");

      const res = await Upload_3D_file(cart_item_id, productId, formData, token);

      if (res?.data?.status && res.data.data?.["3d_model_file_url"]) {
        setUploadedModels((prev) => ({
          ...prev,
          [productId]: res.data.data["3d_model_file_url"],
        }));
        alert("3D model uploaded successfully!");
      } else {
        alert("Upload completed, but file URL not returned.");
      }
    } catch (error) {
      console.error("3D model upload failed:", error);

      if (error?.response?.data?.errors?.["3d_model_file"]) {
        alert(error.response.data.errors["3d_model_file"][0]);
      } else {
        alert("3D model upload failed. Please try again.");
      }
    } finally {
      // ✅ Hide loader when upload done
      setLoadingUploads((prev) => ({ ...prev, [productId]: false }));
    }
  };




  // Add this helper inside your Upload_3d_Modals component
  // const isPurchaseEnabled = () => {
  //   return (
  //     products.length > 0 &&
  //     products.every((product) => {
  //       const hasName = product.submitted && product.name?.trim() !== "";

  //       const has3DModel = !!uploadedModels[product.id];

  //       const hasLabels =
  //         uploadedLabels[product.id] &&
  //         uploadedLabels[product.id].length > 0 &&
  //         uploadedLabels[product.id].every((l) => !!l); // all labels uploaded

  //       const hasComments = product.comments && product.comments.trim() !== "";

  //       // ✅ All conditions must be true
  //       return hasName && has3DModel && hasLabels && hasComments;
  //     })
  //   );
  // };

  const isPurchaseEnabled = () => {
    // Filter only the products which actually require 3D model upload
    const validProducts = products.filter(
      (product) => String(product.have_3d_model) == "1"
    );
  
    // If no 3D model products exist, disable the button
    if (validProducts.length == 0) return false;
  
    // Now check all required conditions for only those valid products
    return validProducts.every((product) => {
      const hasName = product.submitted && product.name?.trim() != "";
  
      const has3DModel = !!uploadedModels[product.id];
  
      const hasLabels =
        uploadedLabels[product.id] &&
        Array.isArray(uploadedLabels[product.id]) &&
        uploadedLabels[product.id].length > 0 &&
        uploadedLabels[product.id].every((l) => !!l);
  
      const hasComments = product.comments && product.comments.trim() != "";
  
      return hasName && has3DModel && hasLabels && hasComments;
    });
  };
  

  // 🔹 Update function
  const handle_3DModel_Update = async (
    productId,
    file,
    comment,
    width,
    height,
    depth
  ) => {
    if (!comment || comment.trim() === "") {
      alert("Comment is required!");
      return;
    }

    try {
      const cart_item_id = localStorage.getItem("cart_item_id");
      const token = localStorage.getItem("polycarft_user_token");

      const formData = new FormData();
      formData.append("_method", "PATCH"); // for PATCH request
      formData.append("comment", comment);

      // Only append if values exist
      if (width) formData.append("width", width);
      if (height) formData.append("height", height);
      if (depth) formData.append("depth", depth);
      if (file) formData.append("file", file);

      const res = await Upload_3D_file(
        cart_item_id,
        productId,
        formData,
        token
      );

      if (res?.data?.status) {
        alert(res?.data?.message);
        // Save uploaded model URL in state so preview shows instantly
        setUploadedModels((prev) => ({
          ...prev,
        }));
      }
    } catch (error) {
      console.error("3D model upload failed:", error);
      alert("3D model upload failed!");
    }
  };

  // 🧩 Function to handle delete action
  const handleDelete3DModel = async (product) => {
    const get_cart_item_id = localStorage.getItem("cart_item_id")
    try {
      const formData = new FormData();
      formData.append("_method", "DELETE");
      formData.append("field", "3d_model_file");


      await Delete_Modal_file(get_cart_item_id, product.id, formData);

      // ✅ Remove locally
      setUploadedModels((prev) => {
        const updated = { ...prev };
        delete updated[product.id];
        return updated;
      });

      alert("3D model deleted successfully!");
    } catch (err) {
      console.error("Error deleting model:", err);
      alert("Failed to delete 3D model. Please try again.");
    }
  };

  useEffect(() => {
    const cart_item_id = localStorage.getItem("cart_item_id");

    products.forEach(async (product) => {
      if (product.submitted && product.have_3d_model) {
        try {
          const res = await Show_Uploaded_products_images(
            cart_item_id,
            product.id
          );
          if (res?.data?.status && res.data.data["3d_model_file_url"]) {
            setUploadedModels((prev) => ({
              ...prev,
              [product.id]: res.data.data["3d_model_file_url"],
            }));
          }
        } catch (err) {
          console.error("Error fetching uploaded 3D model:", err);
        }
      }
    });
  }, [products]);

  useEffect(() => {
    const fetchUploadedLabels = async () => {
      const cart_item_id = localStorage.getItem("cart_item_id");

      for (const product of products) {
        if (product.submitted) {
          try {
            const res = await Show_Uploaded_products_Label(
              cart_item_id,
              product.id
            );

            if (res?.data?.status && Array.isArray(res.data.data)) {
              // Store full objects {id, url}
              const labelsWithId = res.data.data.map((label) => ({
                id: label.id,
                url: label.image_url,
              }));
              setUploadedLabels((prev) => ({
                ...prev,
                [product.id]: labelsWithId,
              }));
            }
          } catch (err) {
            console.error(
              "Error fetching uploaded labels for product:",
              product.id,
              err
            );
          }
        }
      }
    };

    fetchUploadedLabels();
  }, [products]);


  const handleDeleteProduct = async (product_id) => {
    const get_cart_item_id = localStorage.getItem("cart_item_id")
    try {
      const formData = new FormData();
      formData.append("_method", "DELETE");

      const res = await Delete_Product(get_cart_item_id, product_id, formData);

      if (res?.status == 200) {
        window.location.reload()
      }
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };


  const handlePurchase = async () => {
    try {
      const res = await User_Purchase_Product();

      if (res?.data?.status) {
        setErrorMessage("Purchase completed successfully!");
        setShowPurchaseLink(false);
        navigate(`/my-orders`);
        window.location.reload()
        localStorage.removeItem("cart_item_id")
      } else {
        setErrorMessage(
          res?.data?.message || "Purchase failed. Please try again."
        );
        setShowPurchaseLink(false);
      }
    } catch (err) {
      const msg = err?.data?.message || "Something went wrong.";
      setErrorMessage(msg);

      if (msg === "Insufficient wallet balance") {
        setShowPurchaseLink(true); // show purchase link only for this case
      } else {
        setShowPurchaseLink(false);
      }

      console.error("Purchase Error:", msg);
    }
  };

  return (
    <main className="upload-modals-page">
      <Header_Login />
      <div className='content-outer'>
        <section className="upload-modal-sec px-85">
          <div className="container-fluid">
            <div className="upload-modal-row row">
              <div className="col-modal-form">
                <div className="headings">
                  <h2>Upload products</h2>
                  <p>Upload and attach files to this project.</p>
                </div>

                <div className="video-info">
                  <div className="head">
                    <div className="name-outer">
                      <div className="name">
                        <h6 className="info-title">Video Name</h6>
                        <p>{get_cart_cardit_video_name}</p>
                      </div>
                    </div>
                    <div className="credits-dlt">
                      <div className="aspect-div">
                        <h6 className="info-title">Aspect ratio selected</h6>

                        <ul>
                          {get_cart_available_aspect_ratios?.map((ratio, idx) => (
                            <li key={idx}>{ratio}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="page-links-tab">
                  <ul>
                    <li>
                      <Link to={`/upload-3d-modal`} className="page-btn active">
                        I Have a 3D model
                      </Link>
                    </li>
                    <li>
                      <Link to={`/upload-modal`} className="page-btn">
                        I Don’t have a 3D model
                      </Link>
                    </li>
                  </ul>
                </div>

                {products?.map((product, idx) => (
                  <div key={product.id} className="upload-actions-row">
                    {!product.submitted ? (
                      <div className="single-upload-action">
                        <div className="headings">
                          <h4 className="main-title">Product Name</h4>
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <input
                            className="form-control"
                            placeholder="Enter product name"
                            type="text"
                            value={product?.name}
                            onChange={(e) =>
                              handleChange(product.id, "name", e.target.value)
                            }
                          />
                          <button
                            className="btn btn-primary"
                            onClick={() => handleNameSubmit(product.id)}
                            disabled={!product.name.trim()}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {product?.have_3d_model == 1 && product?.submitted && (
                          <>
                            <div
                              className="single-upload-action"
                              style={{
                                position: "relative",
                                marginBottom: "15px",
                                padding: "10px",
                                border: "1px solid #f5f5f5",
                                borderRadius: "8px",
                              }}
                            >
                              <div className="headings">
                                <h4 className="main-title">Product Name</h4>
                              </div>

                              <p
                                className="submitted-name"
                                style={{
                                  color: "#F53042",
                                  backgroundColor: "#FFF0F3",
                                  padding: "5px 10px",
                                  borderRadius: "5px",
                                  display: "inline-block",
                                  fontWeight: "bold",
                                }}
                              >
                                {product.name}
                              </p>

                              <button
                                onClick={() =>
                                  handleDeleteProduct(product.id)
                                }
                                style={{
                                  position: "absolute",
                                  top: "8px",
                                  right: "8px",
                                  background: "transparent",
                                  border: "none",
                                  color: "#F53042",
                                  cursor: "pointer",
                                  fontSize: "18px",
                                  fontWeight: "bold",
                                }}
                                title="Delete Product"
                              >
                                ×
                              </button>
                            </div>

                            <div className="single-upload-action">
                              <div className="headings">
                                <h4 className="main-title">Upload 3D model file</h4>
                                <p>Supported formats: .OBJ, .FBX, .STL, .3DS, .DAE</p>
                              </div>

                              {loadingUploads[product.id] ? (
                                <div
                                  style={{
                                    textAlign: "center",
                                    padding: "20px",
                                    background: "#f8f8f8",
                                    borderRadius: "8px",
                                    fontWeight: "500",
                                  }}
                                >
                                  <div className="spinner-border text-danger" role="status">
                                    <span className="visually-hidden">Uploading...</span>
                                  </div>
                                  <p style={{ marginTop: "10px" }}>Uploading 3D model, please wait...</p>
                                </div>
                              ) : uploadedModels[product.id] ? (
                                <div
                                  style={{
                                    marginTop: "10px",
                                    padding: "15px",
                                    backgroundColor: "#f5f5f5",
                                    borderRadius: "5px",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    position: "relative",
                                  }}
                                >
                                  <button
                                    onClick={() => handleDelete3DModel(product)}
                                    style={{
                                      position: "absolute",
                                      top: "8px",
                                      right: "8px",
                                      background: "transparent",
                                      border: "none",
                                      fontSize: "18px",
                                      cursor: "pointer",
                                      color: "#333",
                                    }}
                                    title="Delete"
                                  >
                                    ✕
                                  </button>

                                  <p>Uploaded 3D Model:</p>
                                  <a
                                    href={uploadedModels[product.id]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: "#F53042" }}
                                  >
                                    View 3D Model
                                  </a>

                                  <div style={{ marginTop: "10px" }}>
                                    <input
                                      type="file"
                                      id={`reupload-3d-file-${product.id}`}
                                      className="d-none"
                                      accept=".obj,.fbx,.stl,.3ds,.dae"
                                      onChange={(e) =>
                                        handle3DModelUpload(product.id, e.target.files[0])
                                      }
                                    />
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <input
                                    className="d-none"
                                    type="file"
                                    id={`modal-3d-file-${product.id}`}
                                    accept=".obj,.fbx,.stl,.3ds,.dae"
                                    onChange={(e) =>
                                      handle3DModelUpload(product.id, e.target.files[0])
                                    }
                                  />
                                  <label
                                    htmlFor={`modal-3d-file-${product.id}`}
                                    className="upload-box-div"
                                  >
                                    <img src={UplaodIcon} alt="UploadIcon" />
                                    <p className="text">
                                      <b>Click to upload</b> <span>or drag and drop</span>
                                    </p>
                                  </label>
                                </>
                              )}
                            </div>


                            {product?.labels?.map((label, lIdx) => {
                              const uploadedLabel = uploadedLabels[product.id]?.[lIdx]; // get the uploaded label object

                              return (
                                <div
                                  key={lIdx}
                                  className="single-upload-action"
                                  style={{ position: "relative", marginBottom: "15px" }}
                                >
                                  <div className="headings">
                                    <h4 className="main-title">Upload product label {lIdx + 1}</h4>
                                    <p>Supported formats: .JPG, .PNG, .GIF, .WEBP, .SVG</p>

                                    {uploadedLabels[product.id]?.[lIdx] && (
                                      <button
                                        type="button"
                                        className="delete-label-btn"
                                        onClick={() =>
                                          handleDeleteLabel(product, uploadedLabels[product.id][lIdx])
                                        }
                                        style={{
                                          position: "absolute",
                                          top: "8px",
                                          right: "8px",
                                          background: "transparent",
                                          border: "none",
                                          color: "#888",
                                          cursor: "pointer",
                                          fontSize: "18px",
                                        }}
                                        title="Remove label"
                                      >
                                        ✖
                                      </button>
                                    )}

                                  </div>

                                  {uploadedLabel ? (
                                    <div
                                      style={{
                                        marginTop: "10px",
                                        padding: "10px",
                                        backgroundColor: "#f5f5f5",
                                        borderRadius: "5px",
                                        textAlign: "center",
                                        position: "relative",
                                      }}
                                    >
                                      <p>Uploaded Label:</p>
                                      <img
                                        src={uploadedLabel.url}
                                        alt={`Label ${lIdx + 1}`}
                                        style={{
                                          maxWidth: "150px",
                                          marginTop: "5px",
                                          borderRadius: "4px",
                                          border: "1px solid #ddd",
                                        }}
                                      />

                                      <div style={{ marginTop: "10px" }}>
                                        <input
                                          type="file"
                                          id={`reupload-label-${product.id}-${lIdx}`}
                                          className="d-none"
                                          accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
                                          onChange={(e) =>
                                            handleLabelChange(product.id, lIdx, e.target.files[0])
                                          }
                                        />

                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <input
                                        className="d-none"
                                        type="file"
                                        id={`product-3d-label-${product.id}-${lIdx}`}
                                        accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
                                        onChange={(e) =>
                                          handleLabelChange(product.id, lIdx, e.target.files[0])
                                        }
                                      />
                                      <label
                                        htmlFor={`product-3d-label-${product.id}-${lIdx}`}
                                        className="upload-box-div"
                                        style={{
                                          display: "block",
                                          cursor: "pointer",
                                          marginTop: "10px",
                                          textAlign: "center",
                                          padding: "20px",
                                          background: "#f5f5f5",
                                          borderRadius: "6px",
                                        }}
                                      >
                                        <img
                                          src={UplaodIcon}
                                          alt="UploadIcon"
                                          style={{ width: "40px", marginBottom: "8px" }}
                                        />
                                        <p className="text" style={{ margin: 0 }}>
                                          <b>Click to upload</b> <span>or drag and drop</span>
                                        </p>
                                      </label>
                                    </>
                                  )}
                                </div>
                              );
                            })}



                            <div
                              className="single-upload-action"
                              style={{ position: "relative" }}
                            >
                              <div
                                className="headings"
                                style={{ position: "relative" }}
                              >
                                <h4 className="main-title">Comments</h4>
                              </div>

                              <input
                                className="form-control"
                                placeholder="Enter additional details"
                                type="text"
                                value={product.comments}
                                onChange={(e) =>
                                  handleChange(
                                    product.id,
                                    "comments",
                                    e.target.value
                                  )
                                }
                                style={{ paddingRight: "30px" }}
                              />
                            </div>
                            <button
                              className="btn btn-primary mb-2"
                              onClick={() =>
                                handle_3DModel_Update(
                                  product.id,
                                  product.file,
                                  product.comments,
                                  product.width,
                                  product.height,
                                  product.depth
                                )
                              }
                            >
                              Submit Comment
                            </button>
                            <div className="single-upload-btns">
                              <button
                                className="single-btn"
                                onClick={() => handleAddLabel(product.id)}
                              >
                                <img src={PlusIcon} alt="PlusIcon" />
                                <span>Additional Labels</span>
                              </button>
                              <span className="note-text">
                                <b>Note:</b> Additional Labels requires a fee of
                                60 credits.
                              </span>
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {idx === products.length - 1 && product.submitted && (
                      <div className="single-upload-btns">
                        <button className="single-btn" onClick={handleAddMore}>
                          <img src={PlusIcon} alt="PlusIcon" />
                          <span>Add more</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <div className="upload-payment-info">
                  <div className="credits-details">
                    <p>Total Credits</p>
                    <h6 className="price">{totalPrice.toFixed(2)} </h6>
                    {/* <p> Includes 150 credits per 3D modal </p> */}
                  </div>

                  <div className="upload-actions">
                    <Link to={`/upload-products`} className="btn btn-secondary">
                      Back
                    </Link>
                    <button
                      className="btn btn-primary"
                      disabled={!isPurchaseEnabled()}
                      onClick={handlePurchase}
                    >
                      Upload
                    </button>

                    {errorMessage && (
                      <p style={{ color: "red", marginTop: "20px" }}>
                        {errorMessage}
                      </p>
                    )}
                    {showPurchaseLink && (
                      <Link style={{ marginTop: "4px" }} to={`/purchase`}>
                        Go to Purchase Page
                      </Link>
                    )}


                  </div>


                </div>
              </div>
            </div>
          </div>
        </section>


      </div>
      <Footer />
    </main>
  );
};

export default Upload_3d_Modals;
