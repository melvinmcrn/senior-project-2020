import React, { useCallback, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { getResult } from "../api/imageValidation";

const Result: React.FC = () => {
  const [imageId, setImageId] = useState<string>("");
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
        const result = await getResult(imageId);
        if (result) {
          setAlertMessage("Result: " + result);
        } else {
          setAlertMessage("Result: IN PROGRESS");
        }
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
    [imageId]
  );
  return (
    <div className="common-content-box">
      <Row>
        <Col>
          <h3>Result</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formImageId">
              <Form.Label>Image ID</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter image id"
                value={imageId}
                disabled={isLoading}
                onChange={({ target }) => setImageId(target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formSubmitButton">
              <Button variant="primary" type="submit" disabled={isLoading}>
                Send
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

export default Result;
