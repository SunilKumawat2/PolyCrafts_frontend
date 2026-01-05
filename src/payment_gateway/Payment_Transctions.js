import React, { useEffect, useState } from "react";
import Header_Login from "../components/common/header/Header_Login";
import Footer from "../components/common/footer/Footer";
import Table from "react-bootstrap/Table";
import { User_Payment_Transctions } from "../api/product/Product";

const Payment_Transctions = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await User_Payment_Transctions();
      setPayments(res?.data?.transactions || []);
    } catch (error) {
      console.error("Payment fetch error:", error);
      // alert("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <main>
      <Header_Login />

      <div className="container mt-5 mb-5">
        <h3 className="mb-4">Payment Transactions</h3>

        {loading ? (
          <p>Loading transactions...</p>
        ) : payments.length === 0 ? (
          <p>No payment transactions found.</p>
        ) : (
          <Table bordered striped hover responsive>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Invoice</th>
                <th>Receipt</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.id}</td>
                  <td>
                    {item.amount} {item.currency.toUpperCase()}
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        item.status === "succeeded"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>
                    {new Date(item.created_at * 1000).toLocaleString()}
                  </td>

                  <td>
                    {
                        item?.invoice_url && (
                            <a
                            href={item?.invoice_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-primary"
                          >
                            View Invoice
                          </a>
                        )
                    }
                   
                  </td>

                  <td>
                    {
                      item?.receipt_url && (
                        <a
                        href={item?.receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-primary"
                      >
                        View Receipt
                      </a>
                      )  
                    }
                 
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      <Footer />
    </main>
  );
};

export default Payment_Transctions;
