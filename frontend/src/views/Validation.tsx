import React, { useCallback, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { validateImage } from "../api/imageValidation";

const Validation: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        setIsLoading(true);
        setIsError(false);
        setAlertMessage("");
        const imageId = await validateImage(imageUrl);
        setAlertMessage("ImageId: " + imageId);
      } catch (error) {
        setIsError(true);
        console.error(error);
        if (error.response) {
          setAlertMessage(error.response.data.message);
        } else {
          setAlertMessage("Something went wrong");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [imageUrl]
  );

  return (
    <div className="common-content-box">
      <Row>
        <Col>
          <h3>Validation</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formImageUrl">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter image url"
                value={imageUrl}
                disabled={isLoading}
                onChange={({ target }) => setImageUrl(target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formSubmitButton">
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? "Loading" : "Send"}
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          {!isLoading && alertMessage && (
            <Alert variant={isError ? "danger" : "primary"}>
              {alertMessage}
            </Alert>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Validation;
