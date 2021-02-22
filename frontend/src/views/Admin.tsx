import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, Col, Form, Image, Row, Spinner } from "react-bootstrap";

import {
  getUncertainImage,
  updateUncertainImage,
} from "../api/imageValidation";

interface ImageData {
  imageId: string;
  imageUrl: string;
  status: string;
}

const Admin: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [images, setImages] = useState<ImageData[]>([]);

  const fetchImages = useCallback(async () => {
    try {
      setIsLoading(true);
      setAlertMessage("");
      setImages([]);
      const data = await getUncertainImage();
      const formattedData = data.map((item) => {
        const output: ImageData = {
          imageId: item.imageId,
          imageUrl: item.imageUrl,
          status: "UNCERTAIN",
        };
        return output;
      });
      setImages(formattedData);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      if (error.response) {
        setAlertMessage(error.response.data.message);
      } else {
        setAlertMessage("Something went wrong");
      }
    }
  }, []);

  const handleChangeStatus = (imageId: string, status: string) => {
    if (status === "UNCERTAIN" || status === "PASS" || status === "BAN") {
      const newImages = images.map((item) => {
        if (item.imageId === imageId) {
          return {
            imageId,
            imageUrl: item.imageUrl,
            status,
          };
        }

        return item;
      });
      setImages(newImages);
    }
  };

  const handleSubmit = async () => {
    const data = images
      .filter(
        (item) =>
          item.status !== "UNCERTAIN" &&
          (item.status === "PASS" || item.status === "BAN")
      )
      .map((item) => {
        return {
          imageId: item.imageId,
          status: item.status,
        };
      });
    if (data.length <= 0) {
      return;
    }
    await updateUncertainImage(data);
    fetchImages();
  };

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <div className="common-content-box">
      <Row>
        <Col>
          <h3>Admin</h3>
        </Col>
      </Row>
      {alertMessage ? (
        <Row>
          <Col>
            <Alert variant="danger">{alertMessage}</Alert>
          </Col>
        </Row>
      ) : null}
      {isLoading ? (
        <Row>
          <Col>
            <Spinner animation="border" variant="primary" />
          </Col>
        </Row>
      ) : (
        <>
          <Row>
            <Col>
              {images.length === 0
                ? "NO DATA"
                : images.map((item) => {
                    return (
                      <Row key={item.imageId} style={{ marginBottom: "20px" }}>
                        <Col sm={4}>
                          <Image src={item.imageUrl} rounded />
                        </Col>
                        <Col sm={8}>
                          <Form.Group controlId="exampleForm.SelectCustom">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                              as="select"
                              value={item.status}
                              onChange={({ target }) =>
                                handleChangeStatus(item.imageId, target.value)
                              }
                            >
                              <option value="UNCERTAIN">UNCERTAIN</option>
                              <option value="PASS">PASS</option>
                              <option value="BAN">BAN</option>
                            </Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                    );
                  })}
            </Col>
          </Row>
          <Row>
            <Button
              variant="success"
              style={{ width: "100%" }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Row>
        </>
      )}
    </div>
  );
};

export default Admin;
