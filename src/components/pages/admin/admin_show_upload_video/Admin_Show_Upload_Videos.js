import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import Button from "react-bootstrap/Button";
import Header_Admin from "../../../common/header/Header_Admin";
import Footer from "../../../common/footer/Footer";
import {
  Admin_show_Upload_Video_teampletas,
  Admin_Delete_Upload_Video_teampletas,
} from "../../../../api/admin/Admin"; // 👈 adjust path

const Admin_Show_Upload_Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  // ✅ Fetch videos
  const fetchVideos = async (page = 1) => {
    try {
      setLoading(true);
      const res = await Admin_show_Upload_Video_teampletas(page); // 👈 pass page number
      if (res?.data?.status) {
        setVideos(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(1); // load first page initially
  }, []);

  // ✅ Delete handler
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await Admin_Delete_Upload_Video_teampletas(id);
        // Refresh current page after delete
        fetchVideos(pagination.current_page);
      } catch (error) {
        console.error("Error deleting video:", error);
      }
    }
  };

  // ✅ Handle pagination click
  const handlePageChange = (page) => {
    if (page !== pagination.current_page && page > 0 && page <= pagination.last_page) {
      fetchVideos(page);
    }
  };

  // ✅ Generate pagination items
  const renderPagination = () => {
    let items = [];
    for (let number = 1; number <= pagination.last_page; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === pagination.current_page}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return items;
  };

  return (
    <main>
      <Header_Admin />
      <div className="container mt-4">
        <h3 className="mb-3">Uploaded Video Templates</h3>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Thumbnail</th>
                  <th>Video Name</th>
                  <th>Video Number</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {videos.length > 0 ? (
                  videos.map((video, index) => (
                    <tr key={video.video_number}>
                      <td>{(pagination.current_page - 1) * pagination.per_page + index + 1}</td>
                      <td>
                        <img
                          src={video.video_image_url}
                          alt={video.video_name}
                          width="80"
                          height="60"
                          style={{ objectFit: "cover", borderRadius: "6px" }}
                        />
                      </td>
                      <td>{video.video_name}</td>
                      <td>{video.video_number}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(video.video_number)} // 👈 use video_number or id
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No videos found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/* ✅ Pagination controls */}
            <Pagination className="justify-content-center">
              <Pagination.Prev
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
              />
              {renderPagination()}
              <Pagination.Next
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
              />
            </Pagination>
          </>
        )}
      </div>
      <Footer />
    </main>
  );
};

export default Admin_Show_Upload_Videos;
