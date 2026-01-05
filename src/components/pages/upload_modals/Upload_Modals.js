import React, { useEffect, useState } from "react";
import Footer from "../../common/footer/Footer";
import Header_Login from "../../common/header/Header_Login";
import UplaodIcon from "../../../assets/images/upload-icon.svg";
import PlusIcon from "../../../assets/images/plus-icon.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Delete_Modal_file,
  Delete_Product,
  Show_Uploaded_products_Label,
  Show_Uploaded_products_images,
  Upload_3D_file,
  User_Add_Product_Name,
  User_Purchase_Product,
  User_Show_Product_Name_List,
  upload_product_Delete_Label,
  upload_product_Label,
  upload_product_images,
} from "../../../api/product/Product";

const Upload_Modals = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state?.item;
  const [uploading, setUploading] = useState({});
  const [uploadedImages, setUploadedImages] = useState({});
  const [products, setProducts] = useState([]);
  const [uploadedModels, setUploadedModels] = useState({});
  const [errors, setErrors] = useState({});
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
    images: { front: null, side: null, top: null, bottom: null, rear: null },
    dimensions: { width: "", height: "", depth: "" },
    labels: [null],
    comments: "",
  });

  const handleChange = (productId, field, value) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, [field]: value } : p))
    );
  };

  const handleImageChange = (productId, type, file) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, images: { ...p.images, [type]: file } } : p
      )
    );

    setErrors((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [type]: null },
    }));
  };

  const handleDimensionChange = (productId, dim, value) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, dimensions: { ...p.dimensions, [dim]: value } }
          : p
      )
    );
  };

  // const handleLabelChange = async (productId, index, file) => {
  //   if (!file) return;

  //   // Update state for preview
  //   setProducts((prev) =>
  //     prev.map((p) =>
  //       p.id === productId
  //         ? {
  //           ...p,
  //           labels: p.labels.map((lbl, i) => (i === index ? file : lbl)),
  //         }
  //         : p
  //     )
  //   );

  //   try {
  //     const cart_item_id = localStorage.getItem("cart_item_id");

  //     const formData = new FormData();
  //     formData.append("label_image", file); // Adjust key as per backend

  //     // ✅ Pass productId separately
  //     const res = await upload_product_Label(cart_item_id, productId, formData);

  //     if (res?.data?.status) {
  //       const uploadedUrl = res.data.data.image_url; // Adjust according to API response
  //       setProducts((prev) =>
  //         prev.map((p) =>
  //           p.id === productId
  //             ? {
  //               ...p,
  //               labels: p.labels.map((lbl, i) =>
  //                 i === index ? uploadedUrl : lbl
  //               ),
  //             }
  //             : p
  //         )
  //       );
  //     }
  //   } catch (err) {
  //     console.error("Error uploading label:", err);
  //   }
  // };

  const handleLabelChange = async (productId, index, file) => {
    if (!file) return;
  
    // Show preview
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              labels: p.labels.map((lbl, i) => (i === index ? file : lbl)),
            }
          : p
      )
    );
  
    try {
      const cart_item_id = localStorage.getItem("cart_item_id");
  
      const formData = new FormData();
      formData.append("label_image", file);
  
      const res = await upload_product_Label(cart_item_id, productId, formData);

      window.location.reload()
  
      // ❗ CASE 2: Upload successful
      if (res?.data?.status) {
        const uploadedUrl = res.data.data.image_url;
  
        setProducts((prev) =>
          prev.map((p) =>
            p.id == productId
              ? {
                  ...p,
                  labels: p.labels.map((lbl, i) =>
                    i === index ? uploadedUrl : lbl
                  ),
                }
              : p
          )
        );
      }
    } catch (err) {
      console.error("Error uploading label:", err);
      if(err?.data?.status == false){
        alert(err?.data?.errors?.label_image[0]);
      }
    }
  };
  

  const handleAddLabel = (productId) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, labels: [...p.labels, null] } : p
      )
    );
  };

  const handleNameSubmit = async (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product || !product.name.trim()) return;

    try {
      const cart_item_id = localStorage.getItem("cart_item_id");
      await User_Add_Product_Name(
        { product_name: product.name, have_3d_model: "No" },
        cart_item_id
      );
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, submitted: true } : p))
      );
      window.location.reload()
    } catch (error) {
      console.error("Product name submit failed:", error);
    }
  };

  const handleAddMoreProduct = () => {
    setProducts((prev) => [...prev, createEmptyProduct()]);
  };

  const handleUploadImages = async (productId) => {
    const product = products.find((p) => p.id === productId);
    const requiredImages = ["front", "side", "top", "bottom", "rear"];
    let hasError = false;
    const newErrors = {};

    // Local validation
    requiredImages.forEach((type) => {
      if (!product.images[type]) {
        hasError = true;
        newErrors[type] = "This image is required";
      }
    });

    if (hasError) {
      setErrors((prev) => ({ ...prev, [productId]: newErrors }));
      return;
    }

    try {
      setUploading((prev) => ({ ...prev, [productId]: true })); // 🔹 Start loader

      const cart_item_id = localStorage.getItem("cart_item_id");
      const formData = new FormData();
      formData.append("_method", "PATCH");
      requiredImages.forEach((type) =>
        formData.append(`${type}_view_image`, product.images[type])
      );

      await upload_product_images(cart_item_id, productId, formData);

      // Refresh uploaded images
      const res = await Show_Uploaded_products_images(cart_item_id, productId);
      if (res?.data?.status) {
        const data = res.data.data;
        setUploadedImages((prev) => ({
          ...prev,
          [productId]: {
            front: data.front_view_image_url,
            side: data.side_view_image_url,
            top: data.top_view_image_url,
            bottom: data.bottom_view_image_url,
            rear: data.rear_view_image_url,
          },
        }));
      }

      alert("Product images uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error || error);

      if (error?.data?.errors) {
        const apiErrors = error.data.errors;
        let errorMsg = "";

        Object.keys(apiErrors).forEach((key) => {
          errorMsg += `${apiErrors[key].join(", ")}\n`;
        });

        alert(errorMsg.trim());
        setErrors((prev) => ({ ...prev, [productId]: apiErrors }));
      } else {
        alert("Upload failed, please try again!");
      }
    } finally {
      setUploading((prev) => ({ ...prev, [productId]: false })); // 🔹 Stop loader
    }
  };

  // Add this helper inside your Upload_3d_Modals component
  // const isPurchaseEnabled = () => {
  //   return products.every((product) => {
  //     const has3DModel = !!uploadedModels[product.id];
  //     const hasLabels =
  //       uploadedLabels[product.id] &&
  //       uploadedLabels[product.id].length > 0 &&
  //       uploadedLabels[product.id].every((l) => !!l);
  //     const hasComments = product.comments && product.comments.trim() !== "";

  //     return product.submitted && has3DModel && hasLabels && hasComments;
  //   });
  // };

  const isPurchaseEnabled = () => {
    // Filter only products with have_3d_model === "0"
    const filteredProducts = products.filter(
      (product) => product.have_3d_model == "0"
    );
  
    // If no such products exist, disable purchase
    if (filteredProducts.length === 0) return false;
  
    // Validate all filtered products
    return filteredProducts.every((product) => {
      const has3DModel = !uploadedModels[product.id];
      const hasLabels =
        uploadedLabels[product.id] &&
        uploadedLabels[product.id].length > 0 &&
        uploadedLabels[product.id].every((l) => !!l);
      const hasComments = product.comments && product.comments.trim() !== "";
  
      // ✅ Must have been submitted + 3D model + labels + comments
      return product.submitted && has3DModel && hasLabels && hasComments;
    });
  };
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const cart_item_id = localStorage.getItem("cart_item_id");
        const res = await User_Show_Product_Name_List({}, cart_item_id);
        if (res?.data?.data && res.data.data.length > 0) {
          setProducts(
            res.data.data.map((p) => ({
              ...p, // keep all original API fields
              submitted: true, // your UI field
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
              labels: [null], // keep as empty label for UI
              comments: p.comment || "",
            }))
          );
          // Calculate total price
          const total = res?.data?.data?.reduce((sum, product) => {
            return sum + parseFloat(product.price || 0);
          }, 0);

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
    fetchProducts();
  }, []);

  useEffect(() => {
    const cart_item_id = localStorage.getItem("cart_item_id");

    products.forEach(async (product) => {
      if (product.submitted) {
        try {
          const res = await Show_Uploaded_products_images(
            cart_item_id,
            product.id
          );

          if (res?.data?.status) {
            const data = res.data.data;
            setUploadedImages((prev) => ({
              ...prev,
              [product.id]: {
                front: data.front_view_image_url,
                side: data.side_view_image_url,
                top: data.top_view_image_url,
                bottom: data.bottom_view_image_url,
                rear: data.rear_view_image_url,
              },
            }));
          }
        } catch (err) {
          console.error("Error fetching uploaded product images:", err);
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
            const res = await Show_Uploaded_products_Label(cart_item_id, product.id);

            if (res?.data?.status && Array.isArray(res.data.data)) {
              // Store full objects {id, url} instead of just URLs
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
        setUploadedModels((prev) => ({
          ...prev,
        }));
      }
    } catch (error) {
      console.error("3D model upload failed:", error);
      alert("3D model upload failed!");
    }
  };

  const handlePurchase = async () => {
    // if (!isPurchaseEnabled()) {
    //   setErrorMessage(
    //     "Please fill all required fields for all products before purchasing."
    //   );
    //   setShowPurchaseLink(false);
    //   return;
    // }

    try {
      const res = await User_Purchase_Product();

      if (res?.data?.status) {
        setErrorMessage("Purchase completed successfully!");
        setShowPurchaseLink(false);
        navigate(`/my-orders`);
        window.location.reload();
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

      if (msg == "Insufficient wallet balance") {
        setShowPurchaseLink(true); 
      } else {
        setShowPurchaseLink(false);
      }

      console.error("Purchase Error:", msg);
    }
  };

  // 🧩 Delete single image (front/side/top/bottom/rear)
  const handleDeleteImage = async (product, type) => {
    const get_cart_item_id = localStorage.getItem("cart_item_id")
    try {
      const fieldMap = {
        front: "front_view_image",
        side: "side_view_image",
        top: "top_view_image",
        bottom: "bottom_view_image",
        rear: "rear_view_image",
      };

      const fieldName = fieldMap[type];
      if (!fieldName) return console.error("Invalid image type:", type);

      const formData = new FormData();
      formData.append("_method", "DELETE");
      formData.append("field", fieldName);
      await Delete_Modal_file(get_cart_item_id, product.id, formData);

      setUploadedImages((prev) => ({
        ...prev,
        [product.id]: {
          ...prev[product.id],
          [type]: null,
        },
      }));

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? { ...p, images: { ...p.images, [type]: null } }
            : p
        )
      );

      alert(`${type} image deleted successfully!`);
    } catch (err) {
      console.error("Error deleting image:", err);
      alert(`Failed to delete ${type} image. Please try again.`);
    }
  };


  const handleRemoveLabel = async (productId, lIdx) => {
    const labelObj = uploadedLabels[productId]?.[lIdx];

    if (!labelObj) return;
    if (!window.confirm("Are you sure you want to delete this label?")) return;

    try {
      const cart_item_id = localStorage.getItem("cart_item_id");
      const formData = new FormData();
      formData.append("_method", "DELETE");

      await upload_product_Delete_Label(cart_item_id, productId, labelObj.id, formData);
window.location.reload()
      // Remove from state
      setUploadedLabels((prev) => {
        const updated = [...prev[productId]];
        updated.splice(lIdx, 1);
        return { ...prev, [productId]: updated };
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, labels: p.labels.filter((_, i) => i !== lIdx) }
            : p
        )
      );
    } catch (err) {
      console.error("Error deleting label:", err);
      alert("Failed to delete label. Please try again.");
    }
  };

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
                    <Link to={`/upload-3d-modal`} className="page-btn">
                      I Have a 3D model
                    </Link>
                  </li>
                  <li>
                    <Link to={`/upload-modal`} className="page-btn active">
                      I Don’t have a 3D model
                    </Link>
                  </li>
                </ul>
              </div>

              {products?.map((product, idx) => (
                <div key={product.id} className="upload-actions-row">
                  {!product.submitted && product?.have_3d_model != 1 ? (
                    <div className="single-upload-action">
                      <div className="headings">
                        <h4 className="main-title">Product Name</h4>
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <input
                          className="form-control"
                          placeholder="Enter product name"
                          type="text"
                          value={product.name}
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
                      {product?.have_3d_model != 1 && (
                        <>
                          <div
                            className="single-upload-action"
                            style={{ position: "relative", marginBottom: "10px" }}
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

                            {/* ❌ Delete Button */}
                            <button
                              onClick={() =>
                                handleDeleteProduct(product.id)
                              }
                              style={{
                                position: "absolute",
                                top: "4px",
                                right: "4px",
                                background: "transparent",
                                border: "none",
                                color: "#F53042",
                                cursor: "pointer",
                                fontSize: "18px",
                                fontWeight: "bold",
                                lineHeight: "1",
                              }}
                              title="Delete Product"
                            >
                              ×
                            </button>
                          </div>


                          <div className="single-upload-action">
                            <div className="headings">
                              <h6
                                className="box-title"
                                style={{ fontWeight: "700" }}
                              >
                                Upload Product Images
                              </h6>
                              <p>
                                Supported formats: .JPG, .PNG, .GIF, .WEBP, .SVG
                              </p>
                            </div>

                            <div className="upload-box-row">
                              {["front", "side", "top", "bottom", "rear"].map(
                                (type) => (
                                  <div key={type} className="col-upload-box">
                                    <h6 className="box-title">
                                      {type.charAt(0).toUpperCase() +
                                        type.slice(1)}{" "}
                                      View
                                    </h6>

                                    {uploadedImages[product.id]?.[type] ? (
                                      <div
                                        style={{
                                          position: "relative",
                                          width: "150px",
                                          height: "150px",
                                          borderRadius: "8px",
                                          overflow: "hidden",
                                          border: "1px solid #ddd",
                                        }}
                                      >
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteImage(product, type)}
                                          style={{
                                            position: "absolute",
                                            top: "4px",
                                            right: "4px",
                                            zIndex: 10,
                                            background: "rgba(0,0,0,0.6)",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "50%",
                                            width: "22px",
                                            height: "22px",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "16px",
                                            lineHeight: "1",
                                          }}
                                          title="Remove Image"
                                        >
                                          &times;
                                        </button>

                                        <img
                                          src={uploadedImages[product.id][type]}
                                          alt={`${type} preview`}
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block",
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      <>
                                        <input
                                          className="d-none"
                                          type="file"
                                          accept="image/*"
                                          id={`product-${product.id}-${type}`}
                                          onChange={(e) =>
                                            handleImageChange(
                                              product.id,
                                              type,
                                              e.target.files[0]
                                            )
                                          }
                                        />
                                        <label
                                          htmlFor={`product-${product.id}-${type}`}
                                          className="upload-box-div"
                                          style={{
                                            width: "150px",
                                            height: "150px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            border: "1px dashed #ccc",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            overflow: "hidden",
                                          }}
                                        >
                                          {product.images[type] ? (
                                            <img
                                              src={
                                                product.images[type] instanceof
                                                  File
                                                  ? URL.createObjectURL(
                                                    product.images[type]
                                                  )
                                                  : product.images[type]
                                              }
                                              alt={`${type} preview`}
                                              style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                              }}
                                            />
                                          ) : (
                                            <>
                                              <img
                                                src={UplaodIcon}
                                                alt="UploadIcon"
                                                style={{
                                                  width: "40px",
                                                  height: "40px",
                                                }}
                                              />
                                              <span
                                                className="text"
                                                style={{
                                                  fontSize: "12px",
                                                  textAlign: "center",
                                                }}
                                              >
                                                <b>Click to upload</b>
                                                <br /> or drag and drop
                                              </span>
                                            </>
                                          )}
                                        </label>
                                      </>
                                    )}

                                    {errors[product.id]?.[type] && (
                                      <span
                                        style={{
                                          color: "red",
                                          fontSize: "12px",
                                        }}
                                      >
                                        {errors[product.id][type]}
                                      </span>
                                    )}
                                  </div>
                                )
                              )}
                            </div>

                            {!(
                              uploadedImages[product.id] &&
                              uploadedImages[product.id].front &&
                              uploadedImages[product.id].side &&
                              uploadedImages[product.id].top &&
                              uploadedImages[product.id].bottom &&
                              uploadedImages[product.id].rear
                            ) && (
                                <div className="single-upload-btns mt-4">
                                  {uploading[product.id] ? (
                                    <button className="single-btn" disabled>
                                      <span>Uploading...</span>
                                      <span className="loader"></span>
                                    </button>
                                  ) : (
                                    <button
                                      className="single-btn"
                                      onClick={() =>
                                        handleUploadImages(product.id)
                                      }
                                    >
                                      <span>Upload Images</span>
                                    </button>
                                  )}
                                </div>
                              )}
                          </div>

                          <div className="upload-box-row">
                            {product?.labels?.map((label, lIdx) => {
                              const uploadedLabel = uploadedLabels[product.id]?.[lIdx];

                              return (
                                <div key={lIdx} className="col-upload-box" style={{ position: "relative" }}>
                                  <h6 className="box-title" style={{ fontWeight: "700" }}>
                                    Upload Product Label {lIdx + 1}
                                  </h6>
                                  <p style={{ fontSize: "12px", color: "#666" }}>
                                    Supported formats: JPG, PNG, GIF, WEBP, SVG
                                  </p>

                                  <input
                                    className="d-none"
                                    type="file"
                                    accept="image/*"
                                    id={`product-${product.id}-label-${lIdx}`}
                                    onChange={(e) => handleLabelChange(product.id, lIdx, e.target.files[0])}
                                    disabled={!!uploadedLabel}
                                  />

                                  <label
                                    htmlFor={`product-${product.id}-label-${lIdx}`}
                                    className="upload-box-div"
                                    style={{
                                      height: "150px",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      border: "1px dashed #ccc",
                                      borderRadius: "8px",
                                      cursor: uploadedLabel ? "default" : "pointer",
                                      overflow: "hidden",
                                      position: "relative",
                                    }}
                                  >
                                    {uploadedLabel ? (
                                      <>
                                        {/* Delete button */}
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveLabel(product.id, lIdx)}
                                          style={{
                                            position: "absolute",
                                            top: "4px",
                                            right: "4px",
                                            zIndex: 10,
                                            background: "rgba(0,0,0,0.6)",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "50%",
                                            width: "22px",
                                            height: "22px",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "16px",
                                            lineHeight: "1",
                                          }}
                                          title="Remove Label"
                                        >
                                          &times;
                                        </button>

                                        {/* Uploaded image */}
                                        <img
                                          src={uploadedLabel.url}
                                          alt={`Label ${lIdx + 1}`}
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block",
                                          }}
                                        />
                                      </>
                                    ) : label instanceof File ? (
                                      <img
                                        src={URL.createObjectURL(label)}
                                        alt={`Label ${lIdx + 1}`}
                                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                      />
                                    ) : (
                                      <>
                                        <img src={UplaodIcon} alt="UploadIcon" style={{ width: "40px", height: "40px" }} />
                                        <span
                                          className="text"
                                          style={{ fontSize: "12px", textAlign: "center" }}
                                        >
                                          <b>Click to upload</b>
                                          <br /> or drag and drop
                                        </span>
                                      </>
                                    )}
                                  </label>
                                </div>
                              );
                            })}
                          </div>


                          <div className="single-upload-action">
                            <div className="headings mb-2">
                              <h6
                                className="box-title "
                                style={{ fontWeight: "700" }}
                              >
                                Add product dimensions
                              </h6>
                            </div>
                            <div className="dimension-row">
                              <div className="form-group">
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder="width"
                                  value={product.width}
                                  onChange={(e) =>
                                    handleChange(
                                      product.id,
                                      "width",
                                      e.target.value
                                    )
                                  }
                                />
                                <span>inch</span>
                              </div>
                              <div className="form-group">
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder="height"
                                  value={product.height}
                                  onChange={(e) =>
                                    handleChange(
                                      product.id,
                                      "height",
                                      e.target.value
                                    )
                                  }
                                />
                                <span>inch</span>
                              </div>
                              <div className="form-group">
                                <input
                                  className="form-control"
                                  type="text"
                                  value={product.depth}
                                  placeholder="depth"
                                  onChange={(e) =>
                                    handleChange(
                                      product.id,
                                      "depth",
                                      e.target.value
                                    )
                                  }
                                />
                                <span>inch</span>
                              </div>
                            </div>
                          </div>


                          <div className="single-upload-action">
                            <div className="headings">
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
                            />

                            <button
                              className="btn btn-primary mt-2"
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
                          </div>
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
                      <button
                        className="single-btn"
                        onClick={handleAddMoreProduct}
                      >
                        <img src={PlusIcon} alt="PlusIcon" />
                        <span>Add more</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Payment / Credits Section */}
              <div className="upload-payment-info">
                <div className="credits-details">
                  <p>Total Credits</p>
                  <h6 className="price">{totalPrice.toFixed(2)} </h6>
                  <p> Includes 150 credits per 3D model </p>
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

                  {/* Error message always show below the button if exists */}
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

                  {/* <Elements stripe={stripePromise}>
                                        <div style={{ textAlign: "center", marginTop: "50px" }}>
                                            <PayNowButton />
                                        </div>
                                    </Elements> */}
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

export default Upload_Modals;
